
import { Shader, ShaderFactory } from "./base_shader";
import { World } from "../world";
import { Mesh } from "../mesh";

export class VertexColorShader extends Shader {
    vertexShaderFactory: ShaderFactory = require("../shaders/cube_with_face_color-vs.glsl");
    fragementShaderFactory: ShaderFactory = require("../shaders/cube_with_face_color-fs.glsl");

    aVertexPosition: number;
    aVertexColor: number;
    uPMatrix: WebGLUniformLocation;
    uMVMatrix: WebGLUniformLocation;

    shaderProgram: WebGLProgram;

    mount(gl: WebGLRenderingContext) {
        const shaderProgram = this.shaderProgram;

        this.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(this.aVertexPosition);

        this.aVertexColor = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(this.aVertexColor);

        this.uPMatrix = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        this.uMVMatrix = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    }

    render(world: World, mesh: Mesh, camaraMatrixFlat: Float32Array) {
        const gl = world.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
        gl.vertexAttribPointer(this.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexColorBuffer);
        gl.vertexAttribPointer(this.aVertexColor, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.facesBuffer);

        gl.uniformMatrix4fv(this.uPMatrix, false, camaraMatrixFlat);
        gl.uniformMatrix4fv(this.uMVMatrix, false, new Float32Array(mesh.trs.flatten()));

        gl.drawElements(gl.TRIANGLES, mesh.faces.length, gl.UNSIGNED_SHORT, 0);
    }
}
