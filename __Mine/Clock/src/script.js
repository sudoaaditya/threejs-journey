import './style.css';
import * as THREE from 'three';
import  { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//font loader
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// font geo
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

/* // Import Shaders
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl'; */

// Debug

// Canvas
const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

/* Textures & Fonts */
const texLoader = new THREE.TextureLoader();
const fontLoader = new FontLoader();


// setup Circle Geometry
const clockPerimeterGeo = new THREE.BufferGeometry();
const SIZE = 9425;
const circlePostition = new Float32Array(SIZE * 3);
let traverseIndx = 0, steps = 0;
for(let i = 0.0; i < 3 * Math.PI; i+= 0.001) {
    circlePostition[traverseIndx++] = Math.cos(i) * 2.0;
    circlePostition[traverseIndx++] = Math.sin(i) * 2.0;
    circlePostition[traverseIndx++] = 0;
}

clockPerimeterGeo.setAttribute('position', new THREE.BufferAttribute(circlePostition, 3));
const clockPerimeterMat = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    color: '#9f8c7e'
});
const clockPerimeter = new THREE.Points(clockPerimeterGeo, clockPerimeterMat);
scene.add(clockPerimeter);

// Now clock timers
const digitsArray = ['XII', 'XI', 'X', 'IX', 'VIII', 'VII', 'VI', 'V', 'IV', 'III', 'II', 'I' ];
for(let i1 = Math.PI / 2; i1 < 2.5 * Math.PI; i1 += Math.PI/6) {
    
    const outerX = Math.cos(i1) * 1.6;
    const outerY = Math.sin(i1) * 1.6;

    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    
        const textGeo = new TextGeometry(
            digitsArray[steps++], 
            {
                font: font,
                size: 0.3,
                height: 0.1,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.0001,
                bevelSize: 0.00002,
                bevelOffset: 0,
                bevelSegments: 2
            }
        );

        textGeo.center();
        const mat = new THREE.MeshBasicMaterial({ color: '#9f8c7e' });
        const text = new THREE.Mesh(textGeo, mat);
        text.position.set(outerX, outerY, 0);
        scene.add(text);

    });
}
/* 
const hourHand = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(0.1, 0.8),
    new THREE.MeshBasicMaterial({ 
        color: '#e73e14',
        side: THREE.DoubleSide
    })
)
hourHand.position.set(0, 0.4, -0.1)
scene.add(hourHand);

const minuteHand = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(0.09, 1),
    new THREE.MeshBasicMaterial({ 
        color: '#00ff9d',
        side: THREE.DoubleSide
    })
)
minuteHand.position.set(0, 0.5, 0.0);
scene.add(minuteHand);

const secondHand = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(0.09, 1.2),
    new THREE.MeshBasicMaterial({ 
        color: '#2466c9',
        side: THREE.DoubleSide
    })
)
secondHand.position.set(0, 0.6, 0.1)
scene.add(secondHand); */


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
camera.position.set(0, 0, 4.5);
scene.add(camera);

/* const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; */

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

    /* // Update controls
    controls.update() */

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
