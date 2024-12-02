import './style.css';
import * as THREE from 'three';
// orbit controls
import  { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

// Debug
const gui = new dat.GUI({ width: 400});

// Canvas
const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

// Object
const parameters = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
}

// Galaxy
let particleGeo = null;
let particlesMat = null;
let particles = null;
const generateGalaxy = () => {
    
    if(particles !== null) {
        particleGeo.dispose();
        particlesMat.dispose();
        scene.remove(particles);
    }

    particleGeo = new THREE.BufferGeometry();
    const postions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for(let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
        // Positions
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = ((i % parameters.branches) / parameters.branches) * 2 * Math.PI;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

        postions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        postions[i3 + 1] = randomY;
        postions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color

        const mixColor = colorInside.clone();
        mixColor.lerp(colorOutside, radius / parameters.radius)
        colors[i3 + 0] = mixColor.r;
        colors[i3 + 1] = mixColor.g;
        colors[i3 + 2] = mixColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(postions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    particlesMat = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    particles = new THREE.Points(particleGeo, particlesMat);
    scene.add(particles);
}
generateGalaxy();

gui.add(parameters, 'count', 100, 1000000, 100).onFinishChange(generateGalaxy);
gui.add(parameters, 'size', 0.001, 0.1, 0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius', 0.01, 20, 0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches', 2, 20, 1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin', -5, 5, 0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness', 0, 2, 0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower', 1, 10, 0.001).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);



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