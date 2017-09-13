attribute vec4 aVertexColor;
attribute highp vec3 aVertexPosition;
attribute highp vec3 aVertexNormal;
attribute highp vec2 aTextureCoord;
attribute highp vec2 aFog;

uniform highp mat4 uNormalMatrix;

uniform highp vec3 uDirectionalLightColor;
uniform highp vec3 uDirectionalVector;
uniform highp mat4 uMVMatrix;
uniform highp mat4 uPMatrix;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
varying lowp vec4 vColor;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
    
    // Apply lighting effect
    // 这部分有效避免死黑
    highp vec3 ambientLight = vec3(0.2, 0.2, 0.2);

    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
    highp float directional = max(dot(transformedNormal.xyz, uDirectionalVector), 0.0);
    vColor = vec4(aVertexColor.xyz, aFog.s);
    // 这里应该有一个更好的定义基础材质的算法
    vLighting = ambientLight + (uDirectionalLightColor * directional);
}
