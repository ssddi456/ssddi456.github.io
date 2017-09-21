varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;
uniform lowp float uUseFog;

varying lowp vec4 vColor;
varying lowp vec2 vFog;

void gray(in vec3 color, in float greyPercent, out vec3 grayed) {
    lowp float grayColor = color.x * 0.299 + color.y * 0.587 + color.z * 0.114;
    grayed.x = color.x + (grayColor - color.x) * greyPercent;
    grayed.y = color.y + (grayColor - color.y) * greyPercent;
    grayed.z = color.z + (grayColor - color.z) * greyPercent;
}

void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    if (uUseFog == 1.0) {
        lowp vec3 grayed = vec3(1.0, 1.0, 1.0);
        gray(vLighting * vColor.xyz, clamp((1.0 - vFog.s) * 2.0, 0.0, 1.0), grayed);
        gl_FragColor = vec4(grayed * vFog.s,  texelColor.a);
    } else {
        gl_FragColor = vec4(vLighting * vColor.xyz, texelColor.a);
    }
}
