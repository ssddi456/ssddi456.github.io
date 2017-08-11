import { Shader, ShaderFactory } from './base_shader';
import { World } from "../world";
import { Light } from "../light";
import { Line } from "../line";

export class LineVertexColorShader extends Shader {
    vertexShaderFactory: ShaderFactory = require("../shaders/line_with_vertex_color-vs.glsl");
    fragementShaderFactory: ShaderFactory = require("../shaders/line_with_vertex_color-fs.glsl");

    aVertexPosition: number;
    aVertexColor: number;
    uPMatrix: WebGLUniformLocation;
    uMVMatrix: WebGLUniformLocation;

    mount(gl: WebGLRenderingContext) {
        const shaderProgram = this.shaderProgram;

        this.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(this.aVertexPosition);

        this.aVertexColor = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(this.aVertexColor);

        this.uPMatrix = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        this.uMVMatrix = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");

    }
    render(world: World, mesh: Line, camaraMatrixFlat: number[], lights: Light[]) {
        const gl = world.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.lineBuffer);
        gl.vertexAttribPointer(this.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexColorBuffer);
        gl.vertexAttribPointer(this.aVertexColor, 4, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(this.uPMatrix, false, new Float32Array(camaraMatrixFlat));
        gl.uniformMatrix4fv(this.uMVMatrix, false, new Float32Array(mesh.trs.flatten()));

        gl.drawElements(gl.LINE_STRIP, mesh.lineVertexCounts, gl.UNSIGNED_SHORT, 0);
    }
}
