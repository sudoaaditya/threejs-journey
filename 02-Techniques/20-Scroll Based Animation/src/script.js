import './style.css'
import * as THREE from 'three';
import * as dat from 'dat.gui';
import gsap from 'gsap';

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui.addColor(parameters, 'materialColor').onChange(() => {
    material.color.set(parameters.materialColor);
    particlesMat.color.set(parameters.materialColor);
})

// Canvas
const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

//Tex Loader
const texLoader = new THREE.TextureLoader();
const gradientTex = texLoader.load('/textures/gradients/3.jpg');
gradientTex.magFilter = THREE.NearestFilter;

//Create Cube
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTex
});
const objectDistance = 4;


const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)
scene.add(mesh1, mesh2, mesh3);

mesh1.position.y = -objectDistance * 0;
mesh2.position.y = -objectDistance * 1;
mesh3.position.y = -objectDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;
const sectionMeshes = [mesh1, mesh2, mesh3];

// Particles
const count = 500;
const position = new Float32Array(count * 3);
for(let i = 0; i < count; i++) {

    position[i * 3 + 0] = (Math.random() - 0.5) * 10;
    position[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshes.length;
    position[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeo = new THREE.BufferGeometry();
particlesGeo.setAttribute('position', new THREE.BufferAttribute(position, 3));

const particlesMat = new THREE.PointsMaterial({ 
    color: parameters.materialColor,
    size: 0.03,
    sizeAttenuation: true
});

const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

const dirLight = new THREE.DirectionalLight('#ffffff', 1);
dirLight.position.set(1, 1, 0);
scene.add(dirLight);

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

// Camera
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(35, (sizes.width/sizes.height), 0.1, 1000);
camera.position.set(0, 0, 6);
cameraGroup.add(camera);


// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Scroll
let scrollY = window.screenY;
let currentSection = 0;
window.addEventListener('scroll', (e) => {
    scrollY = window.scrollY;
    const newSec = Math.round(scrollY / sizes.height);
    if(currentSection !== newSec) {
        currentSection = newSec
        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: "+=6",
                y: "+=3",
                z: "+=1.5"
            }
        )
    };
});

const cursor = {
    x: 0,
    y: 0
};
window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / sizes.width - 0.5;
    cursor.y = e.clientY / sizes.height - 0.5;
})

const clock = new THREE.Clock();
let prevTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    let deltaTime = elapsedTime - prevTime;
    prevTime = elapsedTime;

    // change caamera 
    camera.position.y = - scrollY / sizes.height * objectDistance;

    const parallaxX = cursor.x * 0.5;
    const parallaxY = -cursor.y * 0.5;
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;
    

    //animate meshes
    for(const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.12;
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()