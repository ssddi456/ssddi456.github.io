define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Shape = /** @class */ (function () {
        function Shape() {
            this.visible = true;
            this.debug = false;
            this.disposed = false;
            this._trs = Matrix.I(4);
            this.inited = false;
        }
        Object.defineProperty(Shape.prototype, "trs", {
            get: function () {
                if (this.parentShap) {
                    return this.parentShap.trs.x(this._trs);
                }
                return this._trs;
            },
            set: function (value) {
                this._trs = value;
            },
            enumerable: true,
            configurable: true
        });
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
});
