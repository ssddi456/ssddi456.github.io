"use strict";
exports.__esModule = true;
var Shape = /** @class */ (function () {
    function Shape() {
        this.visible = true;
        this.debug = false;
        this.trs = Matrix.I(4);
        this.inited = false;
    }
    Shape.prototype.x = function (matrix) {
        this.trs = this.trs.x(matrix);
        return this;
    };
    Shape.prototype.render = function (world, camaraMatrixFlat, lights) {
        if (this.debug && this.updateDebug) {
            this.updateDebug(world, lights);
        }
        if (this.visible) {
            world.useShader(this.shader);
            this.shader.render(world, this, camaraMatrixFlat, lights);
        }
    };
    return Shape;
}());
exports.Shape = Shape;
