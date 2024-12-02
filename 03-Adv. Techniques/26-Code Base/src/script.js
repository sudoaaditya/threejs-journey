/* // import classes
import Robot from './Robot';
import FlyingRobot from  './FlyingRobot';


const wallE = new Robot('Wall-E', 0)
const ultron = new FlyingRobot('Ultron', 2)
const astroBoy = new FlyingRobot('Astro Boy', 2) */


import './style.css';
import Experience from './Experience/Experience';

const experience = new Experience(document.getElementById("webgl-canvas"));
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import * as dat from 'dat.gui';

// // loader
// import { GLTFLoader } from'three/examples/jsm/loaders/GLTFLoader';

// // Debug
// const gui = new dat.GUI();
// const debugObject = {
//     envMapIntensity: 0.4
// };

// const gltfLoader = new GLTFLoader();
// const textureLoader = new THREE.TextureLoader()
// const cubeTextureLoader = new THREE.CubeTextureLoader()


// // Canvas
// const canvas = document.getElementById("webgl-canvas");

// //Scene
// const scene = new THREE.Scene();

// let envMap = null;

// // Update All Mats
// const updateAllMaterials = () => {
//     scene.traverse((child) => {
//         if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
//             // child.material.envMap = envMap;
//             child.material.envMapIntensity = debugObject.envMapIntensity;
//             child.castShadow = true;
//             child.receiveShadow = true;
//             child.material.needsUpdate = true;
//         }
//     });
// }

// // Env Map
// envMap = cubeTextureLoader.load([
//     '/textures/environmentMap/px.jpg',
//     '/textures/environmentMap/nx.jpg',
//     '/textures/environmentMap/py.jpg',
//     '/textures/environmentMap/ny.jpg',
//     '/textures/environmentMap/pz.jpg',
//     '/textures/environmentMap/nz.jpg',
// ]);
// envMap.encoding = THREE.sRGBEncoding;
// // scene.background = envMap;
// scene.environment = envMap;
// gui.add(debugObject, 'envMapIntensity', 0, 10, 0.001).onFinishChange(updateAllMaterials);


// //Models
// let foxMixer = null

// gltfLoader.load(
//     '/models/Fox/glTF/Fox.gltf',
//     (gltf) =>
//     {
//         // Model
//         gltf.scene.scale.set(0.02, 0.02, 0.02)
//         scene.add(gltf.scene)

//         // Animation
//         foxMixer = new THREE.AnimationMixer(gltf.scene)
//         const foxAction = foxMixer.clipAction(gltf.animations[1])
//         foxAction.play()

//         // Update materials
//         updateAllMaterials()
//     }
// )

// // Floor
// const floorColorTexture = textureLoader.load('textures/dirt/color.jpg')
// floorColorTexture.encoding = THREE.sRGBEncoding
// floorColorTexture.repeat.set(1.5, 1.5)
// floorColorTexture.wrapS = THREE.RepeatWrapping
// floorColorTexture.wrapT = THREE.RepeatWrapping

// const floorNormalTexture = textureLoader.load('textures/dirt/normal.jpg')
// floorNormalTexture.repeat.set(1.5, 1.5)
// floorNormalTexture.wrapS = THREE.RepeatWrapping
// floorNormalTexture.wrapT = THREE.RepeatWrapping

// const floorGeometry = new THREE.CircleGeometry(5, 64)
// const floorMaterial = new THREE.MeshStandardMaterial({
//     map: floorColorTexture,
//     normalMap: floorNormalTexture
// })
// const floor = new THREE.Mesh(floorGeometry, floorMaterial)
// floor.rotation.x = - Math.PI * 0.5
// scene.add(floor)

// // Lights
// const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
// directionalLight.position.set(0.25, 3, -2.25);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.far = 15;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.normalBias = 0.05;
// scene.add(directionalLight);

// /* const directionalLightCamHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightCamHelper) */

// gui.add(directionalLight, 'intensity', 0, 10, 0.001).name('Light Intensity');
// gui.add(directionalLight.position, 'x', -5, 5, 0.001).name('LightX');
// gui.add(directionalLight.position, 'y', -5, 5, 0.001).name('LightY');
// gui.add(directionalLight.position, 'z', -5, 5, 0.001).name('LightZ');

// // Sizes
// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }

// // resize
// window.addEventListener('resize', (e) => {
//     sizes.width = window.innerWidth;
//     sizes.height = window.innerHeight;
//     // UPdate Camera
//     camera.aspect = sizes.width/sizes.height;
//     camera.updateProjectionMatrix();
//     //update canvas/renderer size 
//     renderer.setSize(sizes.width, sizes.height);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// })


// // Base camera
// const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
// camera.position.set(6, 4, 8);
// scene.add(camera);

// // Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// // Renderer
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas,
//     antialias: true
// });
// renderer.physicallyCorrectLights = true;
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.CineonToneMapping;
// renderer.toneMappingExposure = 1.75;
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.setClearColor('#211d20');
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// //Animate
// const clock = new THREE.Clock()
// let previousTime = 0

// const tick = () =>
// {
//     const elapsedTime = clock.getElapsedTime()
//     const deltaTime = elapsedTime - previousTime
//     previousTime = elapsedTime

//     // Update controls
//     controls.update()

//     // Fox animation
//     foxMixer && foxMixer.update(deltaTime)

//     // Render
//     renderer.render(scene, camera)

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
// }

// tick()