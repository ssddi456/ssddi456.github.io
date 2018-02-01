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
              var playerScore = caculateValue(_this.grid, playerColor, _this.currentColor);
              console.log('playerScore', playerScore);
              if (playerScore === 100) {
                  setTimeout(function () {
                      alert('you win');
                      _this.resetGrid();
                  }, 100);
                  return;
              }
              // 响应
              var computerColor = _this.currentColor;
              var dos = predict2(_this.grid, computerColor);
              if (dos) {
                  var echo = dos;
                  console.log(echo);
                  echo.setColor(_this.toggleColor());
                  xos.push(echo);
              }
              // 这里判定一下是否胜利
              var computerScore = caculateValue(_this.grid, computerColor, _this.currentColor);
              console.log('computerScore', computerScore);
              if (computerScore === 100) {
                  setTimeout(function () {
                      alert('com win');
                      _this.resetGrid();
                  }, 100);
                  return;
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
                  element.x = indexX;
                  element.y = indexY;
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
          ret.el = xo.el;
          ret.x = xo.x;
          ret.y = xo.y;
          return ret;
      }); });
  }
  function caculateValue(map, color, nextPlayerColor) {
      var rowInfo = rows.map(function (row) {
          var rowPoints = row.map(function (pos) { return map[pos[1]][pos[0]].color; })
              .map(function (posColor) { return posColor ? posColor === color ? 1 : -1 : 0; });
          var rawPoints = 0;
          if (!rowPoints.filter(function (x) { return x === -1; }).length) {
              rawPoints = rowPoints.reduce(function (pre, cur) { return pre + cur; }, 0);
          }
          if (!rowPoints.filter(function (x) { return x === 1; }).length) {
              rawPoints = rowPoints.reduce(function (pre, cur) { return pre + cur; }, 0);
          }
          return {
              rowPoints: rowPoints,
              rawPoints: rawPoints
          };
      });
      // 
      // 所以这里应该有一个正常的估值算法
      // 参考五子棋，应该以获胜手段给不同的估分，以最高分结算
      // 同时需要考虑先后手
      // 
      if (rowInfo.filter(function (x) { return x.rawPoints === 3; }).length) {
          // 胜利
          return 100;
      }
      if (rowInfo.filter(function (x) { return x.rawPoints === -3; }).length) {
          // 失败
          return -200;
      }
      if (nextPlayerColor == color) {
          if (rowInfo.filter(function (x) { return x.rawPoints === 2; }).length) {
              // 胜利
              return 100;
          }
      }
      if (rowInfo.filter(function (x) { return x.rawPoints === -2; }).length > 1) {
          return -100;
      }
      if (nextPlayerColor !== color) {
          if (rowInfo.filter(function (x) { return x.rawPoints === -2; }).length) {
              return -100;
          }
      }
      // 争夺中
      return rowInfo.reduce(function (pre, info) { return pre + info.rawPoints; }, 0);
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
      /**
       * 我在此落子之后 对方落一子，我能获得最大优势的招法
       * 这里应该是深度优先搜索而不是广度优先搜索
       * 图新较小所以可以忽略第一步的估值
       */
      var steps = [];
      var reverseColor = color === 'white' ? 'black' : 'white';
      var min = -200;
      var emptyGrids = [];
      eachGrid(map, function (xo) {
          if (!xo.color) {
              console.log(xo.color, xo);
              emptyGrids.push(xo);
          }
      });
      function addToSteps(xo) {
          if (steps.indexOf(xo) == -1) {
              return steps.push(xo);
          }
      }
      var actInterator = function (depth) {
          if (depth === void 0) { depth = 2; }
          /**
           * 实际上是求 C emptyGrids, depth 这样一个全排列
           * 简单的办法是生成递增进位树？
           * 由于太过智障我还是先写个2
           */
          var max = -200;
          for (var i = 0; i < emptyGrids.length; i++) {
              var item = emptyGrids[i];
              var restGrids = [];
              item.color = color;
              var score1 = caculateValue(map, color, reverseColor);
              for (var k = 0; k < emptyGrids.length; k++) {
                  if (k !== i) {
                      restGrids.push(emptyGrids[k]);
                  }
              }
              var min_1 = Infinity;
              for (var j = 0; j < restGrids.length; j++) {
                  var item2 = restGrids[j];
                  item2.color = reverseColor;
                  var score2 = caculateValue(map, color, color);
                  if (score2 < min_1) {
                      min_1 = score2;
                  }
                  item2.color = undefined;
                  ;
              }
              item.color = undefined;
              if (min_1 > max) {
                  max = min_1;
                  steps.length = 0;
                  addToSteps(item);
              }
              else if (min_1 == max) {
                  addToSteps(item);
              }
          }
      };
      actInterator(2);
      return steps[Math.floor(Math.random() * steps.length)];
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
  var numberToColor = {
      0: undefined,
      1: 'black',
      2: 'white'
  };
  function caculateGrid(map, color, nextPlayerColor) {
      var grid = [];
      for (var j = 0; j < 3; j++) {
          var row = [];
          grid.push(row);
          for (var i = 0; i < 3; i++) {
              var color_1 = numberToColor[map[j * 3 + i]];
              var xo = new Xo();
              xo.x = i;
              xo.y = j;
              xo.color = color_1;
              row.push(xo);
          }
      }
      console.log(grid);
      var ret = caculateValue(grid, numberToColor[color], numberToColor[nextPlayerColor]);
      console.log(ret);
      var step = predict2(grid, numberToColor[color]);
      console.log(step);
  }
  

});