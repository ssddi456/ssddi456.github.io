define('js/shaders/vertex_color_shader', ['require', 'exports', 'module', "./base_shader", "js/shaders/cube_with_face_color-vs.glsl.js", "js/shaders/cube_with_face_color-fs.glsl.js"], function(require, exports, module) {

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
  var VertexColorShader = /** @class */ (function (_super) {
      __extends(VertexColorShader, _super);
      function VertexColorShader() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.vertexShaderFactory = require("js/shaders/cube_with_face_color-vs.glsl.js");
          _this.fragementShaderFactory = require("js/shaders/cube_with_face_color-fs.glsl.js");
          return _this;
      }
      VertexColorShader.prototype.mount = function (gl) {
          var shaderProgram = this.shaderProgram;
          this.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
          gl.enableVertexAttribArray(this.aVertexPosition);
          this.aVertexColor = gl.getAttribLocation(shaderProgram, "aVertexColor");
          gl.enableVertexAttribArray(this.aVertexColor);
          this.uPMatrix = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
          this.uMVMatrix = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
      };
      VertexColorShader.prototype.render = function (world, mesh, camaraMatrixFlat) {
          var gl = world.gl;
          gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
          gl.vertexAttribPointer(this.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexColorBuffer);
          gl.vertexAttribPointer(this.aVertexColor, 4, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.facesBuffer);
          gl.uniformMatrix4fv(this.uPMatrix, false, camaraMatrixFlat);
          gl.uniformMatrix4fv(this.uMVMatrix, false, new Float32Array(mesh.trs.flatten()));
          gl.drawElements(gl.TRIANGLES, mesh.faces.length, gl.UNSIGNED_SHORT, 0);
      };
      return VertexColorShader;
  }(base_shader_1.Shader));
  exports.VertexColorShader = VertexColorShader;
  

});