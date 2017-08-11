define('js/shape', ['require', 'exports', 'module'], function(require, exports, module) {

  "use strict";
  var Shape = (function () {
      function Shape() {
          this.inited = false;
      }
      Shape.prototype.render = function (world, camaraMatrixFlat, lights) {
          world.useShader(this.shader);
          this.shader.render(world, this, camaraMatrixFlat, lights);
      };
      return Shape;
  }());
  exports.Shape = Shape;
  

});