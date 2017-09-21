define('js/shaders/cube_with_fog', ['require', 'exports', 'module', "./base_shader", "js/shaders/cube_with_fog-vs.glsl.js", "js/shaders/cube_with_fog-fs.glsl.js"], function(require, exports, module) {

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
  var CubeWithFogShader = /** @class */ (function (_super) {
      __extends(CubeWithFogShader, _super);
      function CubeWithFogShader() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.vertexShaderFactory = require("js/shaders/cube_with_fog-vs.glsl.js");
          _this.fragementShaderFactory = require("js/shaders/cube_with_fog-fs.glsl.js");
          _this.mytempattrs = {
              aVertexColor: 0,
              aVertexPosition: 0,
              aVertexNormal: 0,
              aTextureCoord: 0,
              aFog: 0,
              uSampler: 0,
              uNormalMatrix: 0,
              uDirectionalLightColor: 0,
              uDirectionalVector: 0,
              uMVMatrix: 0,
              uPMatrix: 0,
              useFog: 0,
              uUseFog: 0
          };
          return _this;
      }
      CubeWithFogShader.prototype.mount = function (gl) {
          for (var k in this.mytempattrs) {
              this.mytempattrs[k] = 0;
          }
          var shaderProgram = this.shaderProgram;
          this.aVertexColor = gl.getAttribLocation(shaderProgram, "aVertexColor");
          gl.enableVertexAttribArray(this.aVertexColor);
          this.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
          gl.enableVertexAttribArray(this.aVertexPosition);
          this.aVertexNormal = gl.getAttribLocation(shaderProgram, "aVertexNormal");
          gl.enableVertexAttribArray(this.aVertexNormal);
          this.aTextureCoord = gl.getAttribLocation(shaderProgram, "aTextureCoord");
          gl.enableVertexAttribArray(this.aTextureCoord);
          this.aFog = gl.getAttribLocation(shaderProgram, "aFog");
          gl.enableVertexAttribArray(this.aFog);
          this.uSampler = gl.getUniformLocation(this.shaderProgram, "uSampler");
          this.uNormalMatrix = gl.getUniformLocation(this.shaderProgram, "uNormalMatrix");
          this.uDirectionalLightColor = gl.getUniformLocation(this.shaderProgram, "uDirectionalLightColor");
          this.uDirectionalVector = gl.getUniformLocation(this.shaderProgram, "uDirectionalVector");
          this.uMVMatrix = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
          this.uPMatrix = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
          this.useFog = gl.getUniformLocation(this.shaderProgram, "useFog");
          this.uUseFog = gl.getUniformLocation(this.shaderProgram, "uUseFog");
          this.bindBuffer = function (k, value) {
              this.mytempattrs[k] = 1;
              switch (k) {
                  case "aVertexColor":
                      gl.bindBuffer(gl.ARRAY_BUFFER, value);
                      gl.vertexAttribPointer(this.aVertexColor, 4, gl.FLOAT, false, 0, 0);
                      break;
                  case "aVertexPosition":
                      gl.bindBuffer(gl.ARRAY_BUFFER, value);
                      gl.vertexAttribPointer(this.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
                      break;
                  case "aVertexNormal":
                      gl.bindBuffer(gl.ARRAY_BUFFER, value);
                      gl.vertexAttribPointer(this.aVertexNormal, 3, gl.FLOAT, false, 0, 0);
                      break;
                  case "aTextureCoord":
                      gl.bindBuffer(gl.ARRAY_BUFFER, value);
                      gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
                      break;
                  case "aFog":
                      gl.bindBuffer(gl.ARRAY_BUFFER, value);
                      gl.vertexAttribPointer(this.aFog, 2, gl.FLOAT, false, 0, 0);
                      break;
                  case "uSampler":
                      gl.uniform1i(this.uSampler, value);
                      break;
                  case "uNormalMatrix":
                      gl.uniformMatrix4fv(this.uNormalMatrix, value);
                      break;
                  case "uDirectionalLightColor":
                      gl.uniform3fv(this.uDirectionalLightColor, value);
                      break;
                  case "uDirectionalVector":
                      gl.uniform3fv(this.uDirectionalVector, value);
                      break;
                  case "uMVMatrix":
                      gl.uniformMatrix4fv(this.uMVMatrix, value);
                      break;
                  case "uPMatrix":
                      gl.uniformMatrix4fv(this.uPMatrix, value);
                      break;
                  case "useFog":
                      gl.uniform1f(this.useFog, value);
                      break;
                  case "uUseFog":
                      gl.uniform1f(this.uUseFog, value);
                      break;
              }
          };
      };
      CubeWithFogShader.prototype.render = function (world, mesh, camaraMatrixFlat, lights) {
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
      return CubeWithFogShader;
  }(base_shader_1.Shader));
  exports.CubeWithFogShader = CubeWithFogShader;
  

});