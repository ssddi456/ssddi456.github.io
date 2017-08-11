define('js/mesh', ['require', 'exports', 'module', "./shape"], function(require, exports, module) {

  "use strict";
  var __extends = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
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
  var shape_1 = require("./shape");
  var Mesh = (function (_super) {
      __extends(Mesh, _super);
      function Mesh() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Mesh.prototype.loadTexture = function (gl) {
          return __awaiter(this, void 0, void 0, function () {
              var texture, image, loadFinsh;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          texture = this.texture = gl.createTexture();
                          image = new Image();
                          loadFinsh = new Promise(function (resolve, reject) {
                              image.onload = function () {
                                  resolve();
                              };
                              image.onerror = function (e) {
                                  reject(e);
                              };
                          });
                          image.src = this.textureSrc;
                          return [4 /*yield*/, loadFinsh];
                      case 1:
                          _a.sent();
                          gl.bindTexture(gl.TEXTURE_2D, texture);
                          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                          gl.generateMipmap(gl.TEXTURE_2D);
                          gl.bindTexture(gl.TEXTURE_2D, null);
                          return [2 /*return*/];
                  }
              });
          });
      };
      Mesh.prototype.clone = function () {
          var newInstance = new Mesh();
          newInstance.vertices = this.vertices.slice(0);
          newInstance.faces = this.faces.slice(0);
          if (this.verticesColor) {
              newInstance.verticesColor = this.verticesColor.slice(0);
          }
          if (this.textureCoordinates) {
              newInstance.textureCoordinates = this.textureCoordinates.slice(0);
          }
          if (this.textureSrc) {
              newInstance.textureSrc = this.textureSrc;
          }
          if (this.texture) {
              newInstance.texture = this.texture;
          }
          if (this.vertexNormal) {
              newInstance.vertexNormal = this.vertexNormal;
          }
          newInstance.shader = this.shader;
          newInstance.trs = this.trs.clone();
          return newInstance;
      };
      Mesh.prototype.init = function (gl) {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          this.vertexBuffer = gl.createBuffer();
                          gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
                          this.facesBuffer = gl.createBuffer();
                          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
                          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);
                          if (this.verticesColor) {
                              this.vertexColorBuffer = gl.createBuffer();
                              gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
                              gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesColor), gl.STATIC_DRAW);
                          }
                          if (this.textureCoordinates) {
                              this.textureCoordinatesBuffer = gl.createBuffer();
                              gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinatesBuffer);
                              gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), gl.STATIC_DRAW);
                          }
                          if (this.vertexNormal) {
                              this.vertexNormalBuffer = gl.createBuffer();
                              gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
                              gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormal), gl.STATIC_DRAW);
                          }
                          if (!this.textureSrc) return [3 /*break*/, 2];
                          return [4 /*yield*/, this.loadTexture(gl)];
                      case 1:
                          _a.sent();
                          _a.label = 2;
                      case 2:
                          this.shader.init(gl);
                          this.inited = true;
                          return [2 /*return*/];
                  }
              });
          });
      };
      return Mesh;
  }(shape_1.Shape));
  exports.Mesh = Mesh;
  

});