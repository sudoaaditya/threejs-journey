import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

//Create Cube
const group = new THREE.Group();
scene.add(group);

const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial({color: "#ffff00"});
const cube1 = new THREE.Mesh(geo, mat);
group.add(cube1);

const cube2 = new THREE.Mesh(geo, mat);
cube2.position.x = -2
group.add(cube2);

const cube3 = new THREE.Mesh(geo, mat);
cube3.position.x = 2
group.add(cube3);

group.position.y = 1

/* cube.position.x = 1;
cube.position.y = -0.6;
cube.position.z = 1; */

/* cube.position.set(1, -0.6, 1);

cube.scale.set(2, 0.5, 0.5)
scene.add(cube);
 */
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper)

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
renderer.render(scene, camera);