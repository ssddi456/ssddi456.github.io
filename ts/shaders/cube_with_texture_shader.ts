
import { Shader, ShaderFactory } from "./base_shader";
import { World, Mesh } from "../world";

export class CubeWithTextureShader extends Shader {
    vertexShaderFactory: ShaderFactory = require("../shaders/cube_with_texture-vs.glsl");
    fragementShaderFactory: ShaderFactory = require("../shaders/cube_with_texture-fs.glsl");

    aVertexPosition: number;
    textureCoordAttribute: number;
    shaderProgram: WebGLProgram;

    clone() {
        const newInstance = new CubeWithTextureShader();
        newInstance.vertexShaderFactory = this.vertexShaderFactory;
        newInstance.fragementShaderFactory = this.fragementShaderFactory;
        return newInstance;
    }
    init(gl: WebGLRenderingContext) {
        if (this.inited) {
            return false;
        }
        const shaderProgram = this.shaderProgram = gl.createProgram();
        const vertexShader = this.vertexShaderFactory(gl);
        const fragementShader = this.fragementShaderFactory(gl);

        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragementShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
        }

    }
    mount(gl: WebGLRenderingContext) {

        const shaderProgram = this.shaderProgram;

        gl.useProgram(shaderProgram);

        this.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(this.aVertexPosition);

        this.textureCoordAttribute = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
        gl.enableVertexAttribArray(this.textureCoordAttribute);
    }

    render(world: World, mesh: Mesh, camaraMatrixFlat: number[]) {
        const gl = world.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
        gl.vertexAttribPointer(this.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureCoordinatesBuffer);
        gl.vertexAttribPointer(this.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.facesBuffer);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, mesh.texture);
        gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "uSampler"), 0);

        const pUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        gl.uniformMatrix4fv(pUniform, false, new Float32Array(camaraMatrixFlat));

        const mvUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
        gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mesh.trs.flatten()));

        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
}