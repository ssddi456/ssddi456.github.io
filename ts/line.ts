import { Shape } from "./shape";
import { World } from "./world";
import { Shader } from "./shaders/base_shader";
import { LineVertexColorShader } from "./shaders/line_vertex_color_shader";

export class Line extends Shape {
    start: [number, number, number];
    end: [number, number, number];
    lineBuffer: WebGLBuffer;

    index = [0, 1];
    indexBuffer: WebGLBuffer;

    lineVertexCounts: number = 2;

    verticesColor: number[];
    vertexColorBuffer: WebGLBuffer;

    get points() {
        return [].concat(this.start, this.end);
    }
    async init(gl: WebGLRenderingContext) {

        this.lineBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.STATIC_DRAW);

        this.vertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesColor), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index), gl.STATIC_DRAW);

        this.shader.init(gl);
        this.inited = true;
    }

    clone() {
        const clone = new Line();
    }

    static createSimpleLine(
        start: [number, number, number],
        direct: [number, number, number],
        trs: Matrix,
    ) {

        const normalLine = new Line();
        normalLine.start = start;
        normalLine.end = [start[0] + direct[0], start[1] + direct[1], start[2] + direct[2]];
        normalLine.verticesColor = [
            0.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
        ];
        normalLine.shader = new LineVertexColorShader();
        normalLine.trs = trs.clone();
        return normalLine;

    }
}
