define('js/libs/animate_utils', ['require', 'exports', 'module'], function(require, exports, module) {

  "use strict";
  var __assign = (this && this.__assign) || Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
      }
      return t;
  };
  exports.__esModule = true;
  function animateMoveTo(el, pos, relative) {
      var $el = $(el);
      $el
          .addClass('no-transition')
          .css(__assign({}, pos, { transform: "translate(" + relative.left + "px," + relative.top + "px)" }))
          .attr({
          moveFrom: "(" + relative.left + "px," + relative.top + "px)"
      });
      setTimeout(function () {
          $el
              .removeClass('no-transition')
              .css({
              transform: ''
          });
      }, 100);
  }
  exports.animateMoveTo = animateMoveTo;
  

});