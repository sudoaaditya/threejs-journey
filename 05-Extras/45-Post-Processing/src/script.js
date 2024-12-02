import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

// Loader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Effect Composer
import { EffectComposer } from  'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from  'three/examples/jsm/postprocessing/RenderPass';
import { DotScreenPass } from  'three/examples/jsm/postprocessing/DotScreenPass';
import { GlitchPass } from  'three/examples/jsm/postprocessing/GlitchPass';
import { ShaderPass } from  'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from  'three/examples/jsm/postprocessing/UnrealBloomPass';

import { RGBShiftShader } from  'three/examples/jsm/shaders/RGBShiftShader';
import { GammaCorrectionShader } from  'three/examples/jsm/shaders/GammaCorrectionShader';
import { SMAAPass } from  'three/examples/jsm/postprocessing/SMAAPass';



// Debug
const gui = new dat.GUI()

const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

// Update all materials
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 2.5
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

// Environment map
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

// Models
gltfLoader.load(
    '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

// Lights
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// resize
window.addEventListener('resize', (e) => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    // UPdate Camera
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();
    //update canvas/renderer size 
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // update effect composer
    effectComposer.setSize(sizes.width, sizes.height);
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 1, - 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


let RenderTargetClass = null;
if(renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2) {
    RenderTargetClass = THREE.WebGLMultisampleRenderTarget;
} else {
    RenderTargetClass = THREE.WebGLRenderTarget;
}

// Post Processing
// Create Render Target
const renderTarget = new THREE.WebGLRenderTarget(
    800,
    600,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
    }
)

const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

const glitchPass = new GlitchPass();
// glitchPass.goWild = true;
glitchPass.enabled = false;
effectComposer.addPass(glitchPass);
gui.add(glitchPass, 'enabled');

// RGB Shift Shader Pass
const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.enabled = false;
effectComposer.addPass(rgbShiftPass);

const unreadBloomPass = new UnrealBloomPass();
unreadBloomPass.enabled = true;
unreadBloomPass.strength = 0.3;
unreadBloomPass.radius = 1;
unreadBloomPass.threshold = 0.6;
effectComposer.addPass(unreadBloomPass);

gui.add(unreadBloomPass, 'enabled');
gui.add(unreadBloomPass, 'strength', 0, 2, 0.001);
gui.add(unreadBloomPass, 'radius', 0, 2, 0.001);
gui.add(unreadBloomPass, 'threshold', 0, 1, 0.001);


// Gmamma Correction Shader Pass
const gammaCorrectPass = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectPass);

// Tint Pass
const tintShader = {
    uniforms: {
        tDiffuse:  { value: null },
        uTint: { value: null}
    },
    vertexShader: `

        varying vec2 uvOut;

        void main(void) {
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

            uvOut = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 uTint;
        varying vec2 uvOut;

        void main(void) {
            vec4 color = texture2D(tDiffuse, uvOut);
            color.rgb += uTint;
            gl_FragColor = color;
        }
    `
}

const tintPass = new ShaderPass(tintShader);
tintPass.material.uniforms.uTint.value = new THREE.Vector3(0, 0, 0);
effectComposer.addPass(tintPass)

gui.add(tintPass.material.uniforms.uTint.value, 'x', 0, 1, 0.001).name('RED');
gui.add(tintPass.material.uniforms.uTint.value, 'y', 0, 1, 0.001).name('GREEN');
gui.add(tintPass.material.uniforms.uTint.value, 'z', 0, 1, 0.001).name('BLUE');

// Displacement Pass
const displacementShader = {
    uniforms: {
        tDiffuse:  { value: null },
        uNormalMap: { value: null}
    },
    vertexShader: `

        varying vec2 uvOut;

        void main(void) {
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

            uvOut = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D uNormalMap;
        varying vec2 uvOut;

        void main(void) {

            vec3 normalColor = texture2D(uNormalMap, uvOut).xyz * 2.0 - 1.0;
            vec2 newUv = uvOut + normalColor.xy * 0.1;
            vec4 color = texture2D(tDiffuse, newUv);

            vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
            float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);

            color.rgb += lightness * 2.0;
            gl_FragColor = color;
        }
    `
}

const displacementPass = new ShaderPass(displacementShader);
displacementPass.material.uniforms.uNormalMap.value = textureLoader.load('/textures/interfaceNormalMap.png');
effectComposer.addPass(displacementPass)

// SMAA PASS 
if(renderer.getPixelRatio()  === 1 && !renderer.capabilities.isWebGL2) {
    const smaaPass = new SMAAPass();
    smaaPass.enabled = true;
    effectComposer.addPass(smaaPass);
}

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update()

    // Render
    // renderer.render(scene, camera)
    effectComposer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick();