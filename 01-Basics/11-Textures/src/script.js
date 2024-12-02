import './style.css'
import * as THREE from 'three'
// orbit controls
import  { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// loader
const loaderManager = new THREE.LoadingManager();
loaderManager.onStart = () => {
    console.log("onStart");
}
loaderManager.onLoad = () => {
    console.log("onLoad");
}
loaderManager.onProgress = () => {
    console.log("onProgress");
}
loaderManager.onError = () => {
    console.log("onError");
}
// Texture
const textLoader = new THREE.TextureLoader(loaderManager);
const colorTexture = textLoader.load('/textures/door/color.jpg');
const alphaTexture = textLoader.load('/textures/door/alpha.jpg');
const heightTexture = textLoader.load('/textures/door/height.jpg');
const normalTexture = textLoader.load('/textures/door/normal.jpg');
const aoTexture = textLoader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textLoader.load('/textures/door/roughness.jpg');

// Texture Transforms
/* colorTexture.repeat.x = 2;
colorTexture.repeat.y = 3;
colorTexture.wrapS = colorTexture.wrapT = THREE.MirroredRepeatWrapping;

colorTexture.offset.x = 0.5;
colorTexture.offset.y = 0.5; */

/* colorTexture.rotation = Math.PI * 0.25;
colorTexture.center.x = 0.5;
colorTexture.center.y = 0.5; */

colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;
colorTexture.generateMipmaps = false;

// Canvas
const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

//Create Cube
const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial({
    map: colorTexture
});
const cube = new THREE.Mesh(geo, mat);
scene.add(cube);

//Sizes
let sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

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


// Cube
const camera = new THREE.PerspectiveCamera(75, (sizes.width/sizes.height), 0.1, 1000);
camera.position.z = 2
camera.lookAt(cube.position)
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () =>
{
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()