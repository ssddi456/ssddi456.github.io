define('js/world', ['require', 'exports', 'module'], function(require, exports, module) {

  "use strict";
  var __extends = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Camara = (function () {
      function Camara() {
          this.fv = 45;
          this.width = 640;
          this.height = 480;
          this.nearClip = 0.1;
          this.farClip = 100;
      }
      Object.defineProperty(Camara.prototype, "radio", {
          get: function () {
              return this.width / this.height;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Camara.prototype, "matrix", {
          get: function () {
              return makePerspective(this.fv, this.radio, this.nearClip, this.farClip);
          },
          enumerable: true,
          configurable: true
      });
      return Camara;
  }());
  exports.Camara = Camara;
  var Shader = (function () {
      function Shader() {
      }
      return Shader;
  }());
  exports.Shader = Shader;
  var VertexColorShader = (function (_super) {
      __extends(VertexColorShader, _super);
      function VertexColorShader() {
          return _super !== null && _super.apply(this, arguments) || this;
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
  }(Shader));
  exports.VertexColorShader = VertexColorShader;
  var Mesh = (function () {
      function Mesh() {
          this.inited = false;
      }
      Mesh.prototype.clone = function () {
          var newInstance = new Mesh();
          newInstance.vertices = this.vertices.slice(0);
          newInstance.faces = this.faces.slice(0);
          newInstance.verticesColor = this.verticesColor.slice(0);
          newInstance.shader = this.shader;
          newInstance.trs = this.trs.clone();
          return newInstance;
      };
      Mesh.prototype.init = function (gl) {
          this.vertexBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
          this.vertexColorBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesColor), gl.STATIC_DRAW);
          this.facesBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);
          this.shader.init(gl);
          this.inited = true;
      };
      Mesh.prototype.render = function (world, camaraMatrixFlat) {
          this.shader.render(world, this, camaraMatrixFlat);
      };
      return Mesh;
  }());
  exports.Mesh = Mesh;
  var World = (function () {
      function World(gl, size) {
          this.meshes = [];
          this.gl = gl;
          // Set clear color to black, fully opaque
          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          // Enable depth testing
          gl.enable(gl.DEPTH_TEST);
          // Near things obscure far things
          gl.depthFunc(gl.LEQUAL);
          // Clear the color as well as the depth buffer.
          // tslint:disable-next-line:no-bitwise
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          gl.viewport(0, 0, size.width, size.height);
          this.camara = new Camara();
          this.camara.height = size.height;
          this.camara.width = size.width;
      }
      World.prototype.attachObject = function (mesh) {
          this.meshes.push(mesh);
          mesh.init(this.gl);
      };
      World.prototype.render = function () {
          var gl = this.gl;
          // tslint:disable-next-line:no-bitwise
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          var camaraMatrixFlat = this.camara.matrix.flatten();
          for (var index = 0; index < this.meshes.length; index++) {
              var mesh = this.meshes[index];
              mesh.render(this, camaraMatrixFlat);
          }
      };
      return World;
  }());
  exports.World = World;
  

});