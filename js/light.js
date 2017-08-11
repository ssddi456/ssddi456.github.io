define('js/light', ['require', 'exports', 'module', "./shaders/vertex_color_shader", "./mesh"], function(require, exports, module) {

  "use strict";
  var vertex_color_shader_1 = require("./shaders/vertex_color_shader");
  var mesh_1 = require("./mesh");
  var debugMesh = new mesh_1.Mesh();
  debugMesh.shader = new vertex_color_shader_1.VertexColorShader();
  debugMesh.vertices = [
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
      -1.0, 1.0, -1.0
  ].map(function (x) {
      return x * 0.5;
  });
  debugMesh.faces = [
      0, 1, 2, 0, 2, 3,
      4, 5, 6, 4, 6, 7,
      8, 9, 10, 8, 10, 11,
      12, 13, 14, 12, 14, 15,
      16, 17, 18, 16, 18, 19,
      20, 21, 22, 20, 22, 23 // left
  ];
  debugMesh.trs = Matrix.Translation($V([0, 0, 0]));
  var Light = (function () {
      function Light() {
          this.direction = [1, 1, 1];
          this.debug = false;
      }
      Light.prototype.render = function (world, camaraMatrixFlat) {
          if (this.debug) {
              if (!this.debugMesh) {
                  this.debugMesh = debugMesh.clone();
                  this.debugMesh.trs = this.debugMesh.trs.x(Matrix.Translation($V(this.direction)));
                  this.debugMesh.verticesColor = [];
                  for (var j = 0; j < 6; j++) {
                      for (var k = 0; k < 4; k++) {
                          for (var index = 0; index < 3; index++) {
                              this.debugMesh.verticesColor.push(this.color[0]);
                          }
                          this.debugMesh.verticesColor.push(1);
                      }
                  }
                  world.attachObject(this.debugMesh);
              }
          }
      };
      return Light;
  }());
  exports.Light = Light;
  

});