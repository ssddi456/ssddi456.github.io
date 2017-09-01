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
          // 获取移动后中心相对当前所在方块的偏移量
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
          var lookUpX;
          var lookUpY;
          var commonCheck;
          var commonCheckCondition;
          // 检查周围八个方块是否需要进行碰撞
          if (boundaryDelta[0] < 0) {
              lookUpX = around[3];
          }
          if (boundaryDelta[0] > 1) {
              lookUpX = around[4];
          }
          if (boundaryDelta[1] < 0) {
              lookUpY = around[1];
          }
          if (boundaryDelta[1] > 1) {
              lookUpY = around[6];
          }
          if (boundaryDelta[0] < 0 && boundaryDelta[1] < 0) {
              commonCheckCondition = function (delta) { return delta[0] < 0 && delta[1] < 0; };
              commonCheck = around[0];
          }
          if (boundaryDelta[0] > 1 && boundaryDelta[1] < 0) {
              commonCheckCondition = function (delta) { return delta[0] > 1 && delta[1] < 0; };
              commonCheck = around[2];
          }
          if (boundaryDelta[0] < 0 && boundaryDelta[1] > 1) {
              commonCheckCondition = function (delta) { return delta[0] < 0 && delta[1] > 1; };
              commonCheck = around[5];
          }
          if (boundaryDelta[0] > 1 && boundaryDelta[1] > 1) {
              commonCheckCondition = function (delta) { return delta[0] > 1 && delta[1] > 1; };
              commonCheck = around[7];
          }
          // 进行十字方向上的碰撞
          if (lookUpX && !roadMap.canWalkThrough(lookUpX[0], lookUpX[1])) {
              premovePos[0] -= boundaryDelta[0];
              if (boundaryDelta[0] > 1) {
                  premovePos[0] += 1;
              }
          }
          if (lookUpY && !roadMap.canWalkThrough(lookUpY[0], lookUpY[1])) {
              premovePos[1] -= boundaryDelta[1];
              if (boundaryDelta[1] > 1) {
                  premovePos[1] += 1;
              }
          }
          // 十字方向碰撞完成后检查修正后的偏移量
          if (commonCheck && !roadMap.canWalkThrough(commonCheck[0], commonCheck[1])) {
              var recaculateDelta = premovePos.map(function (x, i) {
                  var delta = x - normalizedPos[i];
                  if (delta > 1 - _this.size[i]) {
                      delta += _this.size[i];
                  }
                  if (delta < _this.size[i]) {
                      delta -= _this.size[i];
                  }
                  return delta;
              });
              if (commonCheckCondition(recaculateDelta)) {
                  // 检查四个角的碰撞是否需要修正
                  if (recaculateDelta[0] < 0 || recaculateDelta[0] > 1) {
                      premovePos[0] -= recaculateDelta[0];
                      if (boundaryDelta[0] > 1) {
                          premovePos[0] += 1;
                      }
                  }
                  if (recaculateDelta[1] < 0 || recaculateDelta[1] > 1) {
                      premovePos[1] -= recaculateDelta[1];
                      if (boundaryDelta[1] > 1) {
                          premovePos[1] += 1;
                      }
                  }
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