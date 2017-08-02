import { Shader } from './world';

interface Matrix {
    flatten(): number[];
    clone(): Matrix;
    x(m: Matrix): Matrix;
    inverse(): Matrix;
    transpose(): Matrix;
}

export class Camara {
    fv = 45;
    width = 640;
    height = 480;
    get radio() {
        return this.width / this.height;
    }
    nearClip = 0.1;
    farClip = 100;
    get matrix(): Matrix {
        return makePerspective(this.fv, this.radio, this.nearClip, this.farClip);
    }
}

export class Mesh {
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

    shader: Shader;
    trs: Matrix;

    inited = false;

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

    render(world: World, camaraMatrixFlat: number[]) {
        world.useShader(this.shader);
        this.shader.render(world, this, camaraMatrixFlat);
    }
}

export class World {
    camara: Camara;
    meshes: Mesh[] = [];
    gl: WebGLRenderingContext;
    lastUsedShader: Shader;

    constructor(gl: WebGLRenderingContext, size) {
        this.gl = gl;
        // Set clear color to black, fully opaque
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // Enable depth testing
        gl.enable(gl.DEPTH_TEST);
        // Near things obscure far things
        gl.depthFunc(gl.LEQUAL);
        // Clear the color as well as the depth buffer.
        // tslint:disable-next-line:no-bitwise
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.viewport(0, 0, size.width, size.height);

        this.camara = new Camara();
        this.camara.height = size.height;
        this.camara.width = size.width;
    }
    async attachObject(mesh: Mesh) {
        this.meshes.push(mesh);

        await mesh.init(this.gl);
    }

    useShader(shader: Shader) {
        if (shader === this.lastUsedShader) {
            return;
        }
        shader.mount(this.gl);
        this.lastUsedShader = shader;
    }
    render() {
        const gl = this.gl;

        // tslint:disable-next-line:no-bitwise
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const camaraMatrixFlat = this.camara.matrix.flatten();
        for (let index = 0; index < this.meshes.length; index++) {
            const mesh = this.meshes[index];
            mesh.render(this, camaraMatrixFlat);
        }
    }
}
