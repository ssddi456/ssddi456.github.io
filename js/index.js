define('js/index', ['require', 'exports', 'module', "./libs/3dRoad", "./world", "./shaders/vertex_color_shader", "./shaders/cube_with_texture_and_lighting_shader", "./light", "./mesh", "./line", "./libs/roadMap"], function(require, exports, module) {

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
  var _3dRoad_1 = require("./libs/3dRoad");
  var world_1 = require("./world");
  var vertex_color_shader_1 = require("./shaders/vertex_color_shader");
  var cube_with_texture_and_lighting_shader_1 = require("./shaders/cube_with_texture_and_lighting_shader");
  var light_1 = require("./light");
  var mesh_1 = require("./mesh");
  var line_1 = require("./line");
  var roadMap_1 = require("./libs/roadMap");
  var main = $('#main')[0];
  var size = main.getClientRects()[0];
  main.height = size.height;
  main.width = size.width;
  var world = new world_1.World(main.getContext('webgl'), size);
  var testLight = new light_1.Light();
  testLight.direction = [1, 2, 1];
  testLight.color = [1, 1, 1];
  testLight.debug = false;
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
  var cubeTemplate2 = cubeTemplate.clone();
  cubeTemplate2.vertexColors = undefined;
  cubeTemplate2.textureCoordinates = [
      // Front
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      // Back
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      // Top
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      // Bottom
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      // Right
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      // Left
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
  ];
  cubeTemplate2.textureSrc = '/images/checkerBroad.jpg';
  cubeTemplate2.shader = new cube_with_texture_and_lighting_shader_1.CubeWithTextureAndLightingShader();
  var roadMap = new roadMap_1.RoadMap(20, 20);
  roadMap.generateRandonRoad();
  // const roadMap = new RoadMap(3, 3);
  // roadMap.setWalkThrough(1, 1);
  var mesh3dRoad = new _3dRoad_1.Mesh3dRoad(roadMap);
  var meshData3dRoad = mesh3dRoad.getMesh();
  var objMesh3dRoad = cubeTemplate2.clone();
  // objMesh3dRoad.debug = true;
  objMesh3dRoad.visible = true;
  objMesh3dRoad.vertices = meshData3dRoad.vertexs;
  objMesh3dRoad.faces = meshData3dRoad.faces;
  if (meshData3dRoad.vertexColors.length) {
      objMesh3dRoad.vertexColors = meshData3dRoad.vertexColors;
  }
  if (meshData3dRoad.vertexNormal.length) {
      objMesh3dRoad.vertexNormal = meshData3dRoad.vertexNormal;
  }
  if (meshData3dRoad.textureCoordinates.length) {
      objMesh3dRoad.textureCoordinates = meshData3dRoad.textureCoordinates;
  }
  var move = Matrix.Translation($V([0, 0, -25]));
  var rotateX = Matrix.RotationX(0.25 * Math.PI).ensure4x4();
  var rotateY = Matrix.RotationY(0.25 * Math.PI).ensure4x4();
  var rotateZ = Matrix.RotationY(0.25 * Math.PI / 60 / 4).ensure4x4();
  var cubes = [];
  var linex = line_1.Line.createSimpleLine([0, 0, 0], [10, 0, 0], Matrix.I(4));
  linex.verticesColor = [
      1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 0.0, 1.0,
  ];
  var liney = line_1.Line.createSimpleLine([0, 0, 0], [0, 10, 0], Matrix.I(4));
  liney.verticesColor = [
      0.0, 1.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
  ];
  var linez = line_1.Line.createSimpleLine([0, 0, 0], [0, 0, 10], Matrix.I(4));
  linez.verticesColor = [
      0.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
  ];
  function loadShapes() {
      return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
              switch (_a.label) {
                  case 0:
                      world.attachLight(testLight);
                      // for (let i = 0; i < 5; i++) {
                      //     const cubeCopy = (i % 2 ? cubeTemplate : cubeTemplate2).clone();
                      //     cubeCopy.x(Matrix.Translation($V([(-2 + i) * 4, 0, 0]))).x(move);
                      //     cubes.push(cubeCopy);
                      //     await world.attachObject(cubeCopy);
                      // }
                      return [4 /*yield*/, world.attachObject(linex)];
                  case 1:
                      // for (let i = 0; i < 5; i++) {
                      //     const cubeCopy = (i % 2 ? cubeTemplate : cubeTemplate2).clone();
                      //     cubeCopy.x(Matrix.Translation($V([(-2 + i) * 4, 0, 0]))).x(move);
                      //     cubes.push(cubeCopy);
                      //     await world.attachObject(cubeCopy);
                      // }
                      _a.sent();
                      return [4 /*yield*/, world.attachObject(liney)];
                  case 2:
                      _a.sent();
                      return [4 /*yield*/, world.attachObject(linez)];
                  case 3:
                      _a.sent();
                      return [4 /*yield*/, world.attachObject(objMesh3dRoad)];
                  case 4:
                      _a.sent();
                      return [2 /*return*/];
              }
          });
      });
  }
  var startTime = 0;
  var interval = 1000 / 60;
  function drawLoop() {
      var currentTime = Date.now();
      var delta = currentTime - startTime;
      if (interval < delta) {
          startTime = currentTime;
          cubes.forEach(function (cube) {
              cube.x(rotateZ);
          });
          world.render();
      }
      requestAnimationFrame(drawLoop);
  }
  loadShapes().then(function () {
      requestAnimationFrame(drawLoop);
  });
  document.body.addEventListener('keydown', function (e) {
      switch (String.fromCharCode(e.keyCode)) {
          case 'A':
              world.camara.eye[0] -= 1;
              break;
          case 'D':
              world.camara.eye[0] += 1;
              break;
          case 'S':
              world.camara.eye[2] += 1;
              break;
          case 'W':
              world.camara.eye[2] -= 1;
              break;
          default: break;
      }
  }, true);
  

});