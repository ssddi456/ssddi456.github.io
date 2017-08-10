import { World, Mesh } from '../world';
import { Light } from "../light";

export abstract class Shader {
    inited: false;
    shaderProgram: WebGLProgram;
    abstract init(gl: WebGLRenderingContext);
    abstract mount(gl: WebGLRenderingContext);
    abstract render(world: World, mesh: Mesh, camaraMatrixFlat: number[], lights: Light[]);
}

export type ShaderFactory = (gl: WebGLRenderingContext) =>  WebGLShader;
