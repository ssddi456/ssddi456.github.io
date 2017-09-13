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
  function createBuffer(gl) {
      var buffer = gl.createBuffer();
      if (!buffer) {
          throw new Error('create gl buffer failed');
      }
      return buffer;
  }
  exports.createBuffer = createBuffer;
  function loopFactory(updater, updateInterval) {
      var startTime = Date.now();
      var tick = 0;
      var ret = function () {
          var currentTime = Date.now();
          var delta = currentTime - startTime;
          if (updateInterval < delta) {
              startTime = currentTime;
              updater(tick);
          }
          tick += 1;
          requestAnimationFrame(ret);
      };
      return ret;
  }
  exports.loopFactory = loopFactory;
  function forEachVectorArray(array, vecterSize, hander) {
      var allLen = array.length;
      if (allLen % vecterSize !== 0) {
          throw new Error('array size ' + allLen + ' not match size ' + vecterSize);
      }
      var i = 0;
      var temp = [];
      var setVector = function (newVal) {
          for (var j = 0; j < vecterSize; j++) {
              array[j + i] = newVal[j];
          }
      };
      var getVector = function () {
          for (var j = 0; j < vecterSize; j++) {
              temp[j] = array[i + j];
          }
          return temp;
      };
      for (; i < allLen; i += vecterSize) {
          hander(getVector(), Math.floor(i / vecterSize), setVector);
      }
  }
  exports.forEachVectorArray = forEachVectorArray;
  

});