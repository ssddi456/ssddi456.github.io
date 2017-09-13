
import { World } from "./world";
import { VertexColorShader } from "./shaders/vertex_color_shader";
import { Mesh } from "./mesh";

const debugMesh = new Mesh();
debugMesh.shader = new VertexColorShader();
debugMesh.vertices = [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
].map(function (x) {
    return x * 0.5;
});

debugMesh.faces = [
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // back
    8, 9, 10, 8, 10, 11,   // top
    12, 13, 14, 12, 14, 15,   // bottom
    16, 17, 18, 16, 18, 19,   // right
    20, 21, 22, 20, 22, 23    // left
];

debugMesh.trs = Matrix.Translation($V([0, 0, 0]));

export class Light {
    direction: [number, number, number] = [1, 1, 1];
    color: [number, number, number];

    debug = false;
    debugMesh: Mesh;

    async init(gl: WebGLRenderingContext, world: World) {
        this.direction = $V(this.direction).toUnitVector().elements;

        if (this.debug) {
            if (!this.debugMesh) {
                this.debugMesh = debugMesh.clone();
                this.debugMesh.trs = this.debugMesh.trs.x(Matrix.Translation($V(this.direction)));

                this.debugMesh.vertexColors = [];

                for (let j = 0; j < 6; j++) {
                    for (let k = 0; k < 4; k++) {
                        for (let index = 0; index < 3; index++) {
                            this.debugMesh.vertexColors.push(this.color[0]);
                        }
                        this.debugMesh.vertexColors.push(1);
                    }
                }

                await world.attachObject(this.debugMesh);
            }
        }

    }
}
