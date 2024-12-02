import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

// Objects
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3);

// Raycaster

const raycaster = new THREE.Raycaster();

/* const rayOrigiin = new THREE.Vector3(-3, 0, 0);
const rayDirection = new THREE.Vector3(10, 0, 0); // length of direction has to be normalised
rayDirection.normalize();
raycaster.set(rayOrigiin, rayDirection);

const intersect = raycaster.intersectObject(object2);
console.log(intersect);

const intersects = raycaster.intersectObjects([object1, object2, object3]);
console.log(intersects); */

const rayOrigin = new THREE.Vector3(-3, 0, 0);
const rayDirection = new THREE.Vector3(1, 0, 0);
rayDirection.normalize();
raycaster.set(rayOrigin, rayDirection);


const objectsToTest = [object1, object2, object3];
const intersects = raycaster.intersectObjects(objectsToTest);
console.log(intersects);


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
camera.position.set(0, 0, 3);
scene.add(camera);

// Mouse
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / sizes.width * 2 - 1;
    mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

// click
window.addEventListener('click', (e) => {
    if(currentIntersect) {

        switch(currentIntersect.object) {
            case object1:
                console.log("CLICK ON SPHERE 1");
                break;

            case object2:
                console.log("CLICK ON SPHERE 2");
                break;

            case object3:
                console.log("CLICK ON SPHERE 3");
            break;
        }
    }
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
let currentIntersect = null;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

    /* //Cast the ray
    const rayOrigin = new THREE.Vector3(-3, 0, 0);
    const rayDirection = new THREE.Vector3(1, 0, 0);
    rayDirection.normalize();
    raycaster.set(rayOrigin, rayDirection);


    const objectsToTest = [object1, object2, object3];
    const intersects = raycaster.intersectObjects(objectsToTest);
    
    for(const object of objectsToTest) {
        object.material.color.set('red');
    }
    for(const intersect of intersects) {
        intersect.object.material.color.set('blue');
    } */

    // cast a ray
    raycaster.setFromCamera(mouse, camera);
    const objectsToTest = [object1, object2, object3];
    const intersects = raycaster.intersectObjects(objectsToTest);
    
    for(const object of objectsToTest) {
        object.material.color.set('red');
    }
    for(const intersect of intersects) {
        intersect.object.material.color.set('blue');
    }

    if(intersects.length) {
        if(currentIntersect === null) {
            console.log('MOUSE ENTER');
        }
        currentIntersect = intersects[0];
    } else {
        if(currentIntersect) {
            console.log('MOUSE LEAVE');
        }
        currentIntersect = null;
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()