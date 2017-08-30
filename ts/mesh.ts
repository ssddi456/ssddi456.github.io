
import { Shader } from "./shaders/base_shader";
import { Shape } from "./shape";
import { World } from "./world";
import { Light } from "./light";
import { Line } from "./line";
import { LineVertexColorShader } from "./shaders/line_vertex_color_shader";
import { Vector3 } from "./libs/2dRoad";

export class Mesh extends Shape {
    vertices: number[];
    vertexBuffer: WebGLBuffer;

    faces: number[];
    facesBuffer: WebGLBuffer;

    vertexColors: number[];
    vertexColorBuffer: WebGLBuffer;

    textureCoordinates: number[];
    textureCoordinatesBuffer: WebGLBuffer;

    vertexNormal: number[];
    vertexNormalBuffer: WebGLBuffer;

    textureSrc: string;
    texture: WebGLTexture;


    async loadTexture(gl: WebGLRenderingContext) {
        if (!this.textureSrc) {
            return;
        }
        const texture = this.texture = gl.createTexture();
        const image = new Image();
        const loadFinsh = new Promise(function (resolve, reject) {
            image.onload = function () {
                resolve();
            };
            image.onerror = function (e) {
                reject(e);
            };
        });

        image.src = this.textureSrc;
        await loadFinsh;

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    clone() {
        const newInstance = new Mesh();
        newInstance.vertices = this.vertices.slice(0);
        newInstance.faces = this.faces.slice(0);

        if (this.vertexColors) {
            newInstance.vertexColors = this.vertexColors.slice(0);
        }

        if (this.textureCoordinates) {
            newInstance.textureCoordinates = this.textureCoordinates.slice(0);
        }

        if (this.textureSrc) {
            newInstance.textureSrc = this.textureSrc;
        }

        if (this.texture) {
            newInstance.texture = this.texture;
        }

        if (this.vertexNormal) {
            newInstance.vertexNormal = this.vertexNormal;
        }

        newInstance.shader = this.shader;
        newInstance.trs = this.trs.clone();
        newInstance.debug = this.debug;
        newInstance.visible = this.visible;
        return newInstance;
    }

    async init(gl: WebGLRenderingContext, world: World) {
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.facesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);

        if (this.vertexColors) {
            this.vertexColorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexColors), gl.STATIC_DRAW);
        }

        if (this.textureCoordinates) {
            this.textureCoordinatesBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinatesBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), gl.STATIC_DRAW);
        }

        if (this.vertexNormal) {
            this.vertexNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormal), gl.STATIC_DRAW);
        }

        await Promise.all([
            this.loadTexture(gl),
            this.addDebugObjects(world),
        ]);


        this.shader.init(gl);
        this.inited = true;
    }

    async addDebugObjects(world: World) {
        if (!this.debug) {
            return;
        }

        const normals = this.normals = [] as Array<[number, number, number, 1.0]>;
        const normalLines: Line[] = this.normalLines = [];
        const meshLines: Line[] = this.meshLins = [];

        const transformedNormalLines: Line[] = this.transformedNormalLines = [];
        const vertexFinalLightLines: Line[] = this.vertexFinalLightLines = [];

        for (let index = 0; index < this.faces.length; index += 3) {
            const vertex1 = this.vertices.slice(this.faces[index] * 3, this.faces[index] * 3 + 3) as Vector3;
            const vertex2 = this.vertices.slice(this.faces[index + 1] * 3, this.faces[index + 1] * 3 + 3) as Vector3;
            const vertex3 = this.vertices.slice(this.faces[index + 2] * 3, this.faces[index + 2] * 3 + 3) as Vector3;

            const line1 = Line.createSimpleLine2(vertex1, vertex2, this.trs);

            meshLines.push(line1);
            const line2 = Line.createSimpleLine2(vertex2, vertex3, this.trs);

            meshLines.push(line2);
            const line3 = Line.createSimpleLine2(vertex3, vertex1, this.trs);

            meshLines.push(line3);

            await Promise.all([
                await world.attachObject(line1),
                await world.attachObject(line2),
                await world.attachObject(line3),
            ]);
        }

        if (this.vertexNormal) {
            for (let index = 0; index < this.vertexNormal.length; index += 3) {
                const normal = this.vertexNormal.slice(index, index + 3) as [number, number, number];
                const vertex = this.vertices.slice(index, index + 3) as [number, number, number];

                normals.push([normal[0], normal[1], normal[2], 1]);

                const normalLine = Line.createSimpleLine(vertex, normal, this.trs);
                await world.attachObject(normalLine);
                normalLines.push(normalLine);

                const transformedNormalLine = Line.createSimpleLine(vertex, normal, this.trs);
                transformedNormalLine.verticesColor = [
                    0, 1, 0, 1,
                    1, 0, 1, 1,
                ];
                await world.attachObject(transformedNormalLine);
                transformedNormalLines.push(transformedNormalLine);

                const finalLightLine = Line.createSimpleLine([
                    vertex[0] + 0.2 * normal[0],
                    vertex[1] + 0.2 * normal[1],
                    vertex[2] + 0.2 * normal[2],
                ], normal, this.trs);
                finalLightLine.verticesColor = [
                    1, 1, 1, 1,
                    1, 0, 1, 1,
                ];
                await world.attachObject(finalLightLine);
                vertexFinalLightLines.push(finalLightLine);

            }
        }

        const originX = this.x;
        this.x = function (this: Mesh, matrix: Matrix) {
            this.normalLines.forEach((x) => x.x(matrix));
            this.transformedNormalLines.forEach((x) => x.x(matrix));
            this.vertexFinalLightLines.forEach((x) => x.x(matrix));
            this.meshLins.forEach((x) => x.x(matrix));
            return originX.call(this, matrix);
        };
    }

    meshLins: Line[];
    normalLines: Line[];
    normals: Array<[number, number, number, 1.0]>;
    transformedNormalLines: Line[];
    vertexFinalLightLines: Line[];

    updateDebug(world: World, lights: Light[]) {
        const mainLight = lights[0];
        const gl = world.gl;

        this.normalLines.forEach((x) => x.visible = false);
        this.vertexFinalLightLines.forEach((x) => x.visible = false);
        this.transformedNormalLines.forEach((x) => x.visible = false);

        if (!mainLight) {
            this.transformedNormalLines.forEach((x) => x.visible = false);
        } else {
            const objAxis = this.trs.inverse().transpose();
            const lightDirection = $V(mainLight.direction).toUnitVector();

            this.transformedNormalLines.forEach((x, i) => {
                const start = x.start;
                const normal = this.normals[i];
                const transformedNormalLine = objAxis.multiply(Matrix.create([
                    [normal[0]],
                    [normal[1]],
                    [normal[2]],
                    [normal[3]],
                ]));

                x.end = [
                    start[0] + transformedNormalLine.elements[0][0],
                    start[1] + transformedNormalLine.elements[1][0],
                    start[2] + transformedNormalLine.elements[2][0],
                ];

                gl.bindBuffer(gl.ARRAY_BUFFER, x.lineBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(x.points), gl.STATIC_DRAW);

                const finalLightLine = this.vertexFinalLightLines[i];

                let lightPower = $V([].concat.apply([], transformedNormalLine.elements.slice(0, 3)))
                    .dot(lightDirection);

                lightPower = Math.max(0, lightPower);

                finalLightLine.end = [
                    finalLightLine.start[0] + lightPower * normal[0],
                    finalLightLine.start[1] + lightPower * normal[1],
                    finalLightLine.start[2] + lightPower * normal[2],
                ];

                gl.bindBuffer(gl.ARRAY_BUFFER, finalLightLine.lineBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(finalLightLine.points), gl.STATIC_DRAW);
            });
        }
    }
}
