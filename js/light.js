define('js/light', ['require', 'exports', 'module', "./shaders/vertex_color_shader", "./mesh"], function(require, exports, module) {

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
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
  exports.__esModule = true;
  var vertex_color_shader_1 = require("./shaders/vertex_color_shader");
  var mesh_1 = require("./mesh");
  var debugMesh = new mesh_1.Mesh();
  debugMesh.shader = new vertex_color_shader_1.VertexColorShader();
  debugMesh.vertices = [
      // Front face
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,
      // Back face
      -1.0, -1.0, -1.0,
      -1.0, 1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, -1.0, -1.0,
      // Top face
      -1.0, 1.0, -1.0,
      -1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, -1.0,
      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0, 1.0,
      -1.0, -1.0, 1.0,
      // Right face
      1.0, -1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, 1.0, 1.0,
      1.0, -1.0, 1.0,
      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0, 1.0, -1.0,
  ].map(function (x) {
      return x * 0.5;
  });
  debugMesh.faces = [
      0, 1, 2, 0, 2, 3,
      4, 5, 6, 4, 6, 7,
      8, 9, 10, 8, 10, 11,
      12, 13, 14, 12, 14, 15,
      16, 17, 18, 16, 18, 19,
      20, 21, 22, 20, 22, 23 // left
  ];
  debugMesh.trs = Matrix.Translation($V([0, 0, 0]));
  var Light = /** @class */ (function () {
      function Light() {
          this.direction = [1, 1, 1];
          this.debug = false;
      }
      Light.prototype.init = function (gl, world) {
          return __awaiter(this, void 0, void 0, function () {
              var j, k, index;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          this.direction = $V(this.direction).toUnitVector().elements;
                          if (!this.debug) return [3 /*break*/, 2];
                          if (!!this.debugMesh) return [3 /*break*/, 2];
                          this.debugMesh = debugMesh.clone();
                          this.debugMesh.trs = this.debugMesh.trs.x(Matrix.Translation($V(this.direction)));
                          this.debugMesh.vertexColors = [];
                          for (j = 0; j < 6; j++) {
                              for (k = 0; k < 4; k++) {
                                  for (index = 0; index < 3; index++) {
                                      this.debugMesh.vertexColors.push(this.color[0]);
                                  }
                                  this.debugMesh.vertexColors.push(1);
                              }
                          }
                          return [4 /*yield*/, world.attachObject(this.debugMesh)];
                      case 1:
                          _a.sent();
                          _a.label = 2;
                      case 2: return [2 /*return*/];
                  }
              });
          });
      };
      return Light;
  }());
  exports.Light = Light;
  

});