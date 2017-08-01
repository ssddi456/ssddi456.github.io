define('js/shaders/cube_with_texture-fs.glsl.js', ['require', 'exports', 'module'], function(require, exports, module) {

  return function (gl) {
      var source = "  varying highp vec2 vTextureCoord;\r\n      \r\n  uniform sampler2D uSampler;\r\n      \r\n  void main(void) {\r\n    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\r\n  }";
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