varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;
varying lowp vec4 vColor;

void gray(in vec3 color, in float greyPercent, out vec3 grayed) {
    lowp float grayColor = color.x * 0.299 + color.y * 0.587 + color.z * 0.114;
    grayed.x = color.x + (grayColor - color.x) * greyPercent;
    grayed.y = color.y + (grayColor - color.y) * greyPercent;
    grayed.z = color.z + (grayColor - color.z) * greyPercent;
}

void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    lowp vec3 grayed = vec3(1.0, 1.0, 1.0);
    gray(vLighting * vColor.xyz, clamp((1.0 - vColor.a) * 2.0, 0.0, 1.0), grayed);
    gl_FragColor = vec4(grayed * vColor.a,  texelColor.a);
}
