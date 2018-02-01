define('js/libs/2dRoad', ['require', 'exports', 'module'], function(require, exports, module) {

  "use strict";
  exports.__esModule = true;
  var Mesh2dRoad = /** @class */ (function () {
      function Mesh2dRoad(roadMap) {
          this.gridSize = 1;
          this.roadMap = roadMap;
      }
      Mesh2dRoad.prototype.getMesh = function () {
          var _this = this;
          var joints = this.roadMap.getAllWalkThrough();
          var jointFaces = joints.map(function (jointPos) {
              return createSquare(jointPos[0] * _this.gridSize, jointPos[1] * _this.gridSize, (jointPos[0] + 1) * _this.gridSize, (jointPos[1] + 1) * _this.gridSize);
          });
          return facesToMesh(jointFaces);
      };
      return Mesh2dRoad;
  }());
  exports.Mesh2dRoad = Mesh2dRoad;
  var UpYAxix = [0, 1, 0];
  var textureCoordinatePreset = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
  ];
  function createSquare(top, left, bottom, right) {
      var ret = {
          vertexes: [],
          indexes: []
      };
      /**
       * 在这里我们假设 Y坐标为零,
       * 法线方向指向Y坐标轴正方向
       */
      ret.vertexes.push({
          pos: [top, 0, left],
          normal: UpYAxix,
          textureCoordinate: textureCoordinatePreset[0]
      });
      ret.vertexes.push({
          pos: [bottom, 0, left],
          normal: UpYAxix,
          textureCoordinate: textureCoordinatePreset[1]
      });
      ret.vertexes.push({
          pos: [bottom, 0, right],
          normal: UpYAxix,
          textureCoordinate: textureCoordinatePreset[2]
      });
      ret.vertexes.push({
          pos: [top, 0, right],
          normal: UpYAxix,
          textureCoordinate: textureCoordinatePreset[3]
      });
      for (var start = 1; start < ret.vertexes.length - 1; start++) {
          ret.indexes.push(0);
          ret.indexes.push(start);
          ret.indexes.push(start + 1);
      }
      return ret;
  }
  function facesToMesh(faces) {
      var pointCounter = 0;
      var ret = {
          vertexs: [],
          faces: [],
          vertexNormal: [],
          textureCoordinates: [],
          vertexColors: []
      };
      for (var index = 0; index < faces.length; index++) {
          var face = faces[index];
          var faceStartIndex = pointCounter;
          for (var indexVertex = 0; indexVertex < face.vertexes.length; indexVertex++) {
              var vertex = face.vertexes[indexVertex];
              ret.vertexs.push(vertex.pos[0]);
              ret.vertexs.push(vertex.pos[1]);
              ret.vertexs.push(vertex.pos[2]);
              if (vertex.normal) {
                  ret.vertexNormal.push(vertex.normal[0]);
                  ret.vertexNormal.push(vertex.normal[1]);
                  ret.vertexNormal.push(vertex.normal[2]);
              }
              if (vertex.textureCoordinate) {
                  vertex.textureCoordinateIndex = ret.textureCoordinates.length;
                  ret.textureCoordinates.push(vertex.textureCoordinate[0]);
                  ret.textureCoordinates.push(vertex.textureCoordinate[1]);
              }
              if (vertex.vertexColor) {
                  ret.vertexColors.push(vertex.vertexColor[0]);
                  ret.vertexColors.push(vertex.vertexColor[1]);
                  ret.vertexColors.push(vertex.vertexColor[2]);
                  ret.vertexColors.push(vertex.vertexColor[3]);
              }
              pointCounter++;
          }
          for (var indexFaceIndex = 0; indexFaceIndex < face.indexes.length; indexFaceIndex++) {
              ret.faces.push(faceStartIndex + face.indexes[indexFaceIndex]);
          }
      }
      return ret;
  }
  exports.facesToMesh = facesToMesh;
  

});
