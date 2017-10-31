define(["require", "exports", "./2dRoad", "./3dRoad"], function (require, exports, _2dRoad_1, _3dRoad_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Plane = /** @class */ (function () {
        function Plane() {
            this.width = 1;
            this.height = 1;
        }
        Plane.prototype.getMesh = function () {
            var plane = [
                _3dRoad_1.createTopSquare(0, 0, (this.width) * _3dRoad_1.gridSize, (this.height) * _3dRoad_1.gridSize, -0.1, _3dRoad_1.groundColor),
            ];
            return _2dRoad_1.facesToMesh(plane);
        };
        return Plane;
    }());
    exports.Plane = Plane;
    var pos = [
        [-1, 1, 0],
        [-1, -1, 0],
        [1, -1, 0],
        [1, 1, 0],
    ];
    var textcoords = [
        [0, 1],
        [0, 0],
        [1, 0],
        [1, 1],
    ];
    var ClipSpacePlane = /** @class */ (function () {
        function ClipSpacePlane() {
        }
        ClipSpacePlane.getMesh = function () {
            var face = _3dRoad_1.createTopSquare(0, 0, -1, -1, 0, _3dRoad_1.groundColor);
            face.vertexes.forEach(function (vertex, i) {
                vertex.pos = pos[i];
                vertex.textureCoordinate = textcoords[i];
            });
            return _2dRoad_1.facesToMesh([face]);
        };
        return ClipSpacePlane;
    }());
    exports.ClipSpacePlane = ClipSpacePlane;
});
