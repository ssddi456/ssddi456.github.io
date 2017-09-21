varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSamplerGray;
uniform sampler2D uSamplerColor;

uniform highp vec2 uCenter;
uniform highp vec2 uResolution;
uniform highp float uSightRange;

void main(void) {
    highp vec2 vPos = vec2(vTextureCoord.x * uResolution.x, vTextureCoord.y * uResolution.y);
    highp float deltaY = uCenter.x - vPos.x;
    highp float deltaX = uCenter.y - vPos.y;

    if (deltaX * deltaX + deltaY * deltaY < uSightRange){
        gl_FragColor = texture2D(uSamplerColor, vTextureCoord);
    } else {
        gl_FragColor = texture2D(uSamplerGray, vTextureCoord);
    }
}
