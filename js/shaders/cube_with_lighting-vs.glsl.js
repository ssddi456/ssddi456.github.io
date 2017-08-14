define('js/shaders/cube_with_lighting-vs.glsl.js', ['require', 'exports', 'module'], function(require, exports, module) {

  return function (gl) {
      var source = "attribute highp vec3 aVertexNormal;\r\nattribute highp vec3 aVertexPosition;\r\nattribute highp vec2 aTextureCoord;\r\nuniform highp mat4 uNormalMatrix;\r\n\r\nuniform highp vec3 uDirectionalLightColor;\r\nuniform highp vec3 uDirectionalVector;\r\nuniform highp mat4 uMVMatrix;\r\nuniform highp mat4 uPMatrix;\r\n\r\nvarying highp vec2 vTextureCoord;\r\nvarying highp vec3 vLighting;\r\n\r\nvoid main(void) {\r\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n    // Apply lighting effect\r\n    // highp vec3 ambientLight = vec3(0.2, 0.2, 0.2);\r\n\r\n    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);\r\n    highp float directional = max(dot(transformedNormal.xyz, uDirectionalVector), 0.0);\r\n\r\n    // vLighting = ambientLight + (uDirectionalLightColor * directional);\r\n    vLighting = (uDirectionalLightColor * directional);\r\n    // vLighting = aVertexNormal;\r\n}\r\n";
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