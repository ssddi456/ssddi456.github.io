define('js/libs/utils', ['require', 'exports', 'module'], function(require, exports, module) {

  "use strict";
  exports.__esModule = true;
  function randomItem(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
  }
  exports.randomItem = randomItem;
  function wrapIterableIterator(process) {
      var iterable;
      return function () {
          if (iterable === undefined) {
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
  function axisCollision(x1, x2, x3, x4) {
      var points = [x1, x2, x3, x4].sort(function (a, b) { return a - b; });
      var delta = points[3] - points[0] - x2 - x1 + x4 - x3;
      return delta;
  }
  exports.axisCollision = axisCollision;
  function boxCollision(boxA, boxB) {
      var xCollision = axisCollision(boxA[1], boxA[3], boxB[1], boxB[3]);
      var yCollision = axisCollision(boxA[0], boxA[2], boxB[0], boxB[2]);
      if (xCollision < 0 && yCollision < 0) {
          return [xCollision, yCollision];
      }
      return null;
  }
  exports.boxCollision = boxCollision;
  function getBBox(postion, halfsize) {
      return [
          postion[0] - halfsize[0], postion[1] - halfsize[1],
          postion[0] + halfsize[0], postion[1] + halfsize[1],
      ];
  }
  exports.getBBox = getBBox;
  function createTexture(gl, width, height) {
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      // Set up texture so we can render any size image and so we are
      // working with pixels.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      return texture;
  }
  exports.createTexture = createTexture;
  function createFrameBuffer(gl, texture) {
      var fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      // Attach a texture to it.
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      return fbo;
  }
  exports.createFrameBuffer = createFrameBuffer;
  function createFrameBufferWithDepth(gl, texture, size) {
      var depthRenderbuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderbuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size.width, size.height);
      var framebuffer = createFrameBuffer(gl, texture);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderbuffer);
      return [framebuffer, depthRenderbuffer];
  }
  exports.createFrameBufferWithDepth = createFrameBufferWithDepth;
  function throttle(hander, interval) {
      if (interval === void 0) { interval = 0; }
      var timer;
      var ret = function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          clearTimeout(timer);
          timer = setTimeout(function () {
              hander.apply(void 0, args);
          }, interval);
      };
      return ret;
  }
  exports.throttle = throttle;
  

});