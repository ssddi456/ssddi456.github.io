import { Shape } from "./shape";
import { World } from "./world";
import { Shader } from "./shaders/base_shader";
import { LineVertexColorShader } from "./shaders/line_vertex_color_shader";
import { Vector3 } from "./libs/2dRoad";
import { createBuffer } from "./libs/utils";

export class Line extends Shape {
    bindBufferAndDraw(shader: Shader, gl: any) {
        throw new Error("Method not implemented.");
    }

    start: Vector3;
    end: Vector3;
    lineBuffer: WebGLBuffer;

    index = [0, 1];
    indexBuffer: WebGLBuffer;

    lineVertexCounts: number = 2;

    verticesColor: number[];
    vertexColorBuffer: WebGLBuffer;

    get points(): number[] {
        return [].concat(this.start, this.end);
    }
    async init(gl: WebGLRenderingContext) {

        this.lineBuffer = createBuffer(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.STATIC_DRAW);

        this.vertexColorBuffer = createBuffer(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesColor), gl.STATIC_DRAW);

        this.indexBuffer = createBuffer(gl);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index), gl.STATIC_DRAW);

        this.shader.init(gl);
        this.inited = true;
    }

    dispose(world: World) {
        const gl = world.gl;
        gl.deleteBuffer(this.lineBuffer);
        gl.deleteBuffer(this.indexBuffer);
        gl.deleteBuffer(this.vertexColorBuffer);
        this.disposed = true;
    }

    clone() {
        const clone = new Line();
    }
    static singleSimepleShader: Shader;
    static get simepleShader(): Shader {
        if (!Line.singleSimepleShader) {
            Line.singleSimepleShader = new LineVertexColorShader();
        }
        return Line.singleSimepleShader;
    };
    static createSimpleLine(
        start: Vector3,
        direct: Vector3,
        trs: Matrix,
    ) {

        const normalLine = new Line();
        normalLine.start = start;
        normalLine.end = [start[0] + direct[0], start[1] + direct[1], start[2] + direct[2]];
        normalLine.verticesColor = [
            0.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
        ];

        normalLine.shader = Line.simepleShader;
        normalLine.trs = trs.clone();
        return normalLine;

    }
    static createSimpleLine2(
        start: Vector3,
        end: Vector3,
        trs: Matrix,
    ) {

        const normalLine = new Line();
        normalLine.start = start;
        normalLine.end = end;
        normalLine.verticesColor = [
            0.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
        ];

        normalLine.shader = Line.simepleShader;
        normalLine.trs = trs.clone();
        return normalLine;
    }
}
