define('js/libs/plane', ['require', 'exports', 'module', "./2dRoad", "./3dRoad"], function(require, exports, module) {

  "use strict";
  exports.__esModule = true;
  var _2dRoad_1 = require("./2dRoad");
  var _3dRoad_1 = require("./3dRoad");
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
  

});