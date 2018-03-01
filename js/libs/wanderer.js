define('js/libs/wanderer', ['require', 'exports', 'module', "./player_control", "./utils", "./3dRoad", "../mesh", "./cube", "../shaders/vertex_color_shader"], function(require, exports, module) {

  "use strict";
  var __extends = (this && this.__extends) || (function () {
      var extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  exports.__esModule = true;
  var player_control_1 = require("./player_control");
  var utils_1 = require("./utils");
  var _3dRoad_1 = require("./3dRoad");
  var mesh_1 = require("../mesh");
  var cube_1 = require("./cube");
  var vertex_color_shader_1 = require("../shaders/vertex_color_shader");
  exports.directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
  ];
  var Wanderer = /** @class */ (function (_super) {
      __extends(Wanderer, _super);
      function Wanderer() {
          var _this = _super.call(this) || this;
          _this.acceleration = 0.05;
          _this.moveSize = [_3dRoad_1.gridSize, _3dRoad_1.gridSize];
          _this.randomDirection();
          _this.mesh = new mesh_1.Mesh();
          _this.mesh.shader = new vertex_color_shader_1.VertexColorShader();
          var cubeTransFormer = new cube_1.Cube();
          _this.mesh.updateMeshInfo(cubeTransFormer.getMesh());
          return _this;
      }
      Wanderer.prototype.move = function (roadMap) {
          var _this = this;
          var safeZone = roadMap.getSafeZoneSize();
          var premovePos = this.currentPos.map(function (x, i) { return x + _this.speed[i]; });
          var premoveBBox = utils_1.getBBox(premovePos, this.moveSize);
          var hitSafeZone = utils_1.boxCollision(premoveBBox, safeZone);
          var delta = _super.prototype.move.call(this, roadMap);
          if (hitSafeZone) {
              this.speed.forEach(function (x) { return -1 * x; });
          }
          else {
              if (delta[0] / this.speed[0] < 1 ||
                  delta[1] / this.speed[1] < 1) {
                  this.randomDirection();
              }
          }
          return delta;
      };
      Wanderer.prototype.moveTo = function (pos, world) {
          var delta = [pos[0] - this.currentPos[0], pos[1] - this.currentPos[1]];
          this.currentPos[0] = pos[0];
          this.currentPos[1] = pos[1];
          this.mesh.x(Matrix.Translation($V([
              delta[0],
              0,
              delta[1],
          ])));
      };
      Wanderer.prototype.randomDirection = function () {
          var _this = this;
          this.speed = utils_1.randomItem(exports.directions).map(function (x) { return x * _this.acceleration; });
      };
      return Wanderer;
  }(player_control_1.Player));
  exports.Wanderer = Wanderer;
  

});