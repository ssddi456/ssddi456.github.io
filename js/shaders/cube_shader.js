define('js/shaders/cube_shader', ['require', 'exports', 'module', "./base_shader", "js/shaders/cube_with_face_color-vs.glsl.js", "js/shaders/cube_with_face_color-fs.glsl.js"], function(require, exports, module) {

  "use strict";
  var __extends = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var base_shader_1 = require("./base_shader");
  var VertexColorShader = (function (_super) {
      __extends(VertexColorShader, _super);
      function VertexColorShader() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.vertexShaderFactory = require("js/shaders/cube_with_face_color-vs.glsl.js");
          _this.fragementShaderFactory = require("js/shaders/cube_with_face_color-fs.glsl.js");
          return _this;
      }
      VertexColorShader.prototype.clone = function () {
          var newInstance = new VertexColorShader();
          newInstance.vertexShaderFactory = this.vertexShaderFactory;
          newInstance.fragementShaderFactory = this.fragementShaderFactory;
          return newInstance;
      };
      VertexColorShader.prototype.init = function (gl) {
          if (this.inited) {
              return false;
          }
          var shaderProgram = this.shaderProgram = gl.createProgram();
          var vertexShader = this.vertexShaderFactory(gl);
          var fragementShader = this.fragementShaderFactory(gl);
          gl.attachShader(shaderProgram, vertexShader);
          gl.attachShader(shaderProgram, fragementShader);
          gl.linkProgram(shaderProgram);
          if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
              alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
          }
      };
      VertexColorShader.prototype.mount = function (gl) {
          var shaderProgram = this.shaderProgram;
          gl.useProgram(shaderProgram);
          this.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
          gl.enableVertexAttribArray(this.aVertexPosition);
          this.aVertexColor = gl.getAttribLocation(shaderProgram, "aVertexColor");
          gl.enableVertexAttribArray(this.aVertexColor);
      };
      VertexColorShader.prototype.render = function (world, mesh, camaraMatrixFlat) {
          var gl = world.gl;
          gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
          gl.vertexAttribPointer(this.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexColorBuffer);
          gl.vertexAttribPointer(this.aVertexColor, 4, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.facesBuffer);
          var pUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
          gl.uniformMatrix4fv(pUniform, false, new Float32Array(camaraMatrixFlat));
          var mvUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
          gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mesh.trs.flatten()));
          gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
      };
      return VertexColorShader;
  }(base_shader_1.Shader));
  exports.VertexColorShader = VertexColorShader;
  

});