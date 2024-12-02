import './style.css'
import * as THREE from 'three'
// orbit controls
import  { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Canvas
const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

//Create Cube
const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial({color: "#00ffff"});
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
camera.position.set(1, 1, 2);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
