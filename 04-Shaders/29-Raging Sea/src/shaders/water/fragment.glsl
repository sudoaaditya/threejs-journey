
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float elevationOut;

void main(void) {
    float mixedStrength = (elevationOut + uColorOffset) * uColorMultiplier;
    vec3 mixedColor = mix(uDepthColor, uSurfaceColor, mixedStrength);
    gl_FragColor = vec4(mixedColor, 1.0);
}