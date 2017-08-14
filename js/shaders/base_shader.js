define('js/shaders/base_shader', ['require', 'exports', 'module'], function(require, exports, module) {

  "use strict";
  var Shader = (function () {
      function Shader() {
          this.inited = false;
          this.mounted = false;
      }
      Shader.prototype.clone = function () {
          var newInstance = new this.constructor();
          newInstance.vertexShaderFactory = this.vertexShaderFactory;
          newInstance.fragementShaderFactory = this.fragementShaderFactory;
          return newInstance;
      };
      Shader.prototype.init = function (gl) {
          if (this.inited) {
              return false;
          }
          this.inited = true;
          var shaderProgram = this.shaderProgram = gl.createProgram();
          var vertexShader = this.vertexShaderFactory(gl);
          var fragementShader = this.fragementShaderFactory(gl);
          gl.attachShader(shaderProgram, vertexShader);
          gl.attachShader(shaderProgram, fragementShader);
          gl.linkProgram(shaderProgram);
          if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
              alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
          }
      };
      return Shader;
  }());
  exports.Shader = Shader;
  

});