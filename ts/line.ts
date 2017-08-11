import { Shape } from "./shape";
import { World } from "./world";
import { Shader } from "./shaders/base_shader";

export class Line extends Shape {
    start: [number, number, number];
    end: [number, number, number];
    lineBuffer: WebGLBuffer;

    lineVertexCounts: number = 2;

    verticesColor: number[];
    vertexColorBuffer: WebGLBuffer;

    get points() {
        return [].concat(this.start, this.end);
    }
    async init(gl: WebGLRenderingContext) {

        this.lineBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.lineBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(this.points), gl.STATIC_DRAW);

        this.vertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexColorBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(this.verticesColor), gl.STATIC_DRAW);

        this.shader.init(gl);
        this.inited = true;
    }

    clone() {
        const clone = new Line();
    }
}
