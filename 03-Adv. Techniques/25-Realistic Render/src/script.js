import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

// loader
import { GLTFLoader } from'three/examples/jsm/loaders/GLTFLoader';

// Debug
const gui = new dat.GUI();
const debugObject = {
    envMapIntensity: 1
};

// Canvas
const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

let envMap = null;

// Update All Mats
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // child.material.envMap = envMap;
            child.material.envMapIntensity = debugObject.envMapIntensity;
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.needsUpdate = true;
        }
    });
}

// Loaders
const gltfLoader = new GLTFLoader();
const cubeTexLoader = new THREE.CubeTextureLoader();


// Env Map
envMap = cubeTexLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
]);
envMap.encoding = THREE.sRGBEncoding;
scene.background = envMap;
scene.environment = envMap;
gui.add(debugObject, 'envMapIntensity', 0, 10, 0.001).onFinishChange(updateAllMaterials)

gltfLoader.load('/models/hamburger.glb', (gltf) => {

    gltf.scene.scale.set(0.3, 0.3, 0.3);
    gltf.scene.position.set(0, -1, 0);
    gltf.scene.rotation.y = Math.PI * 0.5;
    scene.add(gltf.scene);

    gui.add(gltf.scene.rotation, 'y', -Math.PI, Math.PI, 0.001).name('Model RotationY');
    updateAllMaterials();
});


// Lights
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
scene.add(directionalLight);

/* const directionalLightCamHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCamHelper) */

gui.add(directionalLight, 'intensity', 0, 10, 0.001).name('Light Intensity');
gui.add(directionalLight.position, 'x', -5, 5, 0.001).name('LightX');
gui.add(directionalLight.position, 'y', -5, 5, 0.001).name('LightY');
gui.add(directionalLight.position, 'z', -5, 5, 0.001).name('LightZ');

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
})

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, -4)
scene.add(camera);


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Add tone maaping to tewaks
gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACES: THREE.ACESFilmicToneMapping,
}). onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping);
    updateAllMaterials()
});
gui.add(renderer, 'toneMappingExposure', 0 , 10, 0.001);

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
