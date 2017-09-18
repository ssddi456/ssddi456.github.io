define('js/shaders/cube_with_fog-fs.glsl.js', ['require', 'exports', 'module'], function(require, exports, module) {

  return function (gl) {
      var source = "varying highp vec2 vTextureCoord;\r\nvarying highp vec3 vLighting;\r\n\r\nuniform sampler2D uSampler;\r\nvarying lowp vec4 vColor;\r\n\r\nvoid gray(in vec3 color, in float greyPercent, out vec3 grayed) {\r\n    lowp float grayColor = color.x * 0.299 + color.y * 0.587 + color.z * 0.114;\r\n    grayed.x = color.x + (grayColor - color.x) * greyPercent;\r\n    grayed.y = color.y + (grayColor - color.y) * greyPercent;\r\n    grayed.z = color.z + (grayColor - color.z) * greyPercent;\r\n}\r\n\r\nvoid main(void) {\r\n    highp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\r\n    lowp vec3 grayed = vec3(1.0, 1.0, 1.0);\r\n    gray(vLighting * vColor.xyz, clamp((1.0 - vColor.a) * 2.0, 0.0, 1.0), grayed);\r\n    gl_FragColor = vec4(grayed * vColor.a,  texelColor.a);\r\n}\r\n";
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