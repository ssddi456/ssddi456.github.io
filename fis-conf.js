var path = require('path');

fis.set('project.files', ['ts/**','shaders/**']);
fis.set('project.ignore', ['js/**', 'css/**', 'lib/**', 'node_modules/**', '.git/**']);
fis.hook('amd');

fis.match('ts/((**).ts)', {
    parser: fis.plugin('typescript', {
                module: 1,
                target: 0,
                sourceMap: false,
            }),
    release: "$1",
    moduleId: 'js/$2',
    isMod: true,
    rExt: '.js',
});

fis.match('shaders/*.glsl', {
    parser: [function (content, file) {
        var id = file.getId();
        var basename = path.basename(id);
        var type;

        if (basename.match(/-fs.glsl$/)) {
            type = 'gl.FRAGMENT_SHADER';
        } else if (basename.match(/-vs.glsl$/)) {
            type = 'gl.VERTEX_SHADER';
        }

        return  'return function (gl) {\n' + 
                '    var source = ' + JSON.stringify(content.toString()) + ';\n'+
                '    var type = ' + type + ';\n' + 
                '    var shader = gl.createShader(type);\n' +
                '    gl.shaderSource(shader, source);\n' + 
                '    // Compile the shader program\n' + 
                '    gl.compileShader(shader);\n' + 
                '    // See if it compiled successfully\n'+
                '    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  \n'+
                '        console.log(\'An error occurred compiling the shaders: \' + gl.getShaderInfoLog(shader));  \n'+
                '        gl.deleteShader(shader);\n'+
                '        return null;  \n'+
                '    }\n'+
                '    return shader;\n'+
                '};\n';
    }],
    isMod: true,
    rExt: '.glsl.js',
    moduleId: 'js$0.js',
    isJsLike: true,
});

fis.media('dev')
    .match('*',{
        deploy: [fis.plugin('local-deliver')] 
    });

