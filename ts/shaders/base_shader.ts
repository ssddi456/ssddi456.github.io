import { World } from '../world';
import { Light } from "../light";
import { Shape } from "../shape";

export abstract class Shader {
    inited: boolean = false;
    mounted: boolean = false;
    shaderProgram: WebGLProgram;

    abstract vertexShaderFactory: ShaderFactory;
    abstract fragementShaderFactory: ShaderFactory;
    clone() {
        const newInstance = new (this.constructor as ShaderSubclass)();
        newInstance.vertexShaderFactory = this.vertexShaderFactory;
        newInstance.fragementShaderFactory = this.fragementShaderFactory;
        return newInstance;
    }
    init(gl: WebGLRenderingContext) {
        if (this.inited) {
            return false;
        }
        this.inited = true;
        const shaderProgram = this.shaderProgram = gl.createProgram();
        const vertexShader = this.vertexShaderFactory(gl);
        const fragementShader = this.fragementShaderFactory(gl);

        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragementShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
        }
    }
    abstract mount(gl: WebGLRenderingContext);
    abstract render(world: World, mesh: Shape, camaraMatrixFlat: Float32Array, lights: Light[]);
}

type ShaderSubclass = new (...args: any[]) => Shader;

export type ShaderFactory = (gl: WebGLRenderingContext) => WebGLShader;
