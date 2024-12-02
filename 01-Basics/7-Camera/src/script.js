import './style.css'
import * as THREE from 'three'
// orbit controls
import  { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/* mousemove event listener */
const cursor = {
    x: 0,
    y: 0
}

/* window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / sizes.width - 0.5;
    cursor.y = - (e.clientY / sizes.height - 0.5); // invert value is in js y goes up as going down and in three it's immverse
}) */

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
    width: 800,
    height: 600
};

// Cube
/* const aspectRatio = sizes.width/sizes.height;
const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)
 */
const camera = new THREE.PerspectiveCamera(75, (sizes.width/sizes.height), 0.1, 1000);
/* camera.position.x = 2
camera.position.y = 2 */
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


// Animate
// const clock = new THREE.Clock()

const tick = () =>
{
    // const elapsedTime = clock.getElapsedTime()

    // Update objects
    // cube.rotation.y = elapsedTime;

    // update camera
    /* camera.position.x = cursor.x * 5;
    camera.position.y = cursor.y * 5; */
    /* camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    camera.position.y = cursor.y * 5
    camera.lookAt(cube.position) */

    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()