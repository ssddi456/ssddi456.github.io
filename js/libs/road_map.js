define('js/libs/road_map', ['require', 'exports', 'module'], function(require, exports, module) {

  "use strict";
  /**
   * [
   *  [0, 0, 0],
   *  [0, 0, 0],
   *  [0, 0, 0],
   * ]
   *
   * 来构成一个地图，0为不通过，1为可以通过。
   */
  var RoadMap = (function () {
      function RoadMap(x, y) {
          this.width = 0;
          this.height = 0;
          this.grid = [];
          this.width = x;
          this.height = y;
          for (var indexY = 0; indexY < y; indexY++) {
              var row = [];
              this.grid.push(row);
              for (var indexX = 0; indexX < x; indexX++) {
                  row.push(0);
              }
          }
      }
      RoadMap.prototype.setWall = function (x, y) {
          this.grid[y][x] = 0;
      };
      RoadMap.prototype.isInGrid = function (x, y) {
          if (x < 0 ||
              x >= this.width ||
              y < 0 ||
              y >= this.height) {
              return false;
          }
          return true;
      };
      RoadMap.prototype.canWalkThrough = function (x, y) {
          if (!this.isInGrid(x, y)) {
              return false;
          }
          return this.grid[y][x] === 1;
      };
      RoadMap.prototype.setWalkThrough = function (x, y) {
          this.grid[y][x] = 1;
      };
      RoadMap.prototype.setRoad = function (a, b) {
          var increaser;
          var fixer;
          if (a[0] === b[0]) {
              fixer = 0;
              increaser = 1;
          }
          else if (a[1] === b[1]) {
              fixer = 1;
              increaser = 0;
          }
          var start = a[increaser];
          var step = Math.abs(b[increaser] - a[increaser]);
          var direction = (b[increaser] - a[increaser]) / step;
          for (var index = 0; index < step; index += 1) {
              var pos = [];
              pos[fixer] = a[fixer];
              pos[increaser] = start + index * direction;
              this.setWalkThrough.apply(this, pos);
          }
      };
      RoadMap.prototype.isJoint = function (x, y) {
          if (!this.canWalkThrough(x, y)) {
              return false;
          }
          if (!(this.canWalkThrough(x - 1, y) && this.canWalkThrough(x + 1, y)) ||
              !(this.canWalkThrough(x, y - 1) && this.canWalkThrough(x, y + 1))) {
              return true;
          }
      };
      RoadMap.prototype.getAllJoint = function () {
          var ret = [];
          for (var indexY = 0; indexY < this.grid.length; indexY++) {
              var row = this.grid[indexY];
              for (var indexX = 0; indexX < this.grid.length; indexX++) {
                  if (this.isJoint(indexX, indexY)) {
                      ret.push([indexX, indexY]);
                  }
              }
          }
          return ret;
      };
      RoadMap.prototype.getAllWalkThrough = function () {
          var ret = [];
          for (var indexY = 0; indexY < this.grid.length; indexY++) {
              var row = this.grid[indexY];
              for (var indexX = 0; indexX < this.grid.length; indexX++) {
                  if (row[indexX] === 1) {
                      ret.push([indexX, indexY]);
                  }
              }
          }
          return ret;
      };
      RoadMap.prototype.forEach = function (walker) {
          for (var indexY = 0; indexY < this.grid.length; indexY++) {
              var row = this.grid[indexY];
              for (var indexX = 0; indexX < row.length; indexX++) {
                  walker(indexX, indexY);
              }
          }
      };
      RoadMap.prototype.getArround = function (x, y) {
          var deltas = [-1, 0, 1];
          var ret = [];
          for (var indexY = 0; indexY < deltas.length; indexY++) {
              var deltaY = deltas[indexY];
              for (var indexX = 0; indexX < deltas.length; indexX++) {
                  var deltaX = deltas[indexX];
                  if (!(deltaX === 0 && deltaY === 0)) {
                      ret.push([x + deltaX, y + deltaY]);
                  }
              }
          }
          return ret;
      };
      RoadMap.prototype.getNearBy = function (x, y) {
          var ret = [];
          if (this.isInGrid(x, y - 1)) {
              ret.push([x, y - 1]);
          }
          if (this.isInGrid(x, y + 1)) {
              ret.push([x, y + 1]);
          }
          if (this.isInGrid(x - 1, y)) {
              ret.push([x - 1, y]);
          }
          if (this.isInGrid(x + 1, y)) {
              ret.push([x + 1, y]);
          }
          return ret;
      };
      RoadMap.prototype.getCheckPos = function (x, y) {
          var ret = [];
          if (this.isInGrid(x, y - 2)) {
              ret.push({ check: [x, y - 2], add: [x, y - 1] });
          }
          if (this.isInGrid(x, y + 2)) {
              ret.push({ check: [x, y + 2], add: [x, y + 1] });
          }
          if (this.isInGrid(x - 2, y)) {
              ret.push({ check: [x - 2, y], add: [x - 1, y] });
          }
          if (this.isInGrid(x + 2, y)) {
              ret.push({ check: [x + 2, y], add: [x + 1, y] });
          }
          return ret;
      };
      RoadMap.prototype.generateRandonRoad = function (startX, startY) {
          var _this = this;
          if (startX === void 0) { startX = 0; }
          if (startY === void 0) { startY = 0; }
          var waitForCheck = [];
          waitForCheck.push([startX, startY]);
          while (waitForCheck.length) {
              var pos = waitForCheck.pop();
              var nearBy = this.getCheckPos(pos[0], pos[1]);
              var blocked = nearBy.filter(function (nearByPos) {
                  return !_this.canWalkThrough(nearByPos.add[0], nearByPos.add[1]) &&
                      !_this.canWalkThrough(nearByPos.check[0], nearByPos.check[1]);
              });
              if (blocked.length >= nearBy.length - 1) {
                  this.setWalkThrough(pos[0], pos[1]);
                  // random push
                  while (blocked.length) {
                      if (Math.random() > 0.5) {
                          waitForCheck.push(blocked.pop().add);
                      }
                      else {
                          waitForCheck.push(blocked.shift().add);
                      }
                  }
              }
          }
      };
      return RoadMap;
  }());
  exports.RoadMap = RoadMap;
  

});