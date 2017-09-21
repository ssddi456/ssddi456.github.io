define('js/shaders/fog_with_merge', ['require', 'exports', 'module', "./base_shader", "js/shaders/fog_with_merge-vs.glsl.js", "js/shaders/fog_with_merge-fs.glsl.js"], function(require, exports, module) {

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
  var base_shader_1 = require("./base_shader");
  var FogWithMergeShader = /** @class */ (function (_super) {
      __extends(FogWithMergeShader, _super);
      function FogWithMergeShader() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.vertexShaderFactory = require("js/shaders/fog_with_merge-vs.glsl.js");
          _this.fragementShaderFactory = require("js/shaders/fog_with_merge-fs.glsl.js");
          _this.mytempattrs = {
              aVertexPosition: 0,
              aTextureCoord: 0,
              uSamplerGray: 0,
              uSamplerColor: 0,
              uCenter: 0,
              uResolution: 0,
              uSightRange: 0
          };
          return _this;
      }
      FogWithMergeShader.prototype.mount = function (gl) {
          for (var k in this.mytempattrs) {
              this.mytempattrs[k] = 0;
          }
          var shaderProgram = this.shaderProgram;
          this.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
          gl.enableVertexAttribArray(this.aVertexPosition);
          this.aTextureCoord = gl.getAttribLocation(shaderProgram, "aTextureCoord");
          gl.enableVertexAttribArray(this.aTextureCoord);
          this.uSamplerGray = gl.getUniformLocation(this.shaderProgram, "uSamplerGray");
          this.uSamplerColor = gl.getUniformLocation(this.shaderProgram, "uSamplerColor");
          this.uCenter = gl.getUniformLocation(this.shaderProgram, "uCenter");
          this.uResolution = gl.getUniformLocation(this.shaderProgram, "uResolution");
          this.uSightRange = gl.getUniformLocation(this.shaderProgram, "uSightRange");
          this.bindBuffer = function (k, value) {
              this.mytempattrs[k] = 1;
              switch (k) {
                  case "aVertexPosition":
                      gl.bindBuffer(gl.ARRAY_BUFFER, value);
                      gl.vertexAttribPointer(this.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
                      break;
                  case "aTextureCoord":
                      gl.bindBuffer(gl.ARRAY_BUFFER, value);
                      gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
                      break;
                  case "uSamplerGray":
                      gl.uniform1i(this.uSamplerGray, value);
                      break;
                  case "uSamplerColor":
                      gl.uniform1i(this.uSamplerColor, value);
                      break;
                  case "uCenter":
                      gl.uniform2fv(this.uCenter, value);
                      break;
                  case "uResolution":
                      gl.uniform2fv(this.uResolution, value);
                      break;
                  case "uSightRange":
                      gl.uniform1f(this.uSightRange, value);
                      break;
              }
          };
      };
      FogWithMergeShader.prototype.render = function (world, mesh, camaraMatrixFlat, lights) {
          var gl = world.gl;
          if (lights && lights.length) {
              if (this.uDirectionalLightColor && this.uDirectionalVector) {
                  gl.uniform3fv(this.uDirectionalLightColor, lights[0].color);
                  gl.uniform3fv(this.uDirectionalVector, lights[0].direction);
              }
              if (this.uNormalMatrix) {
                  var normalMatrix = mesh.trs.inverse().transpose();
                  gl.uniformMatrix4fv(this.uNormalMatrix, false, new Float32Array(normalMatrix.flatten()));
              }
          }
          gl.uniformMatrix4fv(this.uPMatrix, false, camaraMatrixFlat);
          gl.uniformMatrix4fv(this.uMVMatrix, false, new Float32Array(mesh.trs.flatten()));
          mesh.bindBufferAndDraw(this, gl);
      };
      return FogWithMergeShader;
  }(base_shader_1.Shader));
  exports.FogWithMergeShader = FogWithMergeShader;
  

});