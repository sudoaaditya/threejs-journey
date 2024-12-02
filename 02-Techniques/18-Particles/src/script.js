import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';


// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.getElementById("webgl-canvas");

// Scene
const scene = new THREE.Scene()

// Texture
const texLoader = new THREE.TextureLoader()
const particleTexture = texLoader.load('/textures/particles/2.png')

// PArticles
const particleGeo = new THREE.BufferGeometry();
const count = 20000;

const positions = new Float32Array(count*3);
const colors = new Float32Array(count*3);
for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = (Math.random())
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMat = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    // color: '#ff88cc',
    alphaMap: particleTexture,
    transparent: true,
    // alphaTest: 0.001
    // depthTest: false
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
});

const particles = new THREE.Points(particleGeo, particlesMat);
scene.add(particles);

/* //Create Cube
const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial();
const cube = new THREE.Mesh(geo, mat);
scene.add(cube); */

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

    // animate particles
    // particles.rotation.y = elapsedTime * 0.2
    for(let  i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = particles.geometry.attributes.position.array[i3];
        particles.geometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()