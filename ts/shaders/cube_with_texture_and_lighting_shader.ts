
import { Shader, ShaderFactory } from "./base_shader";
import { World } from "../world";
import { Light } from "../light";
import { Mesh } from "../mesh";

export class CubeWithTextureAndLightingShader extends Shader {

    vertexShaderFactory: ShaderFactory = require("../shaders/cube_with_lighting-vs.glsl");
    fragementShaderFactory: ShaderFactory = require("../shaders/cube_with_lighting-fs.glsl");

    aVertexPosition: number;
    aTextureCoord: number;
    aVertexNormal: number;

    uNormalMatrix: WebGLUniformLocation;
    uSampler: WebGLUniformLocation;
    uPMatrix: WebGLUniformLocation;
    uMVMatrix: WebGLUniformLocation;
    uDirectionalLightColor: WebGLUniformLocation;
    uDirectionalVector: WebGLUniformLocation;

    mount(gl: WebGLRenderingContext) {

        const shaderProgram = this.shaderProgram;

        gl.useProgram(shaderProgram);

        this.aVertexNormal = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(this.aVertexNormal);

        this.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(this.aVertexPosition);

        this.aTextureCoord = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
        gl.enableVertexAttribArray(this.aTextureCoord);

        this.uSampler = gl.getUniformLocation(this.shaderProgram, "uSampler");
        this.uNormalMatrix = gl.getUniformLocation(this.shaderProgram, "uNormalMatrix");
        this.uPMatrix = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        this.uMVMatrix = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
        this.uDirectionalLightColor = gl.getUniformLocation(this.shaderProgram, 'uDirectionalLightColor');
        this.uDirectionalVector = gl.getUniformLocation(this.shaderProgram, 'uDirectionalVector');
    }

    render(world: World, mesh: Mesh, camaraMatrixFlat: number[], lights: Light[]) {
        const gl = world.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
        gl.vertexAttribPointer(this.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureCoordinatesBuffer);
        gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexNormalBuffer);
        gl.vertexAttribPointer(this.aVertexNormal, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.facesBuffer);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, mesh.texture);

        gl.uniform1i(this.uSampler, 0);

        gl.uniform3fv(this.uDirectionalLightColor, lights[0].color);
        gl.uniform3fv(this.uDirectionalVector, lights[0].direction);

        gl.uniformMatrix4fv(this.uPMatrix, false, new Float32Array(camaraMatrixFlat));
        gl.uniformMatrix4fv(this.uMVMatrix, false, new Float32Array(mesh.trs.flatten()));

        const normalMatrix = mesh.trs.inverse().transpose();
        gl.uniformMatrix4fv(this.uNormalMatrix, false, new Float32Array(normalMatrix.flatten()));

        gl.drawElements(gl.TRIANGLES, mesh.faces.length, gl.UNSIGNED_SHORT, 0);
    }
}
