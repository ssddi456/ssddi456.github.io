define('js/world', ['require', 'exports', 'module'], function(require, exports, module) {

  "use strict";
  var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator = (this && this.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
      return { next: verb(0), "throw": verb(1), "return": verb(2) };
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [0, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  var Camara = (function () {
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
  var World = (function () {
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
          this.camara = new Camara();
          this.camara.height = size.height;
          this.camara.width = size.width;
      }
      World.prototype.attachLight = function (light) {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          this.lights.push(light);
                          return [4 /*yield*/, light.init(this.gl, this)];
                      case 1:
                          _a.sent();
                          return [2 /*return*/];
                  }
              });
          });
      };
      World.prototype.attachObject = function (mesh) {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          this.meshes.push(mesh);
                          return [4 /*yield*/, mesh.init(this.gl, this)];
                      case 1:
                          _a.sent();
                          return [2 /*return*/];
                  }
              });
          });
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