/* precision mediump float; */

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 uvOut;
varying float elevationOut;

// varying float aRandomOut;

void main() {
    // gl_FragColor = vec4(0.5, aRandomOut * 0.5, 1.0, 1.0);
    vec4 texColor = texture2D(uTexture, uvOut);
    texColor.rgb *= elevationOut * 2.0 + 0.5;
    gl_FragColor = texColor;
}