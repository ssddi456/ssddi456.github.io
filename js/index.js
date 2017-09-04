define('js/index', ['require', 'exports', 'module', "./world", "./shaders/vertex_color_shader", "./light", "./mesh", "./libs/player_control", "./libs/level_control"], function(require, exports, module) {

  "use strict";
  var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator = (this && this.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
      return { next: verb(0), "throw": verb(1), "return": verb(2) };
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [0, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  var world_1 = require("./world");
  var vertex_color_shader_1 = require("./shaders/vertex_color_shader");
  var light_1 = require("./light");
  var mesh_1 = require("./mesh");
  var player_control_1 = require("./libs/player_control");
  var level_control_1 = require("./libs/level_control");
  var main = $('#main')[0];
  var size = main.getClientRects()[0];
  main.height = size.height;
  main.width = size.width;
  var world = new world_1.World(main.getContext('webgl'), size);
  var mainCamara = new world_1.Camara();
  mainCamara.height = size.height;
  mainCamara.width = size.width;
  world.camara = mainCamara;
  var skyLight = new light_1.Light();
  skyLight.direction = [1, 2, 1];
  skyLight.color = [0.5, 0.5, 0.5];
  skyLight.debug = false;
  var cubeTemplate = new mesh_1.Mesh();
  cubeTemplate.visible = true;
  var cubeShader = new vertex_color_shader_1.VertexColorShader();
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
  cubeTemplate.vertexColors = [].concat.apply([], [
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
  cubeTemplate.vertexNormal = [
      // Front
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      // Back
      0.0, 0.0, -1.0,
      0.0, 0.0, -1.0,
      0.0, 0.0, -1.0,
      0.0, 0.0, -1.0,
      // Top
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
      // Bottom
      0.0, -1.0, 0.0,
      0.0, -1.0, 0.0,
      0.0, -1.0, 0.0,
      0.0, -1.0, 0.0,
      // Right
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      // Left
      -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0,
  ];
  cubeTemplate.trs = Matrix.I(4);
  var dummyPlayerControl = new player_control_1.Player();
  var dummyPlayer = cubeTemplate.clone();
  dummyPlayer.vertices.forEach(function (v, i) {
      if (i % 3 === 1) {
          if (v < 0) {
              dummyPlayer.vertices[i] = 0;
              return;
          }
      }
      dummyPlayer.vertices[i] *= 0.25;
  });
  var levelControler = new level_control_1.LevelControler(dummyPlayerControl);
  levelControler.levelStart();
  function loadShapes() {
      return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
              switch (_a.label) {
                  case 0:
                      world.attachLight(skyLight);
                      return [4 /*yield*/, Promise.all([
                              levelControler.mazeMesh,
                              dummyPlayer,
                          ].map(function (x) { return world.attachObject(x); }))];
                  case 1:
                      _a.sent();
                      return [2 /*return*/];
              }
          });
      });
  }
  var startTime = 0;
  var interval = 1000 / 60;
  mainCamara.eye = [12, 26, 10];
  mainCamara.center = [12, 0, 10];
  mainCamara.up = [0, 0, -1];
  var dirLeft = [1, 0];
  var dirRight = [-1, 0];
  var dirFront = [0, 1];
  var dirBack = [0, -1];
  var currentDir = [0, 0];
  var accelarateControlMap = {
      A: dirRight,
      D: dirLeft,
      S: dirFront,
      W: dirBack
  };
  dummyPlayerControl.on('enterExit', function () {
      dummyPlayer.x(Matrix.Translation($V([
          -1 * dummyPlayerControl.currentPos[0],
          0,
          -1 * dummyPlayerControl.currentPos[1]
      ])));
      levelControler.levelPass();
      levelControler.mazeMesh.rebuffering(world.gl, world);
  });
  function drawLoop() {
      var currentTime = Date.now();
      var delta = currentTime - startTime;
      if (interval < delta) {
          startTime = currentTime;
          if (levelControler.transformLevel) {
          }
          else {
              dummyPlayerControl.accelerate(currentDir);
              var deltaPos = dummyPlayerControl.move(levelControler.maze);
              dummyPlayer.x(Matrix.Translation($V([deltaPos[0], 0, deltaPos[1]])));
          }
          world.render();
      }
      requestAnimationFrame(drawLoop);
  }
  loadShapes().then(function () {
      requestAnimationFrame(drawLoop);
  });
  var keyPressedMap = {};
  document.body.addEventListener('keydown', function (e) {
      var delta;
      var key = String.fromCharCode(e.keyCode);
      if (keyPressedMap[key]) {
          return;
      }
      keyPressedMap[key] = true;
      delta = accelarateControlMap[key];
      if (!delta) {
          return;
      }
      currentDir.forEach(function (x, i) { return currentDir[i] += delta[i]; });
  }, true);
  document.body.addEventListener('keyup', function (e) {
      var delta;
      var key = String.fromCharCode(e.keyCode);
      if (!keyPressedMap[key]) {
          return;
      }
      keyPressedMap[key] = false;
      delta = accelarateControlMap[key];
      if (!delta) {
          return;
      }
      currentDir.forEach(function (x, i) { return currentDir[i] -= delta[i]; });
  }, true);
  

});