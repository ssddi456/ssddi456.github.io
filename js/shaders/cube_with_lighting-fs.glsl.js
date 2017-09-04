define('js/shaders/cube_with_lighting-fs.glsl.js', ['require', 'exports', 'module'], function(require, exports, module) {

  return function (gl) {
      var source = "varying highp vec2 vTextureCoord;\r\nvarying highp vec3 vLighting;\r\n\r\nuniform sampler2D uSampler;\r\nvarying lowp vec4 vColor;\r\n\r\nvoid main(void) {\r\n    highp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\r\n    gl_FragColor = vec4(vLighting * texelColor.xyz * vColor.a + vColor.xyz * (1.0 - vColor.a),  texelColor.a);\r\n}\r\n";
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