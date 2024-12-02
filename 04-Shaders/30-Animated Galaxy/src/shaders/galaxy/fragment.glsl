
varying vec3 colorOut;

void main(void) {

    // Disc Pattern
    /* float strength = distance(gl_PointCoord, vec2(0.5));
    strength = step(0.5, strength);
    strength = 1.0 - strength; */

    /* // Difuse Point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = 1.0 - strength; */

    // Light point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    vec3 mixedColor = mix(vec3(0.0), colorOut, strength);

    gl_FragColor = vec4(mixedColor, 1.0);
}
