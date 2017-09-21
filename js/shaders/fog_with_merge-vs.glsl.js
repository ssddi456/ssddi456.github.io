define('js/shaders/fog_with_merge-vs.glsl.js', ['require', 'exports', 'module'], function(require, exports, module) {

  return function (gl) {
      var source = "attribute highp vec3 aVertexPosition;\r\nattribute highp vec2 aTextureCoord;\r\n\r\nvarying highp vec2 vTextureCoord;\r\n\r\nvoid main(void) {\r\n    gl_Position = vec4(aVertexPosition, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}\r\n";
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