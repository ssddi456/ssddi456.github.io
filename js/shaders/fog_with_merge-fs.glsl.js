define('js/shaders/fog_with_merge-fs.glsl.js', ['require', 'exports', 'module'], function(require, exports, module) {

  return function (gl) {
      var source = "varying highp vec2 vTextureCoord;\r\nvarying highp vec3 vLighting;\r\n\r\nuniform sampler2D uSamplerGray;\r\nuniform sampler2D uSamplerColor;\r\n\r\nuniform highp vec2 uCenter;\r\nuniform highp vec2 uResolution;\r\nuniform highp float uSightRange;\r\n\r\nvoid main(void) {\r\n    highp vec2 vPos = vec2(vTextureCoord.x * uResolution.x, vTextureCoord.y * uResolution.y);\r\n    highp float deltaY = uCenter.x - vPos.x;\r\n    highp float deltaX = uCenter.y - vPos.y;\r\n\r\n    if (deltaX * deltaX + deltaY * deltaY < uSightRange){\r\n        gl_FragColor = texture2D(uSamplerColor, vTextureCoord);\r\n    } else {\r\n        gl_FragColor = texture2D(uSamplerGray, vTextureCoord);\r\n    }\r\n}\r\n";
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