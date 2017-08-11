
import { Shader } from "./shaders/base_shader";
import { Shape } from "./shape";
import { World } from "./world";
import { Light } from "./light";

export class Mesh extends Shape {
    vertices: number[];
    vertexBuffer: WebGLBuffer;

    faces: number[];
    facesBuffer: WebGLBuffer;

    verticesColor: number[];
    vertexColorBuffer: WebGLBuffer;

    textureCoordinates: number[];
    textureCoordinatesBuffer: WebGLBuffer;

    vertexNormal: number[];
    vertexNormalBuffer: WebGLBuffer;

    textureSrc: string;
    texture: WebGLTexture;


    async loadTexture(gl: WebGLRenderingContext) {
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

        if (this.verticesColor) {
            newInstance.verticesColor = this.verticesColor.slice(0);
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

        return newInstance;
    }

    async init(gl: WebGLRenderingContext) {
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.facesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);

        if (this.verticesColor) {
            this.vertexColorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesColor), gl.STATIC_DRAW);
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

        if (this.textureSrc) {
            await this.loadTexture(gl);
        }

        this.shader.init(gl);
        this.inited = true;
    }

}
