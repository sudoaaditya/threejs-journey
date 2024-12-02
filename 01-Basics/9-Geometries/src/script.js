import './style.css'
import * as THREE from 'three'
// orbit controls
import  { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Canvas
const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

//Create Cube
// const geo = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);

const geo = new THREE.BufferGeometry();

const count = 50;
const positionArray = new Float32Array(count * 3 * 3)
for(var i = 0; i < count * 3 * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 4
}

const vertexAttribute = new THREE.BufferAttribute(positionArray, 3);
geo.setAttribute('position', vertexAttribute)

const mat = new THREE.MeshBasicMaterial({
    color: "#ff0000",
    wireframe: true
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
camera.position.z = 3
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