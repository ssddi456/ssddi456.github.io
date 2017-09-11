define('js/libs/utils', ['require', 'exports', 'module'], function(require, exports, module) {

  "use strict";
  exports.__esModule = true;
  function wrapIterableIterator(process) {
      var iterable;
      return function () {
          if (!iterable) {
              iterable = process();
          }
          var item = iterable.next();
          if (item.done) {
              iterable = undefined;
          }
          return item.value;
      };
  }
  exports.wrapIterableIterator = wrapIterableIterator;
  

});