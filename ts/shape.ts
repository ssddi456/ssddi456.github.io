
import { Light } from "./light";
import { World } from "./world";
import { Shader } from "./shaders/base_shader";

export abstract class Shape {
    visible: boolean = true;
    debug: boolean = false;
    disposed: boolean = false;

    shader: Shader;
    _trs: Matrix = Matrix.I(4);
    get trs(): Matrix {
        if (this.parentShap) {
            return this.parentShap.trs.x(this._trs);
        }
        return this._trs;
    }
    set trs(value: Matrix) {
        this._trs = value;
    }
    parentShap: Shape;

    x(matrix: Matrix) {
        this.trs = this.trs.x(matrix);
        return this;
    }

    inited: boolean = false;
    abstract init(gl: WebGLRenderingContext, world: World);
    abstract clone();
    abstract dispose(world: World);
    abstract bindBufferAndDraw(shader: Shader, gl: WebGLRenderingContext);

    updateDebug?(world: World, lights: Light[]);

    render(world: World, camaraMatrixFlat: Float32Array, lights: Light[]) {
        if (this.debug && this.updateDebug) {
            this.updateDebug(world, lights);
        }
        if (this.visible) {
            world.useShader(this.shader);
            this.shader.render(world, this, camaraMatrixFlat, lights);
        }
    }
}
