define('js/libs/3dRoad', ['require', 'exports', 'module', "./2dRoad"], function(require, exports, module) {

  "use strict";
  var _2dRoad_1 = require("./2dRoad");
  var gridSize = 1;
  var Mesh3dRoad = (function () {
      function Mesh3dRoad(roadMap) {
          this.roadMap = roadMap;
      }
      Mesh3dRoad.prototype.getMesh = function () {
          var _this = this;
          var roadMap = this.roadMap;
          var jointFaces = [];
          roadMap.forEach(function (wayPosX, wayPosY) {
              var top = wayPosX * gridSize;
              var left = wayPosY * gridSize;
              var bottom = (wayPosX + 1) * gridSize;
              var right = (wayPosY + 1) * gridSize;
              if (!roadMap.canWalkThrough(wayPosX, wayPosY)) {
                  jointFaces.push(createTopSquare(top, left, bottom, right, gridSize, wallColor));
                  return;
              }
              jointFaces.push(createTopSquare(top, left, bottom, right, 0, groundColor));
              var nearBys = _this.roadMap.getNearBy(wayPosX, wayPosY);
              nearBys.forEach(function (nearBy) {
                  if (!_this.roadMap.canWalkThrough(nearBy[0], nearBy[1])) {
                      if (nearBy[0] === wayPosX) {
                          if (nearBy[1] > wayPosY) {
                              // create front
                              jointFaces.push(createFrontSquare(top, right, bottom, BackZAxis, wallColor));
                          }
                          else if (nearBy[1] < wayPosY) {
                              // create back
                              jointFaces.push(createFrontSquare(bottom, left, top, FrontZAxis, wallColor));
                          }
                      }
                      else if (nearBy[1] === wayPosY) {
                          if (nearBy[0] > wayPosX) {
                              // create right
                              jointFaces.push(createSideSquare(bottom, right, left, LeftXAxis, wallColor));
                          }
                          else if (nearBy[0] < wayPosX) {
                              // create left
                              jointFaces.push(createSideSquare(top, left, right, RightXAxis, wallColor));
                          }
                      }
                  }
              });
          });
          return _2dRoad_1.FacesToMesh(jointFaces);
      };
      return Mesh3dRoad;
  }());
  exports.Mesh3dRoad = Mesh3dRoad;
  var UpYAxis = [0, 1, 0];
  var LeftXAxis = [-1, 0, 0];
  var RightXAxis = [1, 0, 0];
  var FrontZAxis = [0, 0, 1];
  var BackZAxis = [0, 0, -1];
  var wallColor = [1, 0.1, 0, 1];
  var groundColor = [0, 0, 0, 1];
  var frontColor = [1.0, 1.0, 1.0, 1.0];
  var backColor = [1.0, 0.0, 0.0, 1.0];
  var topColor = [0.0, 1.0, 0.0, 1.0];
  var bottomColor = [0.0, 0.0, 1.0, 1.0];
  var rightColor = [1.0, 1.0, 0.0, 1.0];
  var leftColor = [1.0, 0.0, 1.0, 1.0];
  var textureCoordinatePreset = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
  ];
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
  function createFrontSquare(top, left, bottom, normal, vertexColor) {
      var vertexes = [
          {
              pos: [top, 0, left],
              normal: normal,
              textureCoordinate: textureCoordinatePreset[0],
              vertexColor: vertexColor
          },
          {
              pos: [top, gridSize, left],
              normal: normal,
              vertexColor: vertexColor,
              textureCoordinate: textureCoordinatePreset[1]
          },
          {
              pos: [bottom, gridSize, left],
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
  function createSideSquare(top, left, right, normal, vertexColor) {
      var vertexes = [
          {
              pos: [top, 0, left],
              normal: normal,
              textureCoordinate: textureCoordinatePreset[0],
              vertexColor: vertexColor
          },
          {
              pos: [top, gridSize, left],
              normal: normal,
              textureCoordinate: textureCoordinatePreset[1],
              vertexColor: vertexColor
          },
          {
              pos: [top, gridSize, right],
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