interface Matrix {
    flatten(): number[];
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

export abstract class Shader {
    abstract init(gl: WebGLRenderingContext);
    abstract render(world: World, mesh: Mesh, camaraMatrixFlat: number[]);
}

export class VertexColorShader extends Shader {
    vertexShaderFactory: (gl: WebGLRenderingContext) => WebGLShader;
    fragementShaderFactory: (gl: WebGLRenderingContext) => WebGLShader;

    aVertexPosition: number;
    aVertexColor: number;
    shaderProgram: WebGLProgram;

    init(gl: WebGLRenderingContext) {
        const shaderProgram = this.shaderProgram = gl.createProgram();
        const vertexShader = this.vertexShaderFactory(gl);
        const fragementShader = this.fragementShaderFactory(gl);

        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragementShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
        }

        gl.useProgram(shaderProgram);

        this.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(this.aVertexPosition);

        this.aVertexColor = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(this.aVertexColor);
    }

    render(world: World, mesh: Mesh, camaraMatrixFlat: number[]) {
        const gl = world.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
        gl.vertexAttribPointer(this.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexColorBuffer);
        gl.vertexAttribPointer(this.aVertexColor, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.facesBuffer);

        const pUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        gl.uniformMatrix4fv(pUniform, false, new Float32Array(camaraMatrixFlat));

        const mvUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
        gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mesh.trs.flatten()));

        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
}

export class Mesh {
    vertices: number[];
    faces: number[];
    verticesColor: number[];
    shader: Shader;
    trs: Matrix;

    vertexBuffer: WebGLBuffer;
    vertexColorBuffer: WebGLBuffer;
    facesBuffer: WebGLBuffer;

    init(gl: WebGLRenderingContext) {
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.vertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesColor), gl.STATIC_DRAW);

        this.facesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);

        this.shader.init(gl);
    }

    render(world: World, camaraMatrixFlat: number[]) {
        this.shader.render(world, this, camaraMatrixFlat);
    }
}

export class World {
    camara: Camara;
    meshes: Mesh[] = [];
    gl: WebGLRenderingContext;

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
    attachObject(mesh: Mesh) {
        this.meshes.push(mesh);

        mesh.init(this.gl);
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
