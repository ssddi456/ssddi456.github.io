define('js/index', ['require', 'exports', 'module', "./decorator", "./world", "js/shaders/test-fs.glsl.js", "js/shaders/test-vs.glsl.js"], function(require, exports, module) {

  "use strict";
  var decorator_1 = require("./decorator");
  var world_1 = require("./world");
  decorator_1.b.a = 333;
  console.log(decorator_1.b);
  console.log(decorator_1.c);
  var testFs = require("js/shaders/test-fs.glsl.js");
  var testVs = require("js/shaders/test-vs.glsl.js");
  var main = $('#main')[0];
  var size = main.getClientRects()[0];
  main.height = size.height;
  main.width = size.width;
  var world = new world_1.World(main.getContext('webgl'), size);
  var cubeTemplate = new world_1.Mesh();
  var cubeShader = new world_1.VertexColorShader();
  cubeShader.fragementShaderFactory = testFs;
  cubeShader.vertexShaderFactory = testVs;
  cubeTemplate.shader = cubeShader;
  cubeTemplate.vertices = [
      // Front face
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,
      // Back face
      -1.0, -1.0, -1.0,
      -1.0, 1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, -1.0, -1.0,
      // Top face
      -1.0, 1.0, -1.0,
      -1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, -1.0,
      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0, 1.0,
      -1.0, -1.0, 1.0,
      // Right face
      1.0, -1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, 1.0, 1.0,
      1.0, -1.0, 1.0,
      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0, 1.0, -1.0,
  ];
  cubeTemplate.verticesColor = [].concat.apply([], [
      [1.0, 1.0, 1.0, 1.0],
      [1.0, 0.0, 0.0, 1.0],
      [0.0, 1.0, 0.0, 1.0],
      [0.0, 0.0, 1.0, 1.0],
      [1.0, 1.0, 0.0, 1.0],
      [1.0, 0.0, 1.0, 1.0],
  ].reduce(function (pre, cur) {
      for (var index = 0; index < 4; index++) {
          pre.push(cur);
      }
      return pre;
  }, []));
  cubeTemplate.faces = [
      0, 1, 2, 0, 2, 3,
      4, 5, 6, 4, 6, 7,
      8, 9, 10, 8, 10, 11,
      12, 13, 14, 12, 14, 15,
      16, 17, 18, 16, 18, 19,
      20, 21, 22, 20, 22, 23,
  ];
  cubeTemplate.trs = Matrix.I(4);
  var move = Matrix.Translation($V([0, 0, -25]));
  var rotateX = Matrix.RotationX(0.25 * Math.PI).ensure4x4();
  var rotateY = Matrix.RotationY(0.25 * Math.PI).ensure4x4();
  var rotateZ = Matrix.RotationZ(0.25 * Math.PI / 60 / 4).ensure4x4();
  var cubes = [];
  for (var i = 0; i < 5; i++) {
      var cubeCopy = cubeTemplate.clone();
      cubeCopy.trs = cubeCopy.trs.x(Matrix.Translation($V([(-2 + i) * 4, 0, 0])))
          .x(move)
          .x(rotateX)
          .x(rotateY);
      cubes.push(cubeCopy);
      world.attachObject(cubeCopy);
  }
  var startTime = Date.now();
  var interval = 1000 / 60;
  function drawLoop() {
      var currentTime = Date.now();
      var delta = currentTime - startTime;
      if (interval < delta) {
          startTime = currentTime;
          cubes.forEach(function (cube) {
              cube.trs = cube.trs.x(rotateZ);
          });
          world.render();
      }
      requestAnimationFrame(drawLoop);
  }
  drawLoop();
  

});