define('js/libs/road_map', ['require', 'exports', 'module', "./3dRoad"], function(require, exports, module) {

  "use strict";
  exports.__esModule = true;
  var _3dRoad_1 = require("./3dRoad");
  var RoadMap = /** @class */ (function () {
      function RoadMap(x, y) {
          this.width = 0;
          this.height = 0;
          this.safeZoneSize = 3;
          this.grid = [];
          this.width = x;
          this.height = y;
      }
      RoadMap.prototype.resetGrid = function () {
          this.grid = this.grid || [];
          this.grid.splice(this.height, this.grid.length - this.height);
          for (var indexY = 0; indexY < this.height; indexY++) {
              var row = void 0;
              if (!this.grid[indexY]) {
                  row = [];
                  this.grid.push(row);
              }
              row = this.grid[indexY];
              row.splice(this.width, row.length - this.width);
              for (var indexX = 0; indexX < this.width; indexX++) {
                  var el = row[indexX];
                  if (el === undefined) {
                      el = {
                          canWalkThrough: false,
                          visited: false,
                          visible: false
                      };
                      row.push(el);
                  }
                  else {
                      el.canWalkThrough = false;
                      el.visited = false;
                      el.visible = false;
                  }
              }
          }
      };
      RoadMap.prototype.setWall = function (x, y) {
          this.grid[y][x].canWalkThrough = false;
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
          return this.grid[y][x].canWalkThrough;
      };
      RoadMap.prototype.setWalkThrough = function (x, y) {
          this.grid[y][x].canWalkThrough = true;
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
              var pos = [0, 0];
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
                  if (row[indexX].canWalkThrough) {
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
                  walker(indexX, indexY, row[indexX], this.posToIndex(indexX, indexY));
              }
          }
      };
      RoadMap.prototype.getArround = function (x, y, distance) {
          if (distance === void 0) { distance = 2; }
          var deltas = [0];
          for (var j = 1; j < distance; j++) {
              deltas.push(j);
              deltas.unshift(-1 * j);
          }
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
      RoadMap.prototype.posToIndex = function (x, y) {
          return y * this.width + x;
      };
      RoadMap.prototype.indexToPos = function (index) {
          var x = index % this.width;
          var ret = [x, Math.floor(index / this.width)];
          return ret;
      };
      RoadMap.prototype.getCell = function (x, y) {
          return this.grid[y][x];
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
      RoadMap.prototype.setSafeZone = function (centerX, centerY) {
          this.safeZone = [
              centerX - this.safeZoneSize, centerY - this.safeZoneSize,
              centerX + this.safeZoneSize, centerY + this.safeZoneSize,
          ];
      };
      RoadMap.prototype.getSafeZoneSize = function () {
          return [
              this.safeZone[0] * _3dRoad_1.gridSize, this.safeZone[1] * _3dRoad_1.gridSize,
              (this.safeZone[2] + 1) * _3dRoad_1.gridSize, (this.safeZone[3] + 1) * _3dRoad_1.gridSize,
          ];
      };
      RoadMap.prototype.isInSaveZone = function (x, y) {
          var posX = Math.floor(x);
          var posY = Math.floor(y);
          if (!this.isInGrid(x, y)) {
              return false;
          }
          return posX >= this.safeZone[0] && posX <= this.safeZone[2]
              && posY >= this.safeZone[1] && posY <= this.safeZone[3];
      };
      RoadMap.prototype.generateRandonRoad = function (startX, startY) {
          var _this = this;
          if (startX === void 0) { startX = 0; }
          if (startY === void 0) { startY = 0; }
          this.resetGrid();
          var waitForCheck = [];
          this.entrance = [startX, startY];
          this.setSafeZone(startX, startY);
          waitForCheck.push(this.entrance);
          while (waitForCheck.length) {
              // random pop
              var pos = void 0;
              if (Math.random() >= 0.5) {
                  pos = waitForCheck.pop();
              }
              else {
                  pos = waitForCheck.shift();
              }
              var nearBy = this.getCheckPos(pos[0], pos[1]);
              var blocked = nearBy.filter(function (nearByPos) {
                  return !_this.canWalkThrough(nearByPos.add[0], nearByPos.add[1]) &&
                      !_this.canWalkThrough(nearByPos.check[0], nearByPos.check[1]);
              });
              // 这个逻辑有点不对
              if (blocked.length >= nearBy.length - 1) {
                  this.setWalkThrough(pos[0], pos[1]);
                  // random push
                  while (blocked.length) {
                      var block = blocked.pop();
                      if (block) {
                          this.setWalkThrough(block.add[0], block.add[1]);
                          if (Math.random() >= 0.5) {
                              waitForCheck.push(block.check);
                          }
                          else {
                              waitForCheck.unshift(block.check);
                          }
                      }
                  }
              }
          }
          var exit = [this.width - 1, Math.max(2, Math.ceil(Math.random() * this.height - 2))];
          this.exit = exit;
          var findXExit = exit[0];
          for (; findXExit > 0; findXExit--) {
              if (this.canWalkThrough(findXExit, exit[1])) {
                  break;
              }
              else {
                  this.setWalkThrough(findXExit, exit[1]);
              }
          }
      };
      return RoadMap;
  }());
  exports.RoadMap = RoadMap;
  

});