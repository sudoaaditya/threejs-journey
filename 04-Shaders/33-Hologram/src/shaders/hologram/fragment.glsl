
uniform float uTime;
uniform vec3 uColor;
varying vec3 vPosition;
varying vec3 vNormal;

void main () {

    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing) {
        normal *= -1.0;
    }

    //stripes
    float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
    stripes = pow(stripes, 3.0);

    //fresnal
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnal = dot(viewDirection, normal) + 1.0;
    fresnal = pow(fresnal, 2.0);

    // falloff
    float falloff = smoothstep(0.8, 0.0, fresnal);

    //hologram
    float hologram = stripes * fresnal;
    hologram += fresnal * 1.25;
    hologram *= falloff;

    //resultant color
    gl_FragColor = vec4(uColor, hologram);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}