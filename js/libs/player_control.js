define('js/libs/player_control', ['require', 'exports', 'module'], function(require, exports, module) {

  "use strict";
  var Player = (function () {
      function Player() {
          this.currentPos = [0, 0];
          this.acceleration = 0.1;
          this.maxSpeed = [0, 0];
          this.speed = [0, 0];
          this.size = [0.25, 0.25];
      }
      Player.prototype.move = function (roadMap) {
          var _this = this;
          var normalizedPos = this.currentPos.map(Math.floor);
          var around = roadMap.getArround(normalizedPos[0], normalizedPos[1]);
          var premovePos = this.currentPos.map(function (x, i) { return x + _this.speed[i]; });
          var boundaryDelta = premovePos.map(function (x, i) {
              var delta = x - normalizedPos[i];
              if (delta > 1 - _this.size[i]) {
                  delta += _this.size[i];
              }
              if (delta < _this.size[i]) {
                  delta -= _this.size[i];
              }
              return delta;
          });
          var lookUpX = [];
          var lookUpY = [];
          if (boundaryDelta[0] < 0) {
              lookUpX.push(around[3]);
          }
          if (boundaryDelta[0] > 1) {
              lookUpX.push(around[4]);
          }
          if (boundaryDelta[1] < 0) {
              lookUpY.push(around[1]);
          }
          if (boundaryDelta[1] > 1) {
              lookUpY.push(around[6]);
          }
          if (boundaryDelta[0] < 0 && boundaryDelta[1] < 0) {
              lookUpX.push(around[0]);
              lookUpY.push(around[0]);
          }
          if (boundaryDelta[0] > 1 && boundaryDelta[1] < 0) {
              lookUpX.push(around[2]);
              lookUpY.push(around[2]);
          }
          if (boundaryDelta[0] < 0 && boundaryDelta[1] > 1) {
              lookUpX.push(around[5]);
              lookUpY.push(around[5]);
          }
          if (boundaryDelta[0] > 1 && boundaryDelta[1] > 1) {
              lookUpX.push(around[7]);
              lookUpY.push(around[7]);
          }
          for (var i = 0; i < lookUpX.length; i++) {
              var element = lookUpX[i];
              if (!roadMap.canWalkThrough(element[0], element[1])) {
                  premovePos[0] -= boundaryDelta[0];
                  if (boundaryDelta[0] > 1) {
                      premovePos[0] += 1;
                  }
                  break;
              }
          }
          for (var i = 0; i < lookUpY.length; i++) {
              var element = lookUpY[i];
              if (!roadMap.canWalkThrough(element[0], element[1])) {
                  premovePos[1] -= boundaryDelta[1];
                  if (boundaryDelta[1] > 1) {
                      premovePos[1] += 1;
                  }
                  break;
              }
          }
          var moveDalta = [
              premovePos[0] - this.currentPos[0],
              premovePos[1] - this.currentPos[1],
          ];
          this.currentPos[0] = premovePos[0];
          this.currentPos[1] = premovePos[1];
          return moveDalta;
      };
      Player.prototype.accelerate = function (dir) {
          this.speed[0] = dir[0] * this.acceleration;
          this.speed[1] = dir[1] * this.acceleration;
      };
      return Player;
  }());
  exports.Player = Player;
  

});