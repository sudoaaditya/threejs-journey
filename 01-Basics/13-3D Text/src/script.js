import './style.css';
import * as THREE from 'three';
import  { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//font loader
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// font geo
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import * as dat from 'dat.gui';

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

/* Textures & Fonts */
const texLoader = new THREE.TextureLoader();
const mapcatTexture = texLoader.load('/textures/matcaps/8.png');

const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    
    const textGeo = new TextGeometry(
        "Forever Winter", 
        {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4
        });

        /* textGeo.computeBoundingBox();
        textGeo.translate(
            - (textGeo.boundingBox.max.x - 0.02) * 0.5,
            - (textGeo.boundingBox.max.y - 0.02) * 0.5,
            - (textGeo.boundingBox.max.z - 0.03) * 0.5,
        ) */

        textGeo.center();

        const mat = new THREE.MeshMatcapMaterial({ matcap: mapcatTexture});
        const text = new THREE.Mesh(textGeo, mat);
        scene.add(text);

        const donutGeo = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);

        for(var i = 0; i< 300; i++) {
            
            const donut = new THREE.Mesh(donutGeo, mat);

            donut.position.x = ((Math.random() - 0.5) * 15);
            donut.position.y = ((Math.random() - 0.5) * 15);
            donut.position.z = ((Math.random() - 0.5) * 15);

            donut.rotation.x = Math.random() * Math.PI;
            donut.rotation.z = Math.random() * Math.PI;

            const scale = Math.random()
            donut.scale.set(scale, scale, scale);

            scene.add(donut);

        }
})

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
