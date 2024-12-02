import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';

import earthVertexShader from './shaders/earth/vertex.glsl'
import earthFragmentShader from './shaders/earth/fragment.glsl'

//Atmos Shaders
import atmosVertexShader from './shaders/atmosphere/vertex.glsl'
import atmosFragmentShader from './shaders/atmosphere/fragment.glsl'


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

//textures
const earthDayTexture = textureLoader.load('/earth/day.jpg');
earthDayTexture.colorSpace = THREE.SRGBColorSpace;
earthDayTexture.anisotropy = 8;

const earthNightTexture = textureLoader.load('/earth/night.jpg');
earthNightTexture.colorSpace = THREE.SRGBColorSpace;
earthNightTexture.anisotropy = 8;

const earthSpecularCloudsTexture = textureLoader.load('/earth/specularClouds.jpg');
earthSpecularCloudsTexture.anisotropy = 8;


/**
 * Earth
 */

const earthParameters = {};
earthParameters.atmosDayColor = "#00aaff";
earthParameters.atmosTwilightColor = "#ff6600";

// Mesh
const earthGeometry = new THREE.SphereGeometry(2, 64, 64)
const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    uniforms:
    {
        uDayTexture: new THREE.Uniform(earthDayTexture),
        uNightTexture: new THREE.Uniform(earthNightTexture),
        uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosDayColor)),
        uAtmosTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosTwilightColor)),
    }
})
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
scene.add(earth)

//Admos Materia
const atmosMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    vertexShader: atmosVertexShader,
    fragmentShader: atmosFragmentShader,
    uniforms:
    {
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosDayColor)),
        uAtmosTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosTwilightColor)),
    }
});
const atmosMesh = new THREE.Mesh(
    earthGeometry,
    atmosMaterial
);
atmosMesh.scale.set(1.04, 1.04, 1.04);
scene.add(atmosMesh);

// Sun
const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5);
const sunDirection = new THREE.Vector3();


//debug
const debugSun = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial()
);
debugSun.visible = false
scene.add(debugSun);


//lensflare
const lensflareTexture0 = textureLoader.load('/lenses/lensflare0.png');
const lensflareTexture1 = textureLoader.load('/lenses/lensflare1.png');

const addLenseflare = (h, s, l) => {

    const light = new THREE.PointLight(0xffffff, 1.5, 2000, 0);
    // light.color.setHSL(h, s, l);

    scene.add(light);

    const lensFlare = new Lensflare();
    lensFlare.addElement(new LensflareElement(lensflareTexture0, 400, 0, light.color));
    lensFlare.addElement(new LensflareElement(lensflareTexture1, 600, 0.6));
    light.add(lensFlare);

    return light;

}

const lensFlare0 = addLenseflare(0.55, 0.9, 0.5);

//Update
const updateSun = () => {
    sunDirection.setFromSpherical(sunSpherical);

    debugSun.position.copy(sunDirection).multiplyScalar(5);
    lensFlare0.position.copy(sunDirection).multiplyScalar(5);

    earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
    atmosMaterial.uniforms.uSunDirection.value.copy(sunDirection);
}
updateSun();

// gui tweaks
gui
    .add(sunSpherical, "phi")
    .min(-Math.PI)
    .max(Math.PI)
    .onChange(updateSun);

gui
    .add(sunSpherical, "theta")
    .min(-Math.PI)
    .max(Math.PI)
    .onChange(updateSun);

gui
    .addColor(earthParameters, 'atmosDayColor')
    .onChange(() => {
        earthMaterial.uniforms.uAtmosDayColor.value.setRGB(earthParameters.atmosDayColor);
        atmosMaterial.uniforms.uAtmosDayColor.value.setRGB(earthParameters.atmosDayColor);
    })

gui
    .addColor(earthParameters, 'atmosTwilightColor')
    .onChange(() => {
        earthMaterial.uniforms.uAtmosTwilightColor.value.setRGB(earthParameters.atmosTwilightColor);
        atmosMaterial.uniforms.uAtmosTwilightColor.value.setRGB(earthParameters.atmosTwilightColor);
    })

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

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
camera.position.x = 12
camera.position.y = 5
camera.position.z = 4
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
renderer.setClearColor('#000011')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    earth.rotation.y = elapsedTime * 0.1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()