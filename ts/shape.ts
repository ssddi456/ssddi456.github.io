
import { Light } from "./light";
import { World } from "./world";
import { Shader } from "./shaders/base_shader";

export abstract class Shape {
    shader: Shader;
    trs: Matrix;
    inited: boolean = false;
    abstract async init(gl: WebGLRenderingContext);
    abstract clone();
    render(world: World, camaraMatrixFlat: number[], lights: Light[]) {
        world.useShader(this.shader);
        this.shader.render(world, this, camaraMatrixFlat, lights);
    }
}
