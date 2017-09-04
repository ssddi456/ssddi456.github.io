define('js/libs/level_control', ['require', 'exports', 'module', "./3dRoad", "../shaders/cube_with_texture_and_lighting_shader", "../mesh", "./road_map"], function(require, exports, module) {

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
  var _3dRoad_1 = require("./3dRoad");
  var cube_with_texture_and_lighting_shader_1 = require("../shaders/cube_with_texture_and_lighting_shader");
  var mesh_1 = require("../mesh");
  var road_map_1 = require("./road_map");
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
  var LevelControler = (function () {
      function LevelControler(player) {
          this.currentLevel = 1;
          this.player = player;
          this.maze = new road_map_1.RoadMap(10, 10);
          this.meshTranseformer = new _3dRoad_1.Mesh3dRoad(this.maze);
          this.mazeMesh = new mesh_1.Mesh();
          this.mazeMesh.textureSrc = '/images/white.jpg';
          this.mazeMesh.shader = new cube_with_texture_and_lighting_shader_1.CubeWithTextureAndLightingShader();
      }
      LevelControler.prototype.passLevel = function () {
          this.currentLevel += 1;
          // 应该在这里庆祝一下
      };
      Object.defineProperty(LevelControler.prototype, "hardness", {
          get: function () {
              return Math.min(Math.floor(this.currentLevel / 10), 10);
          },
          enumerable: true,
          configurable: true
      });
      LevelControler.prototype.levelStart = function () {
          return __awaiter(this, void 0, void 0, function () {
              var startX, startY, meshInfo;
              return __generator(this, function (_a) {
                  startX = 0;
                  startY = 0;
                  this.player.resetPos(startX, startY);
                  // 先不管这个难度
                  this.maze.height = this.maze.width = Math.max(10, Math.floor(Math.log10(this.hardness * 5)));
                  //
                  this.maze.width = 24;
                  this.maze.height = 20;
                  this.maze.generateRandonRoad(startX, startY);
                  meshInfo = this.meshTranseformer.getMesh();
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
                  return [2 /*return*/];
              });
          });
      };
      LevelControler.prototype.levelPass = function () {
          this.passLevel();
          this.levelStart();
      };
      return LevelControler;
  }());
  exports.LevelControler = LevelControler;
  

});