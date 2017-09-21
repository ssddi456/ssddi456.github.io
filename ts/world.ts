import { Shader } from './shaders/base_shader';
import { Light } from "./light";
import { Shape } from "./shape";

// tslint:disable-next-line:interface-name
interface Matrix {
    flatten(): number[];
    clone(): Matrix;
    x(m: Matrix): Matrix;
    inverse(): Matrix;
    transpose(): Matrix;
}

export interface ISize {
    width: number;
    height: number;
}

export class Camara {
    fv = 45;
    width = 640;
    height = 480;
    get radio() {
        return this.width / this.height;
    }
    nearClip = 0.1;
    farClip = 1000;
    eye: [number, number, number] = [0, 5, 20];
    center: [number, number, number] = [0, 0, -25];
    up: [number, number, number] = [0, 1, 0];
    get matrix(): Matrix {
        return makePerspective(this.fv, this.radio, this.nearClip, this.farClip)
            .x(makeLookAt.apply(null,
                [].concat(this.eye, this.center, this.up)));
    }
}

export class World {
    camara: Camara;

    meshes: Shape[] = [];
    lights: Light[] = [];

    gl: WebGLRenderingContext;
    lastUsedShader: Shader;

    width: number;
    height: number;

    constructor(gl: WebGLRenderingContext, size: ISize) {
        this.gl = gl;
        // Set clear color to black, fully opaque
        gl.clearColor(0, 0, 0, 1.0);
        // Enable depth testing
        gl.enable(gl.DEPTH_TEST);
        // Near things obscure far things
        gl.depthFunc(gl.LEQUAL);
        // Clear the color as well as the depth buffer.
        gl.viewport(0, 0, size.width, size.height);
        this.width = size.width;
        this.height = size.height;
        // tslint:disable-next-line:no-bitwise
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    attachLight(light: Light) {
        if (this.lights.indexOf(light) === -1) {
            this.lights.push(light);
            light.init(this.gl, this);
        }
    }

    attachObject(mesh: Shape) {
        if (this.meshes.indexOf(mesh) === -1) {
            this.meshes.push(mesh);
            mesh.init(this.gl, this);
        }
    }

    useShader(shader: Shader) {
        if (shader === this.lastUsedShader) {
            return;
        }
        if (this.lastUsedShader) {
            this.lastUsedShader.mounted = false;
        }

        this.gl.useProgram(shader.shaderProgram);
        shader.mount(this.gl);
        shader.mounted = true;
        this.lastUsedShader = shader;
    }
    render() {
        const gl = this.gl;

        gl.viewport(0, 0, this.camara.width, this.camara.height);
        // tslint:disable-next-line:no-bitwise
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const camaraMatrixFlat = new Float32Array(this.camara.matrix.flatten());

        for (let index = 0; index < this.meshes.length; index++) {
            const mesh = this.meshes[index];
            mesh.render(this, camaraMatrixFlat, this.lights);
        }
    }
    createScene() {
        const scene = new Scene(this.gl, this);
        return scene;
    }
}

export class Scene extends World {
    frameBuffer: WebGLFramebuffer = null;
    renderBuffer: WebGLRenderbuffer = null;

    world: World;

    beforeRender: (...args: any[]) => any;

    constructor(gl: WebGLRenderingContext, world: World) {
        super(gl, world);
        this.gl = gl;
        this.world = world;
    }

    clone() {
        const scene = new Scene(this.gl, this.world);
        scene.camara = this.camara;
        scene.lights = [...this.lights];
        scene.meshes = [...this.meshes];
        return scene;
    }

    attachLight(light: Light) {
        if (this.lights.indexOf(light) === -1) {
            this.world.attachLight(light);
            this.lights.push(light);
        }
    }
    attachObject(mesh: Shape) {
        if (this.meshes.indexOf(mesh) === -1) {
            this.world.attachObject(mesh);
            this.meshes.push(mesh);
        }
    }

    useShader(shader: Shader) {
        this.world.useShader(shader);
    }
    render() {
        if (this.beforeRender) {
            this.beforeRender();
        }

        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
        if (this.camara) {
            gl.viewport(0, 0, this.camara.width, this.camara.height);
        } else {
            gl.viewport(0, 0, this.width, this.height);
        }
        // Enable depth testing
        gl.enable(gl.DEPTH_TEST);
        // Near things obscure far things
        gl.depthFunc(gl.LEQUAL);
        gl.clearColor(0, 0, 0, 1.0);
        // Clear the color as well as the depth buffer.
        // tslint:disable-next-line:no-bitwise
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const camaraMatrixFlat = this.camara ? new Float32Array(this.camara.matrix.flatten()) : null;

        for (let index = 0; index < this.meshes.length; index++) {
            const mesh = this.meshes[index];
            mesh.render(this, camaraMatrixFlat, this.lights);
        }
    }
}
