define('js/shaders/cube_with_texture', ['require', 'exports', 'module', "./base_shader", "js/shaders/cube_with_texture-vs.glsl.js", "js/shaders/cube_with_texture-fs.glsl.js"], function(require, exports, module) {

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
  var CubeWithTextureShader = /** @class */ (function (_super) {
      __extends(CubeWithTextureShader, _super);
      function CubeWithTextureShader() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.vertexShaderFactory = require("js/shaders/cube_with_texture-vs.glsl.js");
          _this.fragementShaderFactory = require("js/shaders/cube_with_texture-fs.glsl.js");
          return _this;
      }
      CubeWithTextureShader.prototype.mount = function (gl) {
          var shaderProgram = this.shaderProgram;
          this.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
          gl.enableVertexAttribArray(this.aVertexPosition);
          this.aTextureCoord = gl.getAttribLocation(shaderProgram, "aTextureCoord");
          gl.enableVertexAttribArray(this.aTextureCoord);
          this.uSampler = gl.getUniformLocation(this.shaderProgram, "uSampler");
          this.uMVMatrix = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
          this.uPMatrix = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
          this.bindBuffer = function (k, value) {
              switch (k) {
                  case "aVertexPosition":
                      gl.bindBuffer(gl.ARRAY_BUFFER, value);
                      gl.vertexAttribPointer(this.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
                      break;
                  case "aTextureCoord":
                      gl.bindBuffer(gl.ARRAY_BUFFER, value);
                      gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
                      break;
                  case "uSampler":
                      gl.uniform1i(this.uSampler, value);
                      break;
                  case "uMVMatrix":
                      gl.uniformMatrix4fv(this.uMVMatrix, value);
                      break;
                  case "uPMatrix":
                      gl.uniformMatrix4fv(this.uPMatrix, value);
                      break;
              }
          };
      };
      CubeWithTextureShader.prototype.render = function (world, mesh, camaraMatrixFlat, lights) {
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
      return CubeWithTextureShader;
  }(base_shader_1.Shader));
  exports.CubeWithTextureShader = CubeWithTextureShader;
  

});