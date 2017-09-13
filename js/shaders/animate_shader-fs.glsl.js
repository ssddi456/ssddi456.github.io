define('js/shaders/animate_shader-fs.glsl.js', ['require', 'exports', 'module'], function(require, exports, module) {

  return function (gl) {
      var source = "varying lowp vec4 vColor;\r\n\r\nvoid main(void) {\r\n    gl_FragColor = vColor;\r\n}\r\n";
      var type = gl.FRAGMENT_SHADER;
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