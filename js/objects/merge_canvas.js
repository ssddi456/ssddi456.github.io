define('js/objects/merge_canvas', ['require', 'exports', 'module', "../libs/plane", "../mesh", "../shaders/fog_with_merge"], function(require, exports, module) {

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
  var plane_1 = require("../libs/plane");
  var mesh_1 = require("../mesh");
  var fog_with_merge_1 = require("../shaders/fog_with_merge");
  function createMergeCanvas(size) {
      var mergeCanvas = new (/** @class */ (function (_super) {
          __extends(class_1, _super);
          function class_1() {
              var _this = _super !== null && _super.apply(this, arguments) || this;
              _this.resolution = new Float32Array([size.width, size.height]);
              _this.center = new Float32Array([size.width / 2, size.height / 2]);
              _this.sight = 30 * 30;
              return _this;
          }
          class_1.prototype.bindBufferAndDraw = function (shader, gl) {
              shader.bindBuffer('uSamplerGray', 0);
              shader.bindBuffer('uSamplerColor', 1);
              shader.bindBuffer('uCenter', this.center);
              shader.bindBuffer('uResolution', this.resolution);
              shader.bindBuffer('uSightRange', this.sight);
              gl.activeTexture(gl.TEXTURE0);
              gl.bindTexture(gl.TEXTURE_2D, this.textureGray);
              shader.bindBuffer('uSamplerGray', 0);
              gl.activeTexture(gl.TEXTURE1);
              gl.bindTexture(gl.TEXTURE_2D, this.textureColor);
              shader.bindBuffer('uSamplerColor', 1);
              _super.prototype.bindBufferAndDraw.call(this, shader, gl);
          };
          return class_1;
      }(mesh_1.Mesh)))();
      mergeCanvas.updateMeshInfo(plane_1.ClipSpacePlane.getMesh());
      mergeCanvas.shader = new fog_with_merge_1.FogWithMergeShader();
      mergeCanvas.shader.render = function (renderWorld, mesh) {
          mesh.bindBufferAndDraw(this, renderWorld.gl);
      };
      return mergeCanvas;
  }
  exports.createMergeCanvas = createMergeCanvas;
  

});