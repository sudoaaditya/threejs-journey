import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

gui.closed = true;

// Canvas
const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

// Texture
const textLoader = new THREE.TextureLoader();
const bakedShadowMap = textLoader.load('/textures/bakedShadow.jpg');
const simpleShadowMap = textLoader.load('/textures/simpleShadow.jpg');

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
gui.add(ambientLight, 'intensity', 0, 1, 0.001).name('Ambient Intesity');
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(2, 2, - 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.top = 2;
// directionalLight.shadow.radius = 10;

gui.add(directionalLight, 'intensity', 0, 1, 0.001).name('Directional Intesity');
gui.add(directionalLight.position, 'x', -5, 5, 0.001);
gui.add(directionalLight.position, 'y', -5, 5, 0.001);
gui.add(directionalLight.position, 'z', -5, 5, 0.001);
scene.add(directionalLight);

const spotLight = new THREE.SpotLight("#ffffff", 0.3, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
spotLight.position.set(0, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target);

const pointLight = new THREE.PointLight('#ffffff', 0.3);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

/* const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCameraHelper); */

/* const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper); */

/* // add camera helper to directional light camera
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCameraHelper); */

const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness', 0, 1, 0.001);
gui.add(material, 'roughness', 0, 1, 0.001);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true;


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    /* new THREE.MeshBasicMaterial({map: bakedShadowMap}) */
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5;
plane.receiveShadow = true;

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: "#000000",
        transparent: true,
        alphaMap: simpleShadowMap
    })
);
sphereShadow.rotation.x = - Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;

scene.add(sphere, plane, sphereShadow)

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

// camera
const camera = new THREE.PerspectiveCamera(75, (sizes.width/sizes.height), 0.1, 1000);
camera.position.set(1, 1, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFShadowMap;

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // update sphere
    sphere.position.x = Math.cos(elapsedTime * 1.5);
    sphere.position.z = Math.sin(elapsedTime * 1.5);
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 2));

    sphereShadow.position.x = sphere.position.x;
    sphereShadow.position.z = sphere.position.z;
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.5;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()