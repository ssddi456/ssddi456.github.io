define('js/xo', ['require', 'exports', 'module', "./libs/road_map"], function(require, exports, module) {

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
  exports.__esModule = true;
  var road_map_1 = require("./libs/road_map");
  var Xo = /** @class */ (function () {
      function Xo() {
      }
      Xo.prototype.setColor = function (color) {
          $(this.el).addClass('xo-' + color).find('.xo-inner').text('');
          this.color = color;
      };
      Xo.prototype.reset = function () {
          $(this.el).attr('class', 'xo').find('.xo-inner').text('');
          this.color = undefined;
      };
      return Xo;
  }());
  var XoMap = /** @class */ (function (_super) {
      __extends(XoMap, _super);
      function XoMap() {
          var _this = _super.call(this, 3, 3) || this;
          _this.width = 3;
          _this.height = 3;
          _this.grid = [];
          _this.els = [];
          _this.wrapper = $('#main');
          _this.padding = 10;
          _this.currentColor = 'black';
          _this.undos = [];
          _this.redos = [];
          _this.wrapper.on('click', '.xo', function (e) {
              var target = e.currentTarget;
              var xo = target.element;
              if (xo.color) {
                  return;
              }
              var playerColor = _this.currentColor;
              xo.setColor(_this.toggleColor());
              var xos = [xo];
              // 这里判定一下是否胜利
              var playerScore = caculateValue(_this.grid, playerColor);
              if (playerScore === 100) {
                  alert('you win');
                  _this.resetGrid();
              }
              // 响应
              var computerColor = _this.currentColor;
              var dos = predict2(_this.grid, _this.currentColor);
              if (dos) {
                  var echo = _this.grid[dos.pos[1]][dos.pos[0]];
                  echo.setColor(_this.toggleColor());
                  xos.push(echo);
              }
              // 这里判定一下是否胜利
              var computerScore = caculateValue(_this.grid, computerColor);
              if (computerScore === 100) {
                  alert('com win');
                  _this.resetGrid();
              }
              _this.undos.push(xos);
              _this.redos.length = 0;
          });
          return _this;
      }
      XoMap.prototype.toggleColor = function () {
          var ret = this.currentColor;
          if (ret === 'black') {
              this.currentColor = 'white';
          }
          else {
              this.currentColor = 'black';
          }
          return ret;
      };
      XoMap.prototype.generateXoMap = function () {
          for (var indexY = 0; indexY < this.height; indexY++) {
              var row = [];
              this.grid.push(row);
              for (var indexX = 0; indexX < this.width; indexX++) {
                  var element = new Xo();
                  var $el = $("<div class=\"xo\"><div class=\"xo-inner\"></div></div>").appendTo(this.wrapper);
                  element.el = $el.get(0);
                  element.el.element = element;
                  row.push(element);
                  this.els.push(element.el);
              }
          }
      };
      XoMap.prototype.resetGrid = function () {
          this.els.forEach(function (el) {
              el.element.reset();
          });
          this.currentColor = 'black';
          this.undos.length = 0;
      };
      XoMap.prototype.undo = function () {
          var xos = this.undos.pop();
          if (xos) {
              var thisStepColor = xos[0].color;
              for (var i = 0; i < xos.length; i++) {
                  var element = xos[i];
                  element.reset();
              }
              this.currentColor = thisStepColor;
              this.redos.push({ xos: xos, color: thisStepColor });
              this.checkGridValue();
          }
      };
      XoMap.prototype.redo = function () {
          var redo = this.redos.pop();
          if (redo) {
              for (var i = 0; i < redo.xos.length; i++) {
                  var element = redo.xos[i];
                  element.setColor(redo.color);
                  this.currentColor = redo.color;
              }
              this.toggleColor();
              this.undos.push(redo.xos);
              this.checkGridValue();
          }
      };
      XoMap.prototype.checkGridValue = function () {
          var gridClone = cloneGrid(this.grid);
          for (var indexY = 0; indexY < this.height; indexY++) {
              var row = gridClone[indexY];
              for (var indexX = 0; indexX < this.width; indexX++) {
                  var xo = row[indexX];
                  if (!xo.color) {
                      xo.color = this.currentColor;
                      $(this.grid[indexY][indexX].el).find('.xo-inner')
                          .html('' + caculateValue(gridClone, this.currentColor) + '\n'
                          + caculateValue(gridClone, this.currentColor === 'white' ? 'black' : 'white'));
                      xo.color = undefined;
                  }
              }
          }
      };
      return XoMap;
  }(road_map_1.RoadMap));
  var rows = [
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
  ];
  function cloneGrid(map) {
      return map.slice(0)
          .map(function (row) { return row.slice(0).map(function (xo) {
          var ret = new Xo();
          ret.color = xo.color;
          return ret;
      }); });
  }
  function caculateValue(map, color) {
      var totalCount = 0;
      for (var indexRow = 0; indexRow < rows.length; indexRow++) {
          var rowPoints = rows[indexRow].map(function (pos) { return map[pos[1]][pos[0]].color; })
              .map(function (posColor) { return posColor ? posColor === color ? 1 : -1 : 0; });
          var rawPoints = rowPoints.reduce(function (pre, cur) { return pre + cur; }, 0);
          if (rowPoints.filter(function (point) { return point === 1; }).length === 3) {
              return 100;
          }
          if (rowPoints.filter(function (point) { return point < 0; }).length > 0) {
              // pass
              if (rawPoints < -1) {
                  return -100;
              }
          }
          else {
              rowPoints.forEach(function (point) {
                  if (point > 0) {
                      totalCount += 2;
                  }
                  else {
                      totalCount += 1;
                  }
              });
          }
      }
      return totalCount;
  }
  function eachGrid(grid, handle) {
      for (var indexY = 0; indexY < 3; indexY++) {
          var row = grid[indexY];
          for (var indexX = 0; indexX < 3; indexX++) {
              var xo = row[indexX];
              handle(xo, indexX, indexY);
          }
      }
  }
  // 这里的思路有点问题，应该思考为落子后对某一方的局势评价
  // 避免不必要的复杂度
  function predict2(map, color) {
      // 我在此落子之后 对方落一子，我能获得最大优势的招法
      var gridClone = cloneGrid(map);
      var steps = [];
      var reverseColor = color === 'white' ? 'black' : 'white';
      var max = -100;
      eachGrid(gridClone, function (xo, indexX, indexY) {
          if (!xo.color) {
              xo.color = color;
              var score = caculateValue(gridClone, color);
              if (score > max) {
                  max = score;
                  steps.length = 0;
                  steps.push({ pos: [indexX, indexY], score: score, color: color });
              }
              else if (score === max) {
                  steps.push({ pos: [indexX, indexY], score: score, color: color });
              }
              xo.color = undefined;
          }
      });
      var steps2ops = [];
      var min = -100;
      steps.forEach(function (step) {
          var minScore = Infinity;
          gridClone[step.pos[1]][step.pos[0]].color = step.color;
          eachGrid(gridClone, function (xo, indexX1, indexY1) {
              if (!xo.color) {
                  xo.color = reverseColor;
                  var score = caculateValue(gridClone, color);
                  if (score < minScore) {
                      minScore = score;
                  }
                  xo.color = undefined;
              }
          });
          if (minScore > min) {
              min = minScore;
              steps2ops.length = 0;
              steps2ops.push(step);
          }
          else if (minScore === min) {
              steps2ops.push(step);
          }
          gridClone[step.pos[1]][step.pos[0]].color = undefined;
      });
      if (!steps2ops.length) {
          return steps[Math.floor(Math.random() * steps.length)];
      }
      return steps2ops[Math.floor(Math.random() * steps2ops.length)];
  }
  function predict4() {
      // 两个回合之后我能获得最大优势的招法
  }
  var xoMap = new XoMap();
  xoMap.generateXoMap();
  xoMap.checkGridValue();
  $('#reset').click(function () {
      xoMap.resetGrid();
  });
  $('#undo').click(function () {
      xoMap.undo();
  });
  $('#redo').click(function () {
      xoMap.redo();
  });
  

});