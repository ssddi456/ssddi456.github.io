define('js/shaders/cube_with_texture-vs.glsl.js', ['require', 'exports', 'module'], function(require, exports, module) {

  return function (gl) {
      var source = "  attribute vec3 aVertexPosition;\r\n  attribute vec2 aTextureCoord;\r\n    \r\n  uniform mat4 uMVMatrix;\r\n  uniform mat4 uPMatrix;\r\n      \r\n  varying highp vec2 vTextureCoord;\r\n  \r\n  void main(void) {\r\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n  }";
      var type = gl.VERTEX_SHADER;
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      // Compile the shader program
      gl.compileShader(shader);
      // See if it compiled successfully
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
          console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));  
          gl.deleteShader(shader);
          return null;  
      }
      return shader;
  };
  

});