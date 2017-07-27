define('js/shaders/test-vs.glsl.js', ['require', 'exports', 'module'], function(require, exports, module) {

  return function (gl) {
      var source = "attribute vec3 aVertexPosition;\r\nattribute vec4 aVertexColor;\r\n\r\nuniform mat4 uMVMatrix;\r\nuniform mat4 uPMatrix;\r\n\r\nvarying lowp vec4 vColor;\r\n\r\nvoid main(void) {\r\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\r\n    vColor = aVertexColor;\r\n}\r\n";
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