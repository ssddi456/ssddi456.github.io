define('js/test/test', ['require', 'exports', 'module', "../libs/plane", "../world", "../light", "../mesh", "../shaders/animate_shader", "../libs/utils"], function(require, exports, module) {

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
  var animate_shader_1 = require("../shaders/animate_shader");
  var utils_1 = require("../libs/utils");
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
  mainCamara.height = size.height;
  mainCamara.width = size.width;
  world.camara = mainCamara;
  mainCamara.eye = [11.5, 26, 9.5];
  mainCamara.center = [11.5, 0, 9.5];
  mainCamara.up = [0, 0, -1];
  var skyLight = new light_1.Light();
  skyLight.direction = [1, 2, 1];
  skyLight.color = [0.5, 0.5, 0.5];
  skyLight.debug = false;
  var clampFloor = new mesh_1.Mesh();
  clampFloor.debug = true;
  clampFloor.shader = new animate_shader_1.AnimateShaderShader();
  var clampFloorPlane = new plane_1.Plane();
  clampFloorPlane.width = 23;
  clampFloorPlane.height = 19;
  clampFloor.updateMeshInfo(clampFloorPlane.getMesh());
  clampFloor.x(Matrix.Translation($V([0, -0.1, 0])));
  var multiplier = [-1, 1, -1, 1];
  function loadShapes() {
      return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
              world.attachLight(skyLight);
              [
                  clampFloor,
              ].map(function (x) { return world.attachObject(x); });
              return [2 /*return*/];
          });
      });
  }
  var updateLoop = utils_1.loopFactory(function (tick) {
      // clampFloor.rebuffering(world.gl, world);
  }, 1000 / 6);
  var drawLoop = utils_1.loopFactory(function () {
      world.render();
  }, 1000 / 60);
  loadShapes().then(function () {
      updateLoop();
      drawLoop();
  });
  

});