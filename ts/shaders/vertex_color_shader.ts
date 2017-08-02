
import { Shader, ShaderFactory } from "./base_shader";
import { World, Mesh } from "../world";

export class VertexColorShader extends Shader {
    vertexShaderFactory: ShaderFactory = require("../shaders/cube_with_face_color-vs.glsl");
    fragementShaderFactory: ShaderFactory = require("../shaders/cube_with_face_color-fs.glsl");

    aVertexPosition: number;
    aVertexColor: number;
    uPMatrix: WebGLUniformLocation;
    uMVMatrix: WebGLUniformLocation;

    shaderProgram: WebGLProgram;

    clone() {
        const newInstance = new VertexColorShader();
        newInstance.vertexShaderFactory = this.vertexShaderFactory;
        newInstance.fragementShaderFactory = this.fragementShaderFactory;
        return newInstance;
    }
    init(gl: WebGLRenderingContext) {
        if (this.inited) {
            return false;
        }
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
    mount(gl: WebGLRenderingContext) {

        const shaderProgram = this.shaderProgram;

        gl.useProgram(shaderProgram);

        this.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(this.aVertexPosition);

        this.aVertexColor = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(this.aVertexColor);

        this.uPMatrix = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        this.uMVMatrix = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");

    }

    render(world: World, mesh: Mesh, camaraMatrixFlat: number[]) {
        const gl = world.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
        gl.vertexAttribPointer(this.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexColorBuffer);
        gl.vertexAttribPointer(this.aVertexColor, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.facesBuffer);

        gl.uniformMatrix4fv(this.uPMatrix, false, new Float32Array(camaraMatrixFlat));
        gl.uniformMatrix4fv(this.uMVMatrix, false, new Float32Array(mesh.trs.flatten()));

        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
}
