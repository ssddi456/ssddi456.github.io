import { World, Mesh } from '../world';

export abstract class Shader {
    inited: false;
    abstract init(gl: WebGLRenderingContext);
    abstract mount(gl: WebGLRenderingContext);
    abstract render(world: World, mesh: Mesh, camaraMatrixFlat: number[]);
}

export type ShaderFactory = (gl: WebGLRenderingContext) =>  WebGLShader;