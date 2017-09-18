import { Shader } from './shaders/base_shader';
import { Light } from "./light";
import { Shape } from "./shape";

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

    constructor(gl: WebGLRenderingContext, size) {
        this.gl = gl;
        // Set clear color to black, fully opaque
        gl.clearColor(0, 0, 0, 1.0);
        // Enable depth testing
        gl.enable(gl.DEPTH_TEST);
        // Near things obscure far things
        gl.depthFunc(gl.LEQUAL);
        // Clear the color as well as the depth buffer.
        // tslint:disable-next-line:no-bitwise
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.viewport(0, 0, size.width, size.height);

    }
    attachLight(light: Light) {
        this.lights.push(light);
        light.init(this.gl, this);
    }

    attachObject(mesh: Shape) {
        this.meshes.push(mesh);

        mesh.init(this.gl, this);
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

        // tslint:disable-next-line:no-bitwise
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const camaraMatrixFlat = new Float32Array(this.camara.matrix.flatten());

        for (let index = 0; index < this.meshes.length; index++) {
            const mesh = this.meshes[index];
            mesh.render(this, camaraMatrixFlat, this.lights);
        }
    }
}
