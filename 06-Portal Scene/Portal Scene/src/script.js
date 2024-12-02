import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// Loader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// shaders
import fireFliesVertexShader from './shaders/fireflies/vertex.glsl';
import fireFliesFragmentShader from './shaders/fireflies/fragment.glsl';

import portalsVertexShader from './shaders/portal/vertex.glsl';
import portalFragmentShader from './shaders/portal/fragment.glsl';


// Debug
const debugObject = {
    clearColor: '#201919',
    portalColorStart: '#000000',
    portalColorEnd: '#ffffff',
}
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.getElementById("webgl-canvas");

// Scene
const scene = new THREE.Scene();

// Texture loader
const textureLoader = new THREE.TextureLoader()
// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


// Textures
const bakedTexture = textureLoader.load('bakedPortal2.jpg');
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

// Model
// Baked Materials
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture});

// Pole Light Material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: '#ffffe5'});

// portalLightMaterial
const portalLightMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uColorStart: { value: new THREE.Color(debugObject.portalColorStart)},
        uColorEnd: { value: new THREE.Color(debugObject.portalColorEnd)},
    },
    vertexShader: portalsVertexShader,
    fragmentShader: portalFragmentShader
});

gui.addColor(debugObject, 'portalColorStart').onChange(() => portalLightMaterial.uniforms.uColorStart.value.set(debugObject.portalColorStart));
gui.addColor(debugObject, 'portalColorEnd').onChange(() => portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd));

gltfLoader.load('portal_o.glb', (gltf) => {

    const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked');
    const poleLightAMesh = gltf.scene.children.find((child) => child.name === 'poleLightA');
    const poleLightBMesh = gltf.scene.children.find((child) => child.name === 'poleLightB');
    const portalMesh = gltf.scene.children.find((child) => child.name === 'portal');

    bakedMesh.material = bakedMaterial;
    poleLightAMesh.material = poleLightBMesh.material = poleLightMaterial;
    portalMesh.material = portalLightMaterial;

    scene.add(gltf.scene);
});

//fireflies
const firefliesGeo = new THREE.BufferGeometry();
const firefliesCount = 30;
const firefliesPosition = new Float32Array( firefliesCount * 3);
const firefliesScale = new Float32Array( firefliesCount * 1);

for(let i = 0; i < firefliesCount; i++) {
    const i3 = i * 3;

    firefliesPosition[i3    ] = (Math.random() - 0.5) * 4;
    firefliesPosition[i3 + 1] = Math.random() * 1.5;
    firefliesPosition[i3 + 2] = (Math.random() - 0.5) * 4;

    firefliesScale[i] = Math.random();
}

firefliesGeo.setAttribute('position', new THREE.BufferAttribute(firefliesPosition, 3));
firefliesGeo.setAttribute('aScale', new THREE.BufferAttribute(firefliesScale, 1));

const firefliesMat = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0},
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2)},
        uPointSize: { value : 100},
        
    },
    transparent: true,
    vertexShader: fireFliesVertexShader,
    fragmentShader: fireFliesFragmentShader,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const firefiles = new THREE.Points(firefliesGeo, firefliesMat);
scene.add(firefiles);

gui.add(firefliesMat.uniforms.uPointSize, 'value', 0, 500, 1).name('firefliesSize');


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

    // change shader Pixel Rario
    firefliesMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
})

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 2, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(debugObject.clearColor);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// GUI
gui.addColor(debugObject, 'clearColor').onChange(() => renderer.setClearColor(debugObject.clearColor))
// ANimate
const clock = new THREE.Clock();
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update Material
    firefliesMat.uniforms.uTime.value = elapsedTime;
    portalLightMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update();
    // Render
    renderer.render(scene, camera);
    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick()