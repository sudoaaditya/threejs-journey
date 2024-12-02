attribute float aSize;
attribute float aTimeMultiplier;

uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

varying vec3 vColor;

#include ../includes/remap.glsl

void main () {

    float progress = uProgress * aTimeMultiplier;
    vec3 newPosition = position;

    //explision
    float explodingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
    explodingProgress = clamp(explodingProgress, 0.0, 1.0);
    explodingProgress = 1.0 - pow( 1.0 - explodingProgress, 3.0);
    newPosition *= explodingProgress;

    // falling
    float fallingPorgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
    fallingPorgress = clamp(fallingPorgress, 0.0, 1.0);
    fallingPorgress = 1.0 - pow(1.0 - fallingPorgress, 3.0);
    newPosition.y -= fallingPorgress * 0.2;

    // scaling
    float sizeOpeningProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
    float sizeClosingProgress = remap(progress, 0.125, 1.0, 1.0, 0.0);
    float sizeProgress = min(sizeOpeningProgress, sizeClosingProgress);
    sizeProgress = clamp(sizeProgress, 0.0, 1.0);

    // twinkle
    float twinklingProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
    twinklingProgress = clamp(twinklingProgress, 0.0, 1.0);
    float sizeTwinkling = sin(progress * 30.0) * 0.5 + 0.5;
    sizeTwinkling = 1.0 - sizeTwinkling * twinklingProgress;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition; 

    gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkling;
    gl_PointSize *= 1.0 / - viewPosition.z;

    if(gl_PointSize < 1.0) {
        gl_Position = vec4(9999.9);
    }

    vColor = color;
}