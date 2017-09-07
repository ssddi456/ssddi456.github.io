define('js/libs/level_control', ['require', 'exports', 'module', "./3dRoad", "../shaders/cube_with_texture_and_lighting_shader", "../mesh", "./road_map"], function(require, exports, module) {

  "use strict";
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
      };
      Object.defineProperty(LevelControler.prototype, "hardness", {
          get: function () {
              return Math.min(Math.floor(this.currentLevel / 10), 10);
          },
          enumerable: true,
          configurable: true
      });
      LevelControler.prototype.reset = function () {
          this.levelInitialed = false;
          this.player.currentPos[0] = 0;
          this.player.currentPos[1] = 0;
      };
      LevelControler.prototype.levelStart = function () {
          // 先不管这个难度
          this.maze.height = this.maze.width = Math.max(10, Math.floor(Math.log10(this.hardness * 5)));
          //
          this.maze.width = 23;
          this.maze.height = 19;
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
      };
      LevelControler.prototype.levelPass = function () {
          this.passLevel();
      };
      return LevelControler;
  }());
  exports.LevelControler = LevelControler;
  

});