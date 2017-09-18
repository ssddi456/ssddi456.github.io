define('js/world', ['require', 'exports', 'module'], function(require, exports, module) {

  "use strict";
  exports.__esModule = true;
  var Camara = /** @class */ (function () {
      function Camara() {
          this.fv = 45;
          this.width = 640;
          this.height = 480;
          this.nearClip = 0.1;
          this.farClip = 100;
          this.eye = [0, 5, 20];
          this.center = [0, 0, -25];
          this.up = [0, 1, 0];
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
              return makePerspective(this.fv, this.radio, this.nearClip, this.farClip)
                  .x(makeLookAt.apply(null, [].concat(this.eye, this.center, this.up)));
          },
          enumerable: true,
          configurable: true
      });
      return Camara;
  }());
  exports.Camara = Camara;
  var World = /** @class */ (function () {
      function World(gl, size) {
          this.meshes = [];
          this.lights = [];
          this.gl = gl;
          // Set clear color to black, fully opaque
          gl.clearColor(0, 0, 0, 1.0);
          // Enable depth testing
          gl.enable(gl.DEPTH_TEST);
          // Near things obscure far things
          gl.depthFunc(gl.LEQUAL);
          // Clear the color as well as the depth buffer.
          // tslint:disable-next-line:no-bitwise
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          gl.viewport(0, 0, size.width, size.height);
      }
      World.prototype.attachLight = function (light) {
          this.lights.push(light);
          light.init(this.gl, this);
      };
      World.prototype.attachObject = function (mesh) {
          this.meshes.push(mesh);
          mesh.init(this.gl, this);
      };
      World.prototype.useShader = function (shader) {
          if (shader === this.lastUsedShader) {
              return;
          }
          if (this.lastUsedShader) {
              this.lastUsedShader.mounted = false;
          }
          this.gl.useProgram(shader.shaderProgram);
          shader.mount(this.gl);
          shader.mounted = true;
          this.lastUsedShader = shader;
      };
      World.prototype.render = function () {
          var gl = this.gl;
          // tslint:disable-next-line:no-bitwise
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          var camaraMatrixFlat = new Float32Array(this.camara.matrix.flatten());
          for (var index = 0; index < this.meshes.length; index++) {
              var mesh = this.meshes[index];
              mesh.render(this, camaraMatrixFlat, this.lights);
          }
      };
      return World;
  }());
  exports.World = World;
  

});