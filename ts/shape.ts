
import { Light } from "./light";
import { World } from "./world";
import { Shader } from "./shaders/base_shader";

export abstract class Shape {
    visible: boolean = true;
    debug: boolean = false;
    shader: Shader;
    trs: Matrix =  Matrix.I(4);

    x(matrix: Matrix) {
        this.trs = this.trs.x(matrix);
        return this;
    }

    inited: boolean = false;
    abstract async init(gl: WebGLRenderingContext, world: World);
    abstract clone();

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
