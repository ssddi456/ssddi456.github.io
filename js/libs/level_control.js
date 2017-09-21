define('js/libs/level_control', ['require', 'exports', 'module', "./3dRoad", "../mesh", "./road_map", "./utils", "./wanderer", "../shaders/cube_with_fog"], function(require, exports, module) {

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
  var mesh_1 = require("../mesh");
  var road_map_1 = require("./road_map");
  var utils_1 = require("./utils");
  var wanderer_1 = require("./wanderer");
  var cube_with_fog_1 = require("../shaders/cube_with_fog");
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
  var MeshWithFog = /** @class */ (function (_super) {
      __extends(MeshWithFog, _super);
      function MeshWithFog() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.useFog = 1;
          return _this;
      }
      MeshWithFog.prototype.init = function (gl, world) {
          _super.prototype.init.call(this, gl, world);
          this.fog = this.textureCoordinates.map(function (x) { return 1; });
          this.fogBuffer = utils_1.createBuffer(gl);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.fogBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.fog), gl.STATIC_DRAW);
      };
      MeshWithFog.prototype.updateMeshInfo = function (meshInfo) {
          _super.prototype.updateMeshInfo.call(this, meshInfo);
          this.fog = this.textureCoordinates.map(function (x) { return 1; });
      };
      MeshWithFog.prototype.clone = function () {
          var ret = _super.prototype.clone.call(this);
          ret.fog = this.fog.slice();
          return ret;
      };
      MeshWithFog.prototype.rebuffering = function (gl, world, attribute) {
          _super.prototype.rebuffering.call(this, gl, world, attribute);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.fogBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.fog), gl.STATIC_DRAW);
      };
      MeshWithFog.prototype.bindBufferAndDraw = function (shader, gl) {
          shader.bindBuffer('aFog', this.fogBuffer);
          shader.bindBuffer('uUseFog', this.useFog);
          _super.prototype.bindBufferAndDraw.call(this, shader, gl);
      };
      return MeshWithFog;
  }(mesh_1.Mesh));
  exports.MeshWithFog = MeshWithFog;
  var fogChanging = 1 / 20; // 迷雾的渐变速度
  var LevelControler = /** @class */ (function () {
      function LevelControler(player) {
          this.currentLevel = 1;
          this.levelInitialed = false;
          this.wanderers = [];
          this.wanderersPool = [];
          this.player = player;
          this.maze = new road_map_1.RoadMap(10, 10);
          this.meshTranseformer = new _3dRoad_1.Mesh3dRoad(this.maze);
          this.mazeMesh = new MeshWithFog();
          this.mazeMesh.textureSrc = '/images/white.jpg';
          this.mazeMesh.shader = new cube_with_fog_1.CubeWithFogShader();
      }
      LevelControler.prototype.update = function (world) {
          var _this = this;
          var pos = this.player.currentPos.map(Math.floor);
          var visibles = this.maze.getArround(pos[0], pos[1], this.player.sightRange)
              .filter(function (x) { return _this.maze.isInGrid(x[0], x[1]); })
              .map(function (x) { return _this.maze.posToIndex(x[0], x[1]); });
          visibles.push(this.maze.posToIndex(pos[0], pos[1]));
          this.wanderers.forEach(function (wanderer) {
              var delta = wanderer.move(_this.maze);
              wanderer.mesh.x(Matrix.Translation($V([
                  delta[0],
                  0,
                  delta[1],
              ])));
          });
          this.meshTranseformer.faces.forEach(function (face) {
              var cellpos = _this.maze.indexToPos(face.index);
              var cell = _this.maze.getCell(cellpos[0], cellpos[1]);
              if (visibles.indexOf(face.index) !== -1) {
                  cell.visible = true;
                  cell.visited = true;
              }
              else {
                  cell.visible = false;
              }
              var targetVal = 0;
              if (cell.visible) {
                  targetVal = 0.5;
              }
              else if (cell.visited) {
                  targetVal = 0.3;
              }
              else {
                  targetVal = 0;
              }
              if (cellpos[0] === _this.maze.exit[0] && cellpos[1] === _this.maze.exit[1]) {
                  targetVal = 1;
              }
              var fogIndex = 0;
              var fog = _this.mazeMesh.fog;
              var oldFog = fog[face.vertexes[0].textureCoordinateIndex];
              if (oldFog !== targetVal) {
                  var delta = targetVal - oldFog;
                  var newVal = targetVal;
                  if (Math.abs(delta) > fogChanging) {
                      newVal = oldFog + (targetVal > oldFog ? 1 : -1) * fogChanging;
                  }
                  for (var faceVertexIndex = 0; faceVertexIndex < face.vertexes.length; faceVertexIndex++) {
                      fog[face.vertexes[faceVertexIndex].textureCoordinateIndex] = newVal;
                      fog[face.vertexes[faceVertexIndex].textureCoordinateIndex + 1] = targetVal;
                  }
              }
          });
      };
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
      LevelControler.prototype.levelStart = function (world) {
          var gl = world.gl;
          this.maze.width = 4 * this.hardness + this.currentLevel;
          this.maze.height = 3 * this.hardness + Math.round(this.currentLevel * 0.75);
          var startX = Math.floor(Math.random() * this.maze.width / 2);
          var startY = Math.floor(Math.random() * this.maze.height / 2);
          this.player.resetPos(startX + 0.5, startY + 0.5);
          this.maze.generateRandonRoad(startX, startY);
          var meshInfo = this.meshTranseformer.getMesh();
          this.mazeMesh.updateMeshInfo(meshInfo);
          var walkThroughs = this.maze.getAllWalkThrough();
          var wanderer;
          if (!this.wanderers.length) {
              wanderer = new wanderer_1.Wanderer();
              world.attachObject(wanderer.mesh);
              this.wanderers.push(wanderer);
          }
          else {
              wanderer = this.wanderers[0];
          }
          var wandererPos = utils_1.randomItem(walkThroughs);
          while (this.maze.isInSaveZone(wandererPos[0], wandererPos[1])) {
              wandererPos = utils_1.randomItem(walkThroughs);
          }
          wanderer.moveTo(wandererPos, world);
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