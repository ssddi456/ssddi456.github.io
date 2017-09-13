var path = require('path');


fis.set('project.files', ['ts/**', 'shaders/**']);
fis.set('project.ignore', ['js/**', 'css/**', 'lib/**', 'node_modules/**', '.git/**']);
fis.hook('amd');

fis.match('ts/((**).ts)', {
    parser: fis.plugin('typescript', {
        module: 1,
        target: 0,
        sourceMap: false,
        compilerOptions: require(path.join(__dirname, './tsconfig.json')).compilerOptions
    }),
    release: "$1",
    moduleId: 'js/$2',
    isMod: true,
    rExt: '.js',
});


function createDerivedFile(file, relativePath, content, requires) {
    var derived = fis.file.wrap(path.join(file.realpath, relativePath));
    derived.setContent(content);
    fis.compile.process(derived);
    if (requires && requires.length) {
        requires.forEach(function (requiredId) {
            derived.addRequire(requiredId);
        });
    }

    file.extras = file.extras || {};
    file.extras.derived = file.extras.derived || [];
    file.extras.derived.push(derived);
}

var shader_map = {};

function get_shader_obj(file, basename) {
    var wrapper_basename = basename.slice(0, -8);
    if (!shader_map[wrapper_basename]) {
        var shader_name = wrapper_basename.split('_').map(function (name) {
            return name[0].toUpperCase() + name.slice(1);
        }).join('');

        shader_map[wrapper_basename] = {
            fs_compiled: false,
            vs_compiled: false,
            shader_file_path: '../../ts/shaders/' + wrapper_basename + '.ts',
            shader_name: shader_name,
            wrapper_basename: wrapper_basename,
            attributes: {},
            uniforms: {},
            binding: {},// 用注释实现这个？
            requires: [],
            end_compile(file) {
                this.requires.push(file.getId());
                if (this.fs_compiled && this.vs_compiled) {
                    createShaderFile(file, this);
                }
            }
        };
    }
    return shader_map[wrapper_basename];
}

var reg_attr = /\b(attribute|uniform)\s+((highp|lowp)\s+)?(vec2|vec3|vec4|mat4|sampler2D)\s+([^;]+);(\s*\/\/\s*([^ ]+))?/g;
function compileFragmentShader(file, name, fshader_content) {
    var shader_obj = get_shader_obj(file, name);
    fshader_content.toString().replace(reg_attr, function ($, $attr_type, $1, $modifier, $type, $name, $2, $bindName) {
        var info = {
            type: $type
        };
        if ($bindName) {
            info.binding = $bindName;
        }
        shader_obj[$attr_type + 's'][$name] = info;
    });
    shader_obj.fs_compiled = true;
    shader_obj.end_compile(file);
}

function compileVertexShader(file, name, vshader_content) {
    var shader_obj = get_shader_obj(file, name);
    vshader_content.toString().replace(reg_attr, function ($, $attr_type, $1, $modifier, $type, $name, $2, $bindName) {
        var info = {
            type: $type
        };
        if ($bindName) {
            info.binding = $bindName;
        }
        shader_obj[$attr_type + 's'][$name] = info;
    });
    shader_obj.vs_compiled = true;
    shader_obj.end_compile(file);
}

function forOf(obj, handler) {
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            handler(k, obj[k], obj);
        }
    }
}
function createShaderFile(file, shader_info) {

    var content = [
        'import { Shader, ShaderFactory } from "./base_shader";',
        'import { World } from "../world";',
        'import { Light } from "../light";',
        'import { Mesh } from "../mesh";',
        '',
        'export class ' + shader_info.shader_name + 'Shader extends Shader {',
        '    bindBuffer: (k: string, value: WebGLBuffer | Float32Array | number) => void',
        '    vertexShaderFactory: ShaderFactory = require("../shaders/' + shader_info.wrapper_basename + '-vs.glsl");',
        '    fragementShaderFactory: ShaderFactory = require("../shaders/' + shader_info.wrapper_basename + '-fs.glsl");',
    ];

    forOf(shader_info.attributes, function (k, v, obj) {
        content.push(k + ': number;');
    });
    forOf(shader_info.uniforms, function (k, v, obj) {
        content.push(k + ': WebGLUniformLocation;');
    });

    content = content.concat([
        '    mount(gl: WebGLRenderingContext) {',
        '        const shaderProgram = this.shaderProgram;'
    ]);
    forOf(shader_info.attributes, function (k, v, obj) {
        content.push('this.' + k + ' = gl.getAttribLocation(shaderProgram, "' + k + '");');
        content.push('gl.enableVertexAttribArray(this.' + k + ');');
    });
    forOf(shader_info.uniforms, function (k, v, obj) {
        content.push('this.' + k + ' = gl.getUniformLocation(this.shaderProgram, "' + k + '");');
    });

    content = content.concat([
        'this.bindBuffer = function(k: string, value: WebGLBuffer | Float32Array | number) {',
        '        switch (k) {',]);

    forOf(shader_info.attributes, function (k, v, obj) {
        var perVectorBit = {
            'vec4': 4,
            'vec3': 3,
            'vec2': 2,
            'float': 1,
        }[v.type];

        if (!perVectorBit) {
            throw new Error('unknow attribute value type : ' + k + '=>' + v.type);
        }

        content.push('            case "' + k + '":');
        content.push('                gl.bindBuffer(gl.ARRAY_BUFFER, value);');
        content.push('                gl.vertexAttribPointer(this.' + k + ', ' + perVectorBit + ', gl.FLOAT, false, 0, 0);');
        content.push('                break;');
    });
    forOf(shader_info.uniforms, function (k, v, obj) {
        var uniformFunc = {
            'mat4': 'uniformMatrix4fv',
            'vec3': 'uniform3fv',
            'sampler2D': 'uniform1i',
        }[v.type];

        if (!uniformFunc) {
            throw new Error('unknow uniform value type : ' + k + '=>' + v.type);
        }

        content.push('            case "' + k + '":');
        content.push('                gl.' + uniformFunc + '(this.' + k + ', value);');
        content.push('                break;');
    });
    content = content.concat([
        '        }',
        '    }',
    ]);

    content = content.concat([
        '    }',
    ]);
    content = content.concat([
        '    render(world: World, mesh: Mesh, camaraMatrixFlat: Float32Array, lights: Light[]) {',
        '        const gl = world.gl;',
        '        if (lights && lights.length) {',
        '            if (this.uDirectionalLightColor && this.uDirectionalVector) {',
        '                gl.uniform3fv(this.uDirectionalLightColor, lights[0].color);',
        '                gl.uniform3fv(this.uDirectionalVector, lights[0].direction);',
        '            }',
        '            if (this.uNormalMatrix) {',
        '                const normalMatrix = mesh.trs.inverse().transpose();',
        '                gl.uniformMatrix4fv(this.uNormalMatrix, false, new Float32Array(normalMatrix.flatten()));',
        '            }',
        '        }',
        '        gl.uniformMatrix4fv(this.uPMatrix, false, camaraMatrixFlat);',
        '        gl.uniformMatrix4fv(this.uMVMatrix, false, new Float32Array(mesh.trs.flatten()));',
        '        mesh.bindBufferAndDraw(this, gl);',
        '    }',
        ' }']);

    content = content.join('\n');

    createDerivedFile(file, shader_info.shader_file_path, content);
}


fis.match('shaders/*.glsl', {
    parser: [function (content, file) {
        var id = file.getId();
        var basename = path.basename(id);

        var type;

        if (basename.match(/-fs.glsl$/)) {
            compileFragmentShader(file, basename, content);
            type = 'gl.FRAGMENT_SHADER';
        } else if (basename.match(/-vs.glsl$/)) {
            compileVertexShader(file, basename, content);
            type = 'gl.VERTEX_SHADER';
        }

        //
        return 'return function (gl) {\n' +
            '    var source = ' + JSON.stringify(content.toString()) + ';\n' +
            '    var type = ' + type + ';\n' +
            '    var shader = gl.createShader(type);\n' +
            '    gl.shaderSource(shader, source);\n' +
            '    // Compile the shader program\n' +
            '    gl.compileShader(shader);\n' +
            '    // See if it compiled successfully\n' +
            '    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  \n' +
            '        console.log(\'An error occurred compiling the shaders: \' + gl.getShaderInfoLog(shader));  \n' +
            '        gl.deleteShader(shader);\n' +
            '        return null;  \n' +
            '    }\n' +
            '    return shader;\n' +
            '};\n';
    }],
    isMod: true,
    rExt: '.glsl.js',
    moduleId: 'js$0.js',
    isJsLike: true,
});

fis.media('dev')
    .match('*', {
        deploy: [fis.plugin('local-deliver')]
    });

