import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap';
import { Sky } from 'three/addons/objects/Sky.js';

import fireworkVertexShader from './shaders/fireworks/vertex.glsl';
import fireworkFragmentShader from './shaders/fireworks/fragment.glsl';

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
}
sizes.resulution = new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
    sizes.resulution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1.5, 0, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
 * Fireworks
 */

//textures
const fireworkTextures = [
    textureLoader.load('/particles/1.png'),
    textureLoader.load('/particles/2.png'),
    textureLoader.load('/particles/3.png'),
    textureLoader.load('/particles/4.png'),
    textureLoader.load('/particles/5.png'),
    textureLoader.load('/particles/6.png'),
    textureLoader.load('/particles/7.png'),
    textureLoader.load('/particles/8.png'),
]
const createFireworks = (count, position, size, texture, radius, /* color */) => {

    //geometry
    const positionArray = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);
    const sizesArray = new Float32Array(count);
    const timemultiplierArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        let i3 = i * 3;

        const spherical = new THREE.Spherical(
            (radius * (0.75 + Math.random() * 0.25)),
            Math.random() * Math.PI,
            Math.random() * Math.PI * 2,
        );

        const position = new THREE.Vector3().setFromSpherical(spherical);

        const color = new THREE.Color().setHSL(Math.random(), 1, 0.7)

        positionArray[i3 + 0] = position.x;
        positionArray[i3 + 1] = position.y;
        positionArray[i3 + 2] = position.z;

        colorArray[i3 + 0] = color.r;
        colorArray[i3 + 1] = color.g;
        colorArray[i3 + 2] = color.b;

        sizesArray[i] = Math.random();
        timemultiplierArray[i] = 1 + Math.random();
    }

    const fireworkGeometry = new THREE.BufferGeometry();

    fireworkGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positionArray, 3));
    fireworkGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colorArray, 3));
    fireworkGeometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizesArray, 1));
    fireworkGeometry.setAttribute("aTimeMultiplier", new THREE.Float32BufferAttribute(timemultiplierArray, 1));

    texture.flipY = false;

    //material
    const fireworkMaterial = new THREE.ShaderMaterial({
        vertexShader: fireworkVertexShader,
        fragmentShader: fireworkFragmentShader,
        uniforms: {
            uSize: new THREE.Uniform(size),
            uResolution: new THREE.Uniform(sizes.resulution),
            uTexture: new THREE.Uniform(texture),
            // uColor: new THREE.Uniform(color),
            uProgress: new THREE.Uniform(0)
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    });

    let firework = new THREE.Points(fireworkGeometry, fireworkMaterial);
    firework.position.copy(position);
    scene.add(firework);

    const destroy = () => {
        scene.remove(firework);
        fireworkGeometry.dispose();
        fireworkMaterial.dispose();
    }

    // Animate
    gsap.to(
        fireworkMaterial.uniforms.uProgress,
        { value: 1, duration: 3, ease: "linear", onComplete: destroy }
    )
}

const createRandomFirework = () => {
    const count = Math.round(400 + Math.random() * 1000);
    const position = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random(),
        (Math.random() - 0.5) * 2,
    );
    const size = 0.1 + Math.random() * 0.1;
    const texture = fireworkTextures[Math.floor(Math.random() * fireworkTextures.length)];
    const radius = 0.5 + Math.random();
    // const color = new THREE.Color();
    // color.setHSL(Math.random(), 1, 0.7);

    createFireworks(
        count,
        position,
        size,
        texture,
        radius,
        // color
    )
}

createRandomFirework();

/**
 * on Click  
 */
window.addEventListener("click", () => {
    createRandomFirework();
});

/**
 * SKY 
 *  */

// Add Sky
const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);

const sun = new THREE.Vector3();

/// GUI

const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.95,
    elevation: -2.2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
};

function guiChanged() {

    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms['sunPosition'].value.copy(sun);

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render(scene, camera);

}

gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
gui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
gui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
gui.add(effectController, 'elevation', -3, 90, 0.01).onChange(guiChanged);
gui.add(effectController, 'azimuth', - 180, 180, 0.1).onChange(guiChanged);
gui.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged);

guiChanged();

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()