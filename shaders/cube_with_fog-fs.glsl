varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;
varying lowp vec4 vColor;

void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    gl_FragColor = vec4(vLighting * vColor.xyz * vColor.a,  texelColor.a);
}
