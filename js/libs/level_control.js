define('js/libs/level_control', ['require', 'exports', 'module', "./3dRoad", "../shaders/cube_with_texture_and_lighting_shader", "../mesh", "./road_map", "./utils"], function(require, exports, module) {

  "use strict";
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
  var _3dRoad_1 = require("./3dRoad");
  var cube_with_texture_and_lighting_shader_1 = require("../shaders/cube_with_texture_and_lighting_shader");
  var mesh_1 = require("../mesh");
  var road_map_1 = require("./road_map");
  var utils_1 = require("./utils");
  /**
   * @file 关卡管理
   *
   * 过关后生成新关卡
   * 当前过关信息
   * 难度控制
   *   1 生成算法
   *   2 地图大小
   *   3 演出效果
   */
  var LevelControler = /** @class */ (function () {
      function LevelControler(player) {
          this.currentLevel = 1;
          this.levelInitialed = false;
          this.player = player;
          this.maze = new road_map_1.RoadMap(10, 10);
          this.meshTranseformer = new _3dRoad_1.Mesh3dRoad(this.maze);
          this.mazeMesh = new mesh_1.Mesh();
          this.mazeMesh.textureSrc = '/images/white.jpg';
          this.mazeMesh.shader = new cube_with_texture_and_lighting_shader_1.CubeWithTextureAndLightingShader();
      }
      LevelControler.prototype.passLevel = function () {
          this.currentLevel += 1;
          this.levelInitialed = false;
          // 应该在这里庆祝一下
          this.playAnima(this.passLevelAnima);
      };
      Object.defineProperty(LevelControler.prototype, "hardness", {
          get: function () {
              return Math.max(Math.floor(Math.log10(this.currentLevel) * 3), 3);
          },
          enumerable: true,
          configurable: true
      });
      LevelControler.prototype.playAnima = function (anima) {
          var self = this;
          this.transformLevel = utils_1.wrapIterableIterator(function () {
              var ticks, tick;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          ticks = anima.call(self);
                          _a.label = 1;
                      case 1:
                          tick = ticks.next();
                          return [4 /*yield*/, tick.value];
                      case 2:
                          _a.sent();
                          _a.label = 3;
                      case 3:
                          if (!tick.done) return [3 /*break*/, 1];
                          _a.label = 4;
                      case 4:
                          self.transformLevel = undefined;
                          return [2 /*return*/];
                  }
              });
          });
      };
      LevelControler.prototype.startLevelAnima = function () {
          var frames, delta, i;
          return __generator(this, function (_a) {
              switch (_a.label) {
                  case 0:
                      frames = 1 * 15;
                      delta = (0.1 + 1.3) / frames;
                      i = 0;
                      _a.label = 1;
                  case 1:
                      if (!(i < frames)) return [3 /*break*/, 4];
                      return [4 /*yield*/, this.mazeMesh.x(Matrix.Translation($V([0, delta, 0])))];
                  case 2:
                      _a.sent();
                      _a.label = 3;
                  case 3:
                      i++;
                      return [3 /*break*/, 1];
                  case 4: return [2 /*return*/];
              }
          });
      };
      LevelControler.prototype.passLevelAnima = function () {
          var frames, delta, i;
          return __generator(this, function (_a) {
              switch (_a.label) {
                  case 0:
                      frames = 1 * 15;
                      delta = -1 * (0.1 + 1.3) / frames;
                      i = 0;
                      _a.label = 1;
                  case 1:
                      if (!(i < frames)) return [3 /*break*/, 4];
                      return [4 /*yield*/, this.mazeMesh.x(Matrix.Translation($V([0, delta, 0])))];
                  case 2:
                      _a.sent();
                      _a.label = 3;
                  case 3:
                      i++;
                      return [3 /*break*/, 1];
                  case 4: return [2 /*return*/];
              }
          });
      };
      LevelControler.prototype.reset = function () {
          this.levelInitialed = false;
          this.player.currentPos[0] = 0;
          this.player.currentPos[1] = 0;
      };
      LevelControler.prototype.levelStart = function () {
          this.maze.width = 4 * this.hardness + this.currentLevel;
          this.maze.height = 3 * this.hardness + Math.round(this.currentLevel * 0.75);
          var startX = Math.floor(Math.random() * this.maze.width / 2);
          var startY = Math.floor(Math.random() * this.maze.height / 2);
          this.player.resetPos(startX + 0.5, startY + 0.5);
          this.maze.generateRandonRoad(startX, startY);
          var meshInfo = this.meshTranseformer.getMesh();
          this.mazeMesh.debug = false;
          this.mazeMesh.visible = true;
          this.mazeMesh.vertices = meshInfo.vertexs;
          this.mazeMesh.faces = meshInfo.faces;
          if (meshInfo.vertexColors.length) {
              this.mazeMesh.vertexColors = meshInfo.vertexColors;
          }
          if (meshInfo.vertexNormal.length) {
              this.mazeMesh.vertexNormal = meshInfo.vertexNormal;
          }
          if (meshInfo.textureCoordinates.length) {
              this.mazeMesh.textureCoordinates = meshInfo.textureCoordinates;
          }
          this.levelInitialed = true;
          if (this.currentLevel > 1) {
              this.playAnima(this.startLevelAnima);
          }
      };
      LevelControler.prototype.levelPass = function () {
          this.passLevel();
      };
      return LevelControler;
  }());
  exports.LevelControler = LevelControler;
  

});