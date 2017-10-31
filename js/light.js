define(["require", "exports", "./shaders/vertex_color_shader", "./mesh"], function (require, exports, vertex_color_shader_1, mesh_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var debugMesh = new mesh_1.Mesh();
    debugMesh.shader = new vertex_color_shader_1.VertexColorShader();
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
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23 // left
    ];
    debugMesh.trs = Matrix.Translation($V([0, 0, 0]));
    var Light = /** @class */ (function () {
        function Light() {
            this.direction = [1, 1, 1];
            this.debug = false;
        }
        Light.prototype.init = function (gl, world) {
            this.direction = $V(this.direction).toUnitVector().elements;
            if (this.debug) {
                if (!this.debugMesh) {
                    this.debugMesh = debugMesh.clone();
                    this.debugMesh.trs = this.debugMesh.trs.x(Matrix.Translation($V(this.direction)));
                    this.debugMesh.vertexColors = [];
                    for (var j = 0; j < 6; j++) {
                        for (var k = 0; k < 4; k++) {
                            for (var index = 0; index < 3; index++) {
                                this.debugMesh.vertexColors.push(this.color[0]);
                            }
                            this.debugMesh.vertexColors.push(1);
                        }
                    }
                    world.attachObject(this.debugMesh);
                }
            }
        };
        return Light;
    }());
    exports.Light = Light;
});
