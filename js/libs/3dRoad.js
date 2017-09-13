define('js/libs/3dRoad', ['require', 'exports', 'module', "./2dRoad"], function(require, exports, module) {

  "use strict";
  exports.__esModule = true;
  var _2dRoad_1 = require("./2dRoad");
  exports.gridSize = 1;
  var Mesh3dRoad = /** @class */ (function () {
      function Mesh3dRoad(roadMap) {
          this.roadMap = roadMap;
      }
      Mesh3dRoad.prototype.getMesh = function () {
          var roadMap = this.roadMap;
          var jointFaces = [];
          var wallColorMap = {};
          function getWallColor(x, y) {
              var wallColorIndex = x + ',' + y;
              if (!(wallColorIndex in wallColorMap)) {
                  wallColorMap[wallColorIndex] = Math.floor(Math.random() * wallColors.length);
              }
              return wallColorMap[wallColorIndex];
          }
          roadMap.forEach(function (wayPosX, wayPosY, cell, index) {
              var top = wayPosX * exports.gridSize;
              var left = wayPosY * exports.gridSize;
              var bottom = (wayPosX + 1) * exports.gridSize;
              var right = (wayPosY + 1) * exports.gridSize;
              var addFace = function (face) {
                  jointFaces.push(markCell(index, face));
              };
              if (!roadMap.canWalkThrough(wayPosX, wayPosY)) {
                  var wallColorIndex = getWallColor(wayPosX, wayPosY);
                  var wallUseColor = wallColors[wallColorIndex];
                  var wallHeight = (Math.random() * 1 + 0.3) * exports.gridSize;
                  addFace(createTopSquare(top, left, bottom, right, wallHeight, wallUseColor));
                  // front
                  addFace(createFrontSquare(top, left, bottom, wallHeight, BackZAxis, wallUseColor));
                  // back
                  addFace(createFrontSquare(bottom, right, top, wallHeight, FrontZAxis, wallUseColor));
                  // right
                  addFace(createSideSquare(top, right, left, wallHeight, LeftXAxis, wallUseColor));
                  // left
                  addFace(createSideSquare(bottom, left, right, wallHeight, RightXAxis, wallUseColor));
                  return;
              }
              var groundUseColor = exports.groundColor;
              if (wayPosX === roadMap.entrance[0]
                  && wayPosY === roadMap.entrance[1]) {
                  groundUseColor = exports.entranceColor;
              }
              else if (wayPosX === roadMap.exit[0]
                  && wayPosY === roadMap.exit[1]) {
                  groundUseColor = exports.exitColor;
              }
              addFace(createTopSquare(top, left, bottom, right, 0, groundUseColor));
          });
          this.faces = jointFaces;
          return _2dRoad_1.facesToMesh(jointFaces);
      };
      return Mesh3dRoad;
  }());
  exports.Mesh3dRoad = Mesh3dRoad;
  var UpYAxis = [0, 1, 0];
  var LeftXAxis = [-1, 0, 0];
  var RightXAxis = [1, 0, 0];
  var FrontZAxis = [0, 0, 1];
  var BackZAxis = [0, 0, -1];
  var wallColors = [[0.6875, 0.41796875, 0.4375, 0.4],
      [0.95703125, 0.8515625, 0.80859375, 0.4],
      [0.71484375, 0.8203125, 0.55078125, 0.4],
      [0.91015625, 0.984375, 0.7265625, 0.4],
      [0.6015625, 0.6796875, 0.44921875, 0.4],
      [0.96875, 0.62890625, 0.421875, 0.4],
      [0.81640625, 0.6640625, 0.76953125, 0.4],
      [0.609375, 0.55859375, 0.67578125, 0.4],
      [0.8671875, 0.78515625, 0.953125, 0.4],
      [0.54296875, 0.47265625, 0.42578125, 0.4],
      [0.984375, 0.875, 0.8203125, 0.4],
      [0.53515625, 0.5390625, 0.41796875, 0.4],
      [0.9921875, 0.98046875, 0.8046875, 0.4],
      [0.52734375, 0.52734375, 0.39453125, 0.4],
      [0.7890625, 0.92578125, 0.91015625, 0.4],
      [0.51953125, 0.55859375, 0.5625, 0.4],
      [0.796875, 0.921875, 0.83984375, 0.4],
      [0.57421875, 0.69921875, 0.60546875, 0.4],
      [0.92578125, 0.90234375, 0.81640625, 0.4],
      [0.80078125, 0.6640625, 0.5859375, 0.4],
      [0.99609375, 0.9765625, 0.87109375, 0.4],
      [0.859375, 0.7421875, 0.609375, 0.4],
      [0.99609375, 0.921875, 0.859375, 0.4],
      [0.87890625, 0.61328125, 0.671875, 0.4],
      [0.91796875, 0.8515625, 0.4921875, 0.4],
      [0.80859375, 0.55859375, 0.453125, 0.4],
      [0.9765625, 0.875, 0.43359375, 0.4],
      [0.72265625, 0.5234375, 0.44140625, 0.4],
      [0.9296875, 0.625, 0.5859375, 0.4],
      [0.98046875, 0.9453125, 0.44140625, 0.4],
      [0.859375, 0.5234375, 0.45703125, 0.4]];
  // alpha 通道用来
  exports.entranceColor = [0, 0, 1, 0.5];
  exports.exitColor = [0, 1, 0, 0.5];
  exports.wallColor = [1, 0.1, 0, 0.6];
  exports.groundColor = [0, 0, 0, 0.2];
  exports.frontColor = [1.0, 1.0, 1.0, 1.0];
  exports.backColor = [1.0, 0.0, 0.0, 1.0];
  exports.topColor = [0.0, 1.0, 0.0, 1.0];
  exports.bottomColor = [0.0, 0.0, 1.0, 1.0];
  exports.rightColor = [1.0, 1.0, 0.0, 1.0];
  exports.leftColor = [1.0, 0.0, 1.0, 1.0];
  /**
   * @file 用于构造一个随机生成的3D迷宫。
   *
   * 主题1 糖果屋
   * 元素 棒棒糖 姜饼 拐杖糖 甜甜圈
   *
   * 主题2 星际争霸 虫巢
   * 元素 菌摊 蟑螂 孵化场 跳虫 触手
   */
  var textureCoordinatePreset = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
  ];
  function markCell(index, face) {
      face.index = index;
      return face;
  }
  function createSquare(vertexes) {
      var ret = {
          vertexes: vertexes,
          indexes: []
      };
      for (var start = 1; start < ret.vertexes.length - 1; start++) {
          ret.indexes.push(0);
          ret.indexes.push(start);
          ret.indexes.push(start + 1);
      }
      return ret;
  }
  function createTopSquare(top, left, bottom, right, height, vertexColor) {
      /**
       * 在这里我们假设 Y坐标为零,
       * 法线方向指向Y坐标轴正方向
       */
      var vertexes = [
          {
              pos: [top, height, left],
              normal: UpYAxis,
              vertexColor: vertexColor,
              textureCoordinate: textureCoordinatePreset[0]
          },
          {
              pos: [bottom, height, left],
              normal: UpYAxis,
              vertexColor: vertexColor,
              textureCoordinate: textureCoordinatePreset[1]
          },
          {
              pos: [bottom, height, right],
              normal: UpYAxis,
              vertexColor: vertexColor,
              textureCoordinate: textureCoordinatePreset[2]
          },
          {
              pos: [top, height, right],
              normal: UpYAxis,
              vertexColor: vertexColor,
              textureCoordinate: textureCoordinatePreset[3]
          },
      ];
      return createSquare(vertexes);
  }
  exports.createTopSquare = createTopSquare;
  function createFrontSquare(top, left, bottom, height, normal, vertexColor) {
      var vertexes = [
          {
              pos: [top, 0, left],
              normal: normal,
              textureCoordinate: textureCoordinatePreset[0],
              vertexColor: vertexColor
          },
          {
              pos: [top, height, left],
              normal: normal,
              vertexColor: vertexColor,
              textureCoordinate: textureCoordinatePreset[1]
          },
          {
              pos: [bottom, height, left],
              normal: normal,
              vertexColor: vertexColor,
              textureCoordinate: textureCoordinatePreset[2]
          },
          {
              pos: [bottom, 0, left],
              normal: normal,
              vertexColor: vertexColor,
              textureCoordinate: textureCoordinatePreset[3]
          },
      ];
      return createSquare(vertexes);
  }
  function createSideSquare(top, left, right, height, normal, vertexColor) {
      var vertexes = [
          {
              pos: [top, 0, left],
              normal: normal,
              textureCoordinate: textureCoordinatePreset[0],
              vertexColor: vertexColor
          },
          {
              pos: [top, height, left],
              normal: normal,
              textureCoordinate: textureCoordinatePreset[1],
              vertexColor: vertexColor
          },
          {
              pos: [top, height, right],
              normal: normal,
              textureCoordinate: textureCoordinatePreset[2],
              vertexColor: vertexColor
          },
          {
              pos: [top, 0, right],
              normal: normal,
              textureCoordinate: textureCoordinatePreset[3],
              vertexColor: vertexColor
          },
      ];
      return createSquare(vertexes);
  }
  

});