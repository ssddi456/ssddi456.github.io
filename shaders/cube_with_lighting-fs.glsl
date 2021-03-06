varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;
varying lowp vec4 vColor;

void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    gl_FragColor = vec4(vLighting * texelColor.xyz * vColor.a + vColor.xyz * (1.0 - vColor.a),  texelColor.a);
}
