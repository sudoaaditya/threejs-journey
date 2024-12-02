import './style.css'
import * as THREE from 'three'
// orbit controls
import  { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import * as dat from 'dat.gui';


/* DEBUG */
const gui = new dat.GUI({closed: true, width: 300})
// by default hidden, press h to make it visible
// gui.hide()

const paramaters = {
    color: '#ff0000',
    spin: () => {
        gsap.to(cube.rotation, {y: cube.rotation.y + 10, duration: 1 })
    }
}

// Canvas
const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

//Create Cube
const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial({color: paramaters.color});
const cube = new THREE.Mesh(geo, mat);
scene.add(cube);

// DEBUG
// Object, Property,Minimum, Maximum, Step
/* gui.add(cube.position, 'x', -3, 3, 0.01)
gui.add(cube.position, 'y', -3, 3, 0.01)
gui.add(cube.position, 'z', -3, 3, 0.01)
 */

gui.add(cube.position, 'y').min(-3).max(3).step(0.01).name('elevation')
gui.add(cube, 'visible')
gui.add(mat, 'wireframe')
gui.addColor(paramaters, 'color').onChange(() => {
    mat.color.set(paramaters.color)
})
gui.add(paramaters, 'spin');


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
