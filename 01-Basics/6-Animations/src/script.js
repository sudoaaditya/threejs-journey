import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

//Create Cube
const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial({color: "#ffff00"});
const cube = new THREE.Mesh(geo, mat);
scene.add(cube);

//Sizes
let sizes = {
    width: 800,
    height: 600
};

// Cube
const camera = new THREE.PerspectiveCamera(75, (sizes.width/sizes.height));
camera.position.set(0, 0, 3)
scene.add(camera);

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);


/* // tme sync for animation irrespective of fps
let time = Date.now(); */

/* // time alternative using Clock clock
const clock  = new THREE.Clock(); */

gsap.to(cube.position, {duration: 1, delay: 1, x: 2})
gsap.to(cube.position, {duration: 1, delay: 2, x: 0})

//Animations
const tick = () => {
    
    /* // Calculate delta factor for constant animations rate
    const cTime = Date.now();
    const dTime = cTime - time;
    time = cTime; */

    /* // get elapsed time
    const elapsedTime = clock.getElapsedTime(); */

    // animations
    //cube.rotation.x += 0.001 * dTime;
    // cube.rotation.x = elapsedTime 
    /* cube.position.y = Math.sin(elapsedTime) */

    //Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

// first call
tick();