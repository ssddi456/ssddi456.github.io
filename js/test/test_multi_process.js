define('js/test/test_multi_process', ['require', 'exports', 'module', "../libs/plane", "../world", "../light", "../mesh", "../libs/utils", "../libs/level_control", "../shaders/cube_with_fog", "../shaders/fog_with_merge"], function(require, exports, module) {

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
  var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator = (this && this.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
  exports.__esModule = true;
  var plane_1 = require("../libs/plane");
  var world_1 = require("../world");
  var light_1 = require("../light");
  var mesh_1 = require("../mesh");
  var utils_1 = require("../libs/utils");
  var level_control_1 = require("../libs/level_control");
  var cube_with_fog_1 = require("../shaders/cube_with_fog");
  var fog_with_merge_1 = require("../shaders/fog_with_merge");
  var main = $('#main')[0];
  var elBBox = main.getClientRects()[0];
  var size = { width: elBBox.width, height: elBBox.width * 0.75 };
  $('#main').css({
      width: size.width,
      height: size.height
  });
  main.width = size.width;
  main.height = size.height;
  var context = main.getContext('webgl');
  if (!context) {
      throw new Error('create webgl context failed');
  }
  var world = new world_1.World(context, size);
  var mainCamara = new world_1.Camara();
  world.camara = mainCamara;
  mainCamara.height = size.height;
  mainCamara.width = size.width;
  mainCamara.eye = [size.width / 2 - 40, 660, size.height / 2 - 30];
  mainCamara.center = [size.width / 2 - 40, 0, size.height / 2 - 30];
  mainCamara.up = [0, 0, -1];
  var skyLight = new light_1.Light();
  skyLight.direction = [1, 2, 1];
  skyLight.color = [0.5, 0.5, 0.5];
  var clampFloor = new level_control_1.MeshWithFog();
  clampFloor.shader = new cube_with_fog_1.CubeWithFogShader();
  clampFloor.textureSrc = '/images/checker_with_number.jpg';
  var clampFloorPlane = new plane_1.Plane();
  clampFloorPlane.width = size.width * 0.9;
  clampFloorPlane.height = size.height * 0.9;
  clampFloor.updateMeshInfo(clampFloorPlane.getMesh());
  var grayFrameTexture = utils_1.createTexture(world.gl, size.width, size.height);
  var grayFrameBuffer = utils_1.createFrameBuffer(world.gl, grayFrameTexture);
  var colorFrameTexture = utils_1.createTexture(world.gl, size.width, size.height);
  var colorFrameBuffer = utils_1.createFrameBuffer(world.gl, colorFrameTexture);
  var mergeCanvas = new (/** @class */ (function (_super) {
      __extends(class_1, _super);
      function class_1() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.textureGray = grayFrameTexture;
          _this.textureColor = colorFrameTexture;
          _this.resolution = new Float32Array([size.width, size.height]);
          _this.center = new Float32Array([size.width / 2, size.height / 2]);
          _this.sight = 200 * 200;
          return _this;
      }
      class_1.prototype.bindBufferAndDraw = function (shader, gl) {
          shader.bindBuffer('uSamplerGray', 0);
          shader.bindBuffer('uSamplerColor', 1);
          shader.bindBuffer('uCenter', this.center);
          shader.bindBuffer('uResolution', this.resolution);
          shader.bindBuffer('uSightRange', this.sight);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, this.textureGray);
          shader.bindBuffer('uSamplerGray', 0);
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, this.textureColor);
          shader.bindBuffer('uSamplerColor', 1);
          _super.prototype.bindBufferAndDraw.call(this, shader, gl);
      };
      return class_1;
  }(mesh_1.Mesh)))();
  mergeCanvas.updateMeshInfo(plane_1.ClipSpacePlane.getMesh());
  mergeCanvas.shader = new fog_with_merge_1.FogWithMergeShader();
  mergeCanvas.shader.render = function (renderWorld, mesh) {
      mesh.bindBufferAndDraw(this, renderWorld.gl);
  };
  function loadTextures() {
      return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
              switch (_a.label) {
                  case 0: return [4 /*yield*/, clampFloor.loadTexture(world.gl)];
                  case 1:
                      _a.sent();
                      return [2 /*return*/];
              }
          });
      });
  }
  var updateLoop = utils_1.loopFactory(function (tick) {
      // clampFloor.rebuffering(world.gl, world);
  }, 1000 / 6);
  var greyScene = world.createScene();
  greyScene.camara = mainCamara;
  greyScene.attachLight(skyLight);
  greyScene.attachObject(clampFloor);
  greyScene.frameBuffer = grayFrameBuffer;
  greyScene.beforeRender = function () {
      clampFloor.fog.forEach(function (x, i, fog) { return fog[i] = 0.5; });
      clampFloor.rebuffering(this.gl, world);
  };
  var colorScene = greyScene.clone();
  colorScene.frameBuffer = colorFrameBuffer;
  colorScene.beforeRender = function () {
      clampFloor.fog.forEach(function (x, i, fog) { return fog[i] = 1; });
      clampFloor.rebuffering(this.gl, world);
  };
  var compositScene = world.createScene();
  compositScene.attachObject(mergeCanvas);
  function draw() {
      var gl = world.gl;
      greyScene.render();
      colorScene.render();
      compositScene.render();
  }
  var drawLoop = utils_1.loopFactory(draw, 1000 / 60);
  loadTextures().then(function () {
      draw();
  });
  

});