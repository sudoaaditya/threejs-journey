varying vec2 uvOut;

void main() {

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    uvOut = uv;
}