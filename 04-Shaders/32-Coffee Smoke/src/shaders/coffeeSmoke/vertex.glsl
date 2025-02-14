
uniform sampler2D uPerlinTexture;
uniform float uTime;
varying vec2 vUv;

#include ../includes/rotate2D.glsl

void main () {

    vec3 tPosition = position;
    vUv = uv;

    //twist
    float twistPerlin = texture(
        uPerlinTexture, 
        vec2(0.5, vUv.y * 0.2 - uTime * 0.005)
    ).r;
    
    float angle = twistPerlin * 10.0;
    tPosition.xz = rotate2D(tPosition.xz, angle);

    //wind
    vec2 windOffset = vec2(
        texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
        texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5
    );
    windOffset *= pow(uv.y, 2.0) * 10.0;
    tPosition.xz += windOffset;



    gl_Position = projectionMatrix *  modelViewMatrix * vec4(tPosition, 1.0);
}