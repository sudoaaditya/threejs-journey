import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

//Loaders 
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Debug
const gui = new dat.GUI()

const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 1
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

// Textures
const mapTexture = textureLoader.load('/models/LeePerrySmith/color.jpg')
mapTexture.encoding = THREE.sRGBEncoding

const normalTexture = textureLoader.load('/models/LeePerrySmith/normal.jpg')

// Material
const material = new THREE.MeshStandardMaterial( {
    map: mapTexture,
    normalMap: normalTexture
})

const depthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    
})

const customUniforms = {
    uTime: { value: 0}
}

material.onBeforeCompile = (shader) => {

    shader.uniforms.uTime = customUniforms.uTime;

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>', 
        `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle) {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }
            
        `
    );

    shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>', 
        `
            #include <beginnormal_vertex>

            float angle = (sin(position.y + uTime)) * 0.4;
            mat2 rotationMatrix = get2dRotateMatrix(angle);

            objectNormal.xz = rotationMatrix * objectNormal.xz;
        `
    );

    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>', 
        `
            #include <begin_vertex>

            transformed.xz = rotationMatrix * transformed.xz;
        `
    );
}

depthMaterial.onBeforeCompile = (shader) => {
    
    shader.uniforms.uTime = customUniforms.uTime;

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>', 
        `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle) {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }
            
        `
    );

    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>', 
        `
            #include <begin_vertex>

            float angle = (sin(position.y + uTime)) * 0.4;
            mat2 rotationMatrix = get2dRotateMatrix(angle);

            transformed.xz = rotationMatrix * transformed.xz;
        `
    );
}

/**
 * Models
 */
gltfLoader.load(
    '/models/LeePerrySmith/LeePerrySmith.glb',
    (gltf) =>
    {
        // Model
        const mesh = gltf.scene.children[0]
        mesh.rotation.y = Math.PI * 0.5
        mesh.material = material
        mesh.customDepthMaterial = depthMaterial;
        scene.add(mesh)

        // Update materials
        updateAllMaterials()
    }
)

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, - 2.25)
scene.add(directionalLight)
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 1, - 4);
scene.add(camera);

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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// ANimate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    customUniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()