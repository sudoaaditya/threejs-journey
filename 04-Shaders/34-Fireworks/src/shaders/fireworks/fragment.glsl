
uniform sampler2D uTexture;
// uniform vec3 uColor;

varying vec3 vColor;

void main() {

    float textureAlpha = texture(uTexture, gl_PointCoord).r;

    gl_FragColor = vec4(vColor, textureAlpha);
    // gl_FragColor = textureColor;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}