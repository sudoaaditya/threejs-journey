import './style.css'
import * as THREE from 'three'
import  { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

/* Debug */
const gui = new dat.GUI();

// Canvas
const canvas = document.getElementById("webgl-canvas");

/* Textures */
const texLoader = new THREE.TextureLoader();
const cubeTexLoader = new THREE.CubeTextureLoader();

const doorColorTexture = texLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = texLoader.load('/textures/door/alpha.jpg');
const doorAOTexture = texLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = texLoader.load('/textures/door/height.jpg');
const doorNormalTexture = texLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = texLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = texLoader.load('/textures/door/roughness.jpg');
const mapcatTexture = texLoader.load('/textures/matcaps/1.png');
const gradientTexture = texLoader.load('/textures/gradients/5.jpg');
gradientTexture.minFilter = gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const envMapTexture = cubeTexLoader.load([
    '/textures/environmentMaps/4/px.png',
    '/textures/environmentMaps/4/nx.png',
    '/textures/environmentMaps/4/py.png',
    '/textures/environmentMaps/4/ny.png',
    '/textures/environmentMaps/4/pz.png',
    '/textures/environmentMaps/4/nz.png',
])

//Scene
const scene = new THREE.Scene();

//Create Object
// const mat = new THREE.MeshBasicMaterial();
// mat.map = doorColorTexture;
// mat.color = new THREE.Color(0x00ff00);
// mat.wireframe = true;
// mat.transparent = true;
// mat.opacity = 0.5;
// mat.alphaMap = doorAlphaTexture;
// mat.side = THREE.DoubleSide;

// const mat = new THREE.MeshNormalMaterial()
// mat.flatShading = true;

/* const mat = new THREE.MeshMatcapMaterial();
mat.matcap = mapcatTexture; */

// const mat = new THREE.MeshDepthMaterial()

// const mat = new THREE.MeshLambertMaterial();

// const mat = new THREE.MeshPhongMaterial();
// mat.shininess = 100;
// mat.specular.set('#ff0000')

// const mat = new THREE.MeshToonMaterial();
// mat.gradientMap = gradientTexture;

// const mat = new THREE.MeshStandardMaterial();
// mat.metalness = 0.45;
// mat.roughness = 0.65;
// mat.map = doorColorTexture;
// mat.aoMap = doorAOTexture;
// mat.aoMapIntensity = 1;
// mat.displacementMap = doorHeightTexture;
// mat.displacementScale = 0.05;
// mat.metalnessMap = doorMetalnessTexture;
// mat.roughnessMap = doorRoughnessTexture;
// mat.normalMap = doorNormalTexture;
// mat.normalScale.set(0.5, 0.5);
// mat.transparent = true;
// mat.alphaMap = doorAlphaTexture;

const mat = new THREE.MeshStandardMaterial();
mat.metalness = 0.7;
mat.roughness = 0.2;
mat.envMap = envMapTexture

gui.add(mat, 'metalness', 0, 1, 0.001);
gui.add(mat, 'roughness', 0, 1, 0.001);
// gui.add(mat, 'aoMapIntensity', 1, 10, 0.001);
// gui.add(mat, 'displacementScale', 0, 1, 0.0001);

const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 64, 64),
    mat
);
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2));

sphere.position.x = -1.5; 

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1, 100, 100),
    mat
);

plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
    mat
);

torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2));


torus.position.x = 1.5

scene.add(sphere, plane, torus);

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);



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
const camera = new THREE.PerspectiveCamera(75, (sizes.width/sizes.height), 0.1, 1000);
camera.position.set(1, 1, 2)
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {

    const elapsedTime = clock.getElapsedTime();

    //update objects

    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;


    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
