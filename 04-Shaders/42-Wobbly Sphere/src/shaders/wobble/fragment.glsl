uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vWobble; 

void main() {
    float colorMix = smoothstep(-1.0, 1.0, vWobble);
    csm_DiffuseColor.rgb = mix(uColorA, uColorB, colorMix);

    // Mirror Step
    // csm_Metalness = step(0.25, vWobble);
    // csm_Roughness = 1.0 - csm_Metalness;

    // Shiny Tip
    csm_Roughness = 1.0 - colorMix;
}

/* 
    varying vec2 vUv;
    csm_DiffuseColor.rgb = vec3(1.0, 0.5, 0.5);

    csm_Metalness = step(0.0, sin(vUv.x * 100.0 + 0.5));
    csm_Roughness = 1.0 - csm_Metalness; 
*/