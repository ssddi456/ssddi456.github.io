define('js/gem', ['require', 'exports', 'module', "./libs/road_map", "./libs/utils", "./libs/animate_utils"], function(require, exports, module) {

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
  var __assign = (this && this.__assign) || Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
      }
      return t;
  };
  exports.__esModule = true;
  var road_map_1 = require("./libs/road_map");
  var utils_1 = require("./libs/utils");
  var animate_utils_1 = require("./libs/animate_utils");
  var Gem = /** @class */ (function () {
      function Gem() {
          this.collapsed = false;
          this.moveDown = 0;
          this.powerVertical = 0;
          this.powerHorizontal = 0;
      }
      Gem.prototype.collapse = function () {
          var _this = this;
          setTimeout(function () {
              $(_this.el).toggleClass('gem-collapse', true);
          }, 100);
          this.collapsed = true;
      };
      Gem.prototype.showSuggest = function () {
          if (this.suggestGems) {
              for (var index = 0; index < this.suggestGems.length; index++) {
                  var element = this.suggestGems[index];
                  $(element.el).addClass('suggest');
              }
          }
      };
      Gem.prototype.top = function () {
          return parseInt($(this.el).css('top'), 10);
      };
      Gem.prototype.left = function () {
          return parseInt($(this.el).css('left'), 10);
      };
      return Gem;
  }());
  var RedGem = /** @class */ (function (_super) {
      __extends(RedGem, _super);
      function RedGem() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.color = 'red';
          return _this;
      }
      return RedGem;
  }(Gem));
  var WhiteGem = /** @class */ (function (_super) {
      __extends(WhiteGem, _super);
      function WhiteGem() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.color = 'white';
          return _this;
      }
      return WhiteGem;
  }(Gem));
  var BlueGem = /** @class */ (function (_super) {
      __extends(BlueGem, _super);
      function BlueGem() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.color = 'blue';
          return _this;
      }
      return BlueGem;
  }(Gem));
  var GreenGem = /** @class */ (function (_super) {
      __extends(GreenGem, _super);
      function GreenGem() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.color = 'green';
          return _this;
      }
      return GreenGem;
  }(Gem));
  var YellowGem = /** @class */ (function (_super) {
      __extends(YellowGem, _super);
      function YellowGem() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.color = 'yellow';
          return _this;
      }
      return YellowGem;
  }(Gem));
  var BrownGem = /** @class */ (function (_super) {
      __extends(BrownGem, _super);
      function BrownGem() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.color = 'brown';
          return _this;
      }
      return BrownGem;
  }(Gem));
  var DarkmagentaGem = /** @class */ (function (_super) {
      __extends(DarkmagentaGem, _super);
      function DarkmagentaGem() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.color = 'darkmagenta';
          return _this;
      }
      return DarkmagentaGem;
  }(Gem));
  var ScoreItem = /** @class */ (function () {
      function ScoreItem(name, data) {
          this.name = name;
          this.el = $('#' + name);
          this.data = data;
      }
      ScoreItem.prototype.update = function () {
          this.el.text(this.data + '');
      };
      return ScoreItem;
  }());
  var CollapseScoreItem = /** @class */ (function (_super) {
      __extends(CollapseScoreItem, _super);
      function CollapseScoreItem() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CollapseScoreItem.prototype.update = function () {
          this.el.text("3: " + this.data[3] + " | 4: " + this.data[4] + " | 5: " + this.data[5]);
      };
      return CollapseScoreItem;
  }(ScoreItem));
  var scores = {
      turns: new ScoreItem('turns', 0),
      time_past: new ScoreItem('time_past', 0),
      collapseCounts: new CollapseScoreItem('collapseCounts', {
          3: 0,
          4: 0,
          5: 0
      }),
      whiteGemCounts: new CollapseScoreItem('WhiteGemCounts', {
          3: 0,
          4: 0,
          5: 0
      }),
      redGemCounts: new CollapseScoreItem('RedGemCounts', {
          3: 0,
          4: 0,
          5: 0
      }),
      blueGemCounts: new CollapseScoreItem('BlueGemCounts', {
          3: 0,
          4: 0,
          5: 0
      }),
      greenGemCounts: new CollapseScoreItem('GreenGemCounts', {
          3: 0,
          4: 0,
          5: 0
      }),
      yellowGemCounts: new CollapseScoreItem('YellowGemCounts', {
          3: 0,
          4: 0,
          5: 0
      }),
      brownGemCounts: new CollapseScoreItem('BrownGemCounts', {
          3: 0,
          4: 0,
          5: 0
      }),
      darkmagentaGemCounts: new CollapseScoreItem('DarkmagentaGemCounts', {
          3: 0,
          4: 0,
          5: 0
      })
  };
  function updateGemScore() {
      for (var k in scores) {
          scores[k].update();
      }
  }
  var GemMap = /** @class */ (function (_super) {
      __extends(GemMap, _super);
      function GemMap(w, h) {
          var _this = _super.call(this, w, h) || this;
          _this.wrapper = $('#main');
          _this.padding = 10;
          _this.emptyGem = new Gem();
          _this.gemTypes = [
              WhiteGem,
              RedGem,
              BlueGem,
              GreenGem,
              YellowGem,
              BrownGem,
              DarkmagentaGem,
          ];
          _this.wrapper.on('mousedown', '.gem', function (dragStartEvent) {
              dragStartEvent.preventDefault();
              var draggedGem = $(dragStartEvent.currentTarget);
              var startTop = dragStartEvent.clientY;
              var startLeft = dragStartEvent.clientX;
              draggedGem.hide();
              var fakeGem = $(draggedGem.get(0).outerHTML).addClass('fake-gem').addClass('no-transition');
              fakeGem.show();
              _this.wrapper.append(fakeGem);
              var draggedGemData = __assign({}, draggedGem.data());
              var mousemove = function (e) {
                  var deltaTop = e.clientY - startTop;
                  var deltaLeft = e.clientX - startLeft;
                  fakeGem.css('transform', "translate(" + deltaLeft + "px, " + deltaTop + "px)");
              };
              var clearup = function (e) {
                  var deltaTop = e.clientY - startTop;
                  var deltaLeft = e.clientX - startLeft;
                  _this.wrapper.off('mousemove.gem_drag', mousemove);
                  _this.wrapper.off('mouseup.gem_drag', clearup);
                  _this.wrapper.off('mouseup.gem_drag', '.gem', mouseup);
                  fakeGem.remove();
                  draggedGem.show();
                  if (!$(e.currentTarget).is('.gem')) {
                      animate_utils_1.animateMoveTo(draggedGem, null, {
                          top: deltaTop,
                          left: deltaLeft
                      });
                      return true;
                  }
                  else {
                      return false;
                  }
              };
              var mouseup = function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  if (clearup(e)) {
                      return;
                  }
                  var deltaTop = e.clientY - startTop;
                  var deltaLeft = e.clientX - startLeft;
                  var droppedGem = $(e.currentTarget);
                  var droppedGemTop = parseInt(droppedGem.css('top'), 10);
                  var droppedGemLeft = parseInt(droppedGem.css('left'), 10);
                  var droppedGemData = __assign({}, droppedGem.data());
                  if (!_this.canSwitch(draggedGemData, droppedGemData)) {
                      animate_utils_1.animateMoveTo(draggedGem, null, {
                          top: deltaTop,
                          left: deltaLeft
                      });
                      return;
                  }
                  scores.turns.data += 1;
                  if (draggedGemData.x !== droppedGemData.x) {
                      _this.moveGemInRow(draggedGemData, droppedGemData, {
                          top: deltaTop,
                          left: deltaLeft
                      });
                  }
                  else {
                      _this.moveGemInCol(draggedGemData, droppedGemData, {
                          top: deltaTop,
                          left: deltaLeft
                      });
                  }
              };
              _this.wrapper.on('mousemove.gem_drag', mousemove);
              _this.wrapper.on('mouseup.gem_drag', clearup);
              _this.wrapper.on('mouseup.gem_drag', '.gem', mouseup);
          });
          // throttle
          _this.wrapper.on('animationend', '.gem', utils_1.throttle(function (e) {
              _this.wrapper.find('.gem.suggest').removeClass('suggest');
          }));
          _this.wrapper.on('transitionend', '.gem', utils_1.throttle(function (e) {
              _this.canCollapse();
              if (_this.isFinish()) {
                  _this.finish();
              }
              else if (_this.shouldFill()) {
                  console.log('do fill');
                  _this.fill();
              }
              else if (_this.canCollapse()) {
                  console.log('do collapse');
                  _this.collapse();
              }
              else {
                  console.log('do clear');
                  _this.clearCollapse();
                  _this.suggestCanMove();
              }
          }));
          return _this;
      }
      GemMap.prototype.wrapperWidth = function () {
          return (this.wrapper.width() || 0) / 100;
      };
      GemMap.prototype.wrapperHeight = function () {
          return (this.wrapper.height() || 0) / 100;
      };
      GemMap.prototype.moveGemTo = function (startGemData, endGemData, delta) {
          var tempGem = this.grid[startGemData.y][startGemData.x];
          var wh = this.wrapperHeight();
          var ww = this.wrapperWidth();
          animate_utils_1.animateMoveTo(tempGem.el, {
              top: this.topPercent(endGemData.y) + "%",
              left: this.leftPercent(endGemData.x) + "%"
          }, {
              top: wh * this.topPercent(startGemData.y) - wh * this.topPercent(endGemData.y) + delta.top,
              left: ww * this.leftPercent(startGemData.x) - ww * this.leftPercent(endGemData.x) + delta.left
          });
          $(tempGem.el).data(endGemData);
      };
      GemMap.prototype.moveGemInRow = function (startGemData, endGemData, delta) {
          this.moveGemTo(startGemData, endGemData, delta);
          var prevGem = this.grid[startGemData.y][startGemData.x];
          var deltaX = startGemData.x - endGemData.x;
          var dir = deltaX / Math.abs(deltaX);
          var i = endGemData.x;
          for (; i !== startGemData.x; i += dir) {
              var currentGem = this.grid[startGemData.y][i];
              this.moveGemTo({ x: i, y: startGemData.y }, { x: i + dir, y: startGemData.y }, {
                  top: 0,
                  left: 0
              });
              this.grid[startGemData.y][i] = prevGem;
              prevGem = currentGem;
          }
          this.grid[startGemData.y][i] = prevGem;
      };
      GemMap.prototype.moveGemInCol = function (startGemData, endGemData, delta) {
          this.moveGemTo(startGemData, endGemData, delta);
          var prevGem = this.grid[startGemData.y][startGemData.x];
          var deltaY = startGemData.y - endGemData.y;
          var dir = deltaY / Math.abs(deltaY);
          var i = endGemData.y;
          for (; i !== startGemData.y; i += dir) {
              var currentGem = this.grid[i][startGemData.x];
              this.moveGemTo({ x: startGemData.x, y: i }, { x: startGemData.x, y: i + dir }, {
                  top: 0,
                  left: 0
              });
              this.grid[i][startGemData.x] = prevGem;
              prevGem = currentGem;
          }
          this.grid[i][startGemData.x] = prevGem;
      };
      GemMap.prototype.resetGrid = function () {
          this.grid = this.grid || [];
          for (var indexY = 0; indexY < this.height; indexY++) {
              var row = [];
              this.grid.push(row);
          }
          this.cellH = 100 / (this.width * 1.1 + 0.1);
          this.cellW = 100 / (this.width * 1.1 + 0.1);
          this.wrapper.html('');
      };
      GemMap.prototype.leftPercent = function (x) {
          return this.cellW * 0.1 + x * this.cellW * 1.1;
      };
      GemMap.prototype.topPercent = function (x) {
          return this.cellH * 0.1 + x * this.cellH * 1.1;
      };
      GemMap.prototype.generateGemMap = function () {
          this.resetGrid();
          var contents = [];
          for (var indexY = 0; indexY < this.height; indexY++) {
              var top = this.topPercent(indexY);
              for (var indexX = 0; indexX < this.width; indexX++) {
                  var left = this.leftPercent(indexX);
                  var gem = this.grid[indexY][indexX] = new (utils_1.randomItem(this.gemTypes))();
                  var gemEl = $("<div class=\"gem gem-" + gem.color + "\"\n                                    data-x=\"" + indexX + "\"\n                                    data-y=\"" + indexY + "\"\n                                    style=\"top:" + top + "%;\n                                    left:" + left + "%;\n                                    width:" + this.cellW + "%;\n                                    height:" + this.cellH + "%;\n                                    \"></div>").get(0);
                  gem.el = gemEl;
                  contents.push(gemEl);
              }
          }
          this.els = contents;
          this.wrapper.append(contents);
      };
      GemMap.prototype.canSwitch = function (fromCell, toCell) {
          var _this = this;
          // a和b交换之后如果可以collapse 就可以交换
          if (fromCell.x !== toCell.x && fromCell.y !== toCell.y) {
              return false;
          }
          if (fromCell.x === toCell.x && fromCell.y === toCell.y) {
              return false;
          }
          var startX = 0;
          var endX = this.width - 1;
          var startY = 0;
          var endY = this.height - 1;
          var showSubgrid = function () {
              for (var indexY = startY; indexY <= endY; indexY += 1) {
                  for (var indexX = startX; indexX <= endX; indexX += 1) {
                      var gem = subGrid[indexY][indexX];
                      $(gem.el).addClass('subgrid')
                          .text(JSON.stringify({
                          x: indexX,
                          y: indexY,
                          ph: gem.powerHorizontal,
                          pv: gem.powerVertical
                      }, null, 2).slice(2, -2));
                  }
              }
          };
          var setSubgrid = function (x, y, gem) {
              if (!subGrid[y]) {
                  subGrid[y] = [];
              }
              subGrid[y][x] = gem;
          };
          var clearSubgrid = function () {
              for (var indexY = startY; indexY <= endY; indexY += 1) {
                  for (var indexX = startX; indexX <= endX; indexX += 1) {
                      var gem = subGrid[indexY][indexX];
                      gem.powerHorizontal = 0;
                      gem.powerVertical = 0;
                  }
              }
          };
          // 截取目标区域
          var subGrid = [];
          for (var indexY = startY; indexY <= endY; indexY += 1) {
              for (var indexX = startX; indexX <= endX; indexX += 1) {
                  var gem = this.grid[indexY][indexX];
                  setSubgrid(indexX, indexY, gem);
              }
          }
          var gemForCheck = this.grid[fromCell.y][fromCell.x];
          gemForCheck.suggestGems = undefined;
          // 把gem放进去
          var prevGem = gemForCheck;
          if (fromCell.x !== toCell.x) {
              var deltaX = fromCell.x - toCell.x;
              var dir = deltaX / Math.abs(deltaX);
              var i = toCell.x;
              for (; i !== fromCell.x; i += dir) {
                  var currentGem = this.grid[fromCell.y][i];
                  setSubgrid(i, fromCell.y, prevGem);
                  prevGem = currentGem;
              }
          }
          else {
              var deltaY = fromCell.y - toCell.y;
              var dir = deltaY / Math.abs(deltaY);
              var i = toCell.y;
              for (; i !== fromCell.y; i += dir) {
                  var currentGem = this.grid[i][fromCell.x];
                  setSubgrid(fromCell.x, i, prevGem);
                  prevGem = currentGem;
              }
          }
          setSubgrid(fromCell.x, fromCell.y, prevGem);
          var markSubgrid = function () {
              // 标记阶段
              for (var indexY = 0; indexY < _this.height; indexY++) {
                  for (var indexX = 0; indexX < _this.width; indexX++) {
                      var gem = subGrid[indexY] && subGrid[indexY][indexX];
                      if (gem) {
                          var gemRowBelow = subGrid[indexY + 1];
                          if (gemRowBelow) {
                              var gemBelow = gemRowBelow[indexX];
                              if (gemBelow && gem.color === gemBelow.color) {
                                  gem.powerVertical += 1;
                                  gemBelow.powerVertical += 1;
                              }
                          }
                          var gemLeft = subGrid[indexY][indexX + 1];
                          if (gemLeft && gem.color === gemLeft.color) {
                              gem.powerHorizontal += 1;
                              gemLeft.powerHorizontal += 1;
                          }
                      }
                  }
              }
          };
          clearSubgrid();
          markSubgrid();
          for (var indexY = startY; indexY <= endY; indexY += 1) {
              var _loop_1 = function (indexX) {
                  var row = subGrid[indexY];
                  var gem = row && row[indexX];
                  if (gem && (gem.powerHorizontal > 1 || gem.powerVertical > 1)) {
                      var suggestGems_1 = [];
                      suggestGems_1.push(gem);
                      console.log('addGemRelative', indexY, indexX);
                      var addGemRelative = function (y, x) {
                          var rowNearBy = subGrid[y];
                          if (!rowNearBy) {
                              return false;
                          }
                          var itemNearBy = rowNearBy[x];
                          if (!itemNearBy) {
                              return false;
                          }
                          if (itemNearBy.color !== gem.color) {
                              return false;
                          }
                          suggestGems_1.push(itemNearBy);
                          console.log('addGemRelative', x, y);
                          return true;
                      };
                      if (gem.powerHorizontal > 1) {
                          for (var i = 1;; i++) {
                              if (!addGemRelative(indexY, indexX + i)) {
                                  break;
                              }
                          }
                          for (var i = -1;; i--) {
                              if (!addGemRelative(indexY, indexX + i)) {
                                  break;
                              }
                          }
                      }
                      else {
                          for (var i = 1;; i++) {
                              if (!addGemRelative(indexY + i, indexX)) {
                                  break;
                              }
                          }
                          for (var i = -1;; i--) {
                              if (!addGemRelative(indexY + i, indexX)) {
                                  break;
                              }
                          }
                      }
                      this_1.grid[fromCell.y][fromCell.x].suggestGems = suggestGems_1;
                      console.log('canSwitch', fromCell, toCell);
                      return { value: true };
                  }
              };
              var this_1 = this;
              for (var indexX = startX; indexX <= endX; indexX += 1) {
                  var state_1 = _loop_1(indexX);
                  if (typeof state_1 === "object")
                      return state_1.value;
              }
          }
          return false;
      };
      // 这里有点不对
      // 在交换的时候计算 power 不用每次都计算
      GemMap.prototype.canCollapse = function () {
          this.clearCollapse();
          // 标记阶段
          for (var indexY = 0; indexY < this.height; indexY++) {
              for (var indexX = 0; indexX < this.width; indexX++) {
                  var gem = this.grid[indexY][indexX];
                  var gemRowBelow = this.grid[indexY + 1];
                  if (gemRowBelow) {
                      var gemBelow = this.grid[indexY + 1][indexX];
                      if (gemBelow && gem.color === gemBelow.color) {
                          gem.powerVertical += 1;
                          gemBelow.powerVertical += 1;
                      }
                  }
                  var gemLeft = this.grid[indexY][indexX + 1];
                  if (gemLeft && gem.color === gemLeft.color) {
                      gem.powerHorizontal += 1;
                      gemLeft.powerHorizontal += 1;
                  }
              }
          }
          for (var indexY = 0; indexY < this.height; indexY++) {
              for (var indexX = 0; indexX < this.width; indexX++) {
                  var gem = this.grid[indexY][indexX];
                  if (gem.powerHorizontal > 1 || gem.powerVertical > 1) {
                      return true;
                  }
              }
          }
          return false;
      };
      GemMap.prototype.showStatus = function () {
          for (var indexY = 0; indexY < this.height; indexY++) {
              for (var indexX = 0; indexX < this.width; indexX++) {
                  var gem = this.grid[indexY][indexX];
                  $(gem.el).text(JSON.stringify({
                      h: gem.powerHorizontal,
                      v: gem.powerVertical,
                      x: indexX,
                      y: indexY
                  }, null, 2).slice(2, -2));
              }
          }
      };
      GemMap.prototype.collapse = function () {
          var collapseGroups = {};
          var collapseGroupId = 1;
          function createCollapseGroup() {
              var gems = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  gems[_i] = arguments[_i];
              }
              gems.forEach(function (gem) { return gem.collapse(); });
              var currentCollapseIds = gems.map(function (gem) { return gem.collapseGroupId; })
                  .filter(Boolean)
                  .sort(function (a, b) { return a - b; })
                  .reduce(function (prev, cur) {
                  if (!prev.length) {
                      prev.push(cur);
                  }
                  else {
                      if (cur !== prev[prev.length - 1]) {
                          prev.push(cur);
                      }
                  }
                  return prev;
              }, []);
              if (currentCollapseIds.length === 0) {
                  gems.forEach(function (gem) { return gem.collapseGroupId = collapseGroupId; });
                  collapseGroups[collapseGroupId] = gems;
                  console.log('create collapseGroups', collapseGroupId);
                  collapseGroupId++;
              }
              else if (currentCollapseIds.length > 0) {
                  // 这里需要合并多个已经创建的collapse group
                  var currentCollapseId_1 = currentCollapseIds[0];
                  gems.forEach(function (gem) {
                      if (gem.collapseGroupId === undefined) {
                          gem.collapseGroupId = currentCollapseId_1;
                          collapseGroups[currentCollapseId_1].push(gem);
                      }
                  });
                  currentCollapseIds.forEach(function (id, idx) {
                      if (idx) {
                          console.log('merge collapse group', id, 'to', currentCollapseId_1);
                          var groupNeedToMerge = collapseGroups[id];
                          delete collapseGroups[id];
                          groupNeedToMerge.forEach(function (gem) {
                              gem.collapseGroupId = currentCollapseId_1;
                              collapseGroups[currentCollapseId_1].push(gem);
                          });
                      }
                  });
              }
          }
          for (var indexY = 0; indexY < this.height; indexY++) {
              for (var indexX = 0; indexX < this.width; indexX++) {
                  var gemRow = this.grid[indexY];
                  var gem = gemRow[indexX];
                  if (gem.powerHorizontal > 1) {
                      var gemLeft = gemRow[indexX - 1];
                      var gemRight = gemRow[indexX + 1];
                      createCollapseGroup(gem, gemLeft, gemRight);
                  }
                  if (gem.powerVertical > 1) {
                      var gemAbove = this.grid[indexY - 1][indexX];
                      var gemBelow = this.grid[indexY + 1][indexX];
                      createCollapseGroup(gem, gemAbove, gemBelow);
                  }
              }
          }
          var finalGroupIds = Object.keys(collapseGroups);
          console.log(finalGroupIds);
          finalGroupIds.forEach(function (groupid) {
              var collapseGroup = collapseGroups[Number(groupid)];
              collapseGroup.forEach(function (gem) { return console.log(gem.color); });
              scores[collapseGroup[0].color + 'GemCounts'].data[collapseGroup.length] += 1;
              scores.collapseCounts.data[collapseGroup.length] += 1;
          });
      };
      GemMap.prototype.clearCollapse = function () {
          for (var indexY = 0; indexY < this.height; indexY++) {
              for (var indexX = 0; indexX < this.width; indexX++) {
                  var gem = this.grid[indexY][indexX];
                  gem.powerHorizontal = 0;
                  gem.powerVertical = 0;
                  $(gem.el).data({
                      x: indexX,
                      y: indexY
                  });
                  if (gem.collapsed) {
                      this.removeGem(gem);
                      console.log('remove a gem', this.els.length);
                  }
              }
          }
      };
      GemMap.prototype.shouldFill = function () {
          if (this.els.length < this.width * this.height) {
              return true;
          }
          return false;
      };
      GemMap.prototype.fill = function () {
          // 按纵列遍历，计算新增的元素和移动的元素
          for (var indexX = 0; indexX < this.width; indexX++) {
              var needAddGems = 0;
              for (var indexY = this.height - 1; indexY >= 0; indexY--) {
                  var gem = this.grid[indexY][indexX];
                  if (gem.collapsed) {
                      needAddGems += 1;
                  }
                  else {
                      gem.moveDown = needAddGems;
                  }
              }
              var wrapperHeight = 0 - (this.wrapper.height() || 0) / 100;
              for (var indexY = this.height - 1; indexY >= 0; indexY--) {
                  var gem = this.grid[indexY][indexX];
                  if (gem.moveDown) {
                      console.log('move', indexX, indexY, 'to', indexX, indexY + gem.moveDown);
                      var moveToGem = this.grid[indexY + gem.moveDown][indexX];
                      animate_utils_1.animateMoveTo(gem.el, {
                          top: this.topPercent(indexY + gem.moveDown) + "%"
                      }, {
                          top: this.topPercent(gem.moveDown) * wrapperHeight,
                          left: 0
                      });
                      this.grid[indexY + gem.moveDown][indexX] = gem;
                      gem.moveDown = 0;
                  }
              }
              for (var i = 0; i < needAddGems; i++) {
                  // 这里新增加gem到队列中
                  console.log('add gem at', indexX, i);
                  var newGem = this.addGem(indexX, i);
                  console.log(this.els.length);
                  animate_utils_1.animateMoveTo(newGem.el, null, {
                      top: this.topPercent(needAddGems) * wrapperHeight,
                      left: 0
                  });
              }
          }
      };
      GemMap.prototype.addGem = function (x, y) {
          var top = this.topPercent(y);
          var left = this.leftPercent(x);
          var gem = this.grid[y][x] = new (utils_1.randomItem(this.gemTypes))();
          var gemEl = $("<div class=\"gem gem-" + gem.color + "\"\n                                    data-x=\"" + x + "\"\n                                    data-y=\"" + y + "\"\n                                    style=\"top:" + top + "%;\n                                    left:" + left + "%;\n                                    width:" + this.cellW + "%;\n                                    height:" + this.cellH + "%;\n                                    \"></div>").get(0);
          gem.el = gemEl;
          this.els.push(gemEl);
          this.wrapper.append(gemEl);
          return gem;
      };
      GemMap.prototype.removeGem = function (gem) {
          this.els.splice(this.els.indexOf(gem.el), 1);
          $(gem.el).remove();
      };
      GemMap.prototype.isFinish = function () {
          return false;
      };
      GemMap.prototype.finish = function () {
          console.log('============finish========');
      };
      GemMap.prototype.suggestCanMove = function () {
          for (var indexY = 0; indexY < this.height; indexY++) {
              for (var indexX = 0; indexX < this.width; indexX++) {
                  var gem = this.grid[indexY][indexX];
                  for (var loopX = 0; loopX < this.width; loopX++) {
                      if (loopX !== indexX) {
                          if (this.canSwitch({ x: indexX, y: indexY }, { x: loopX, y: indexY })) {
                              gem.showSuggest();
                              return;
                          }
                      }
                  }
                  for (var loopY = 0; loopY < this.width; loopY++) {
                      if (loopY !== indexY) {
                          if (this.canSwitch({ x: indexX, y: indexY }, { x: indexX, y: loopY })) {
                              gem.showSuggest();
                              return;
                          }
                      }
                  }
              }
          }
      };
      return GemMap;
  }(road_map_1.RoadMap));
  var gemMap = new GemMap(7, 7);
  gemMap.generateGemMap();
  if (gemMap.canCollapse()) {
      gemMap.collapse();
  }
  ;
  $('#suggestion').click(function () {
      gemMap.suggestCanMove();
  });
  var start = Date.now();
  var updateInterval = function () {
      setTimeout(function () {
          scores.time_past.data = Math.floor((Date.now() - start) / 1000);
          updateGemScore();
          updateInterval();
      }, 300);
  };
  updateInterval();
  

});