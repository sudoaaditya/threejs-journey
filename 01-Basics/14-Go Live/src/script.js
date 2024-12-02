import './style.css';
import * as THREE from 'three';
import  { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//font loader
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// font geo
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

/* GSAP */
import gsap from 'gsap';
//gsap.to(camera.position, {duration: 1, delay: 1, z: -camera.position.z})

/* EVENT LISTENER */
const cursor = {
    x: 0,
    y: 1
}
let meshArray = [];
let matCapEleArr = [];
let activematCap = 8;
let mat;

window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / sizes.width - 0.5;
    cursor.y = - (e.clientY / sizes.height - 0.5);
})

// Canvas
const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

/* Textures & Fonts */
const texLoader = new THREE.TextureLoader();
let mapcatTexture = texLoader.load('/textures/matcaps/8.png');

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

        mat = new THREE.MeshMatcapMaterial({ matcap: mapcatTexture});
        const text = new THREE.Mesh(textGeo, mat);
        scene.add(text);

        const donutGeo = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
        const cubeGeo = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);

        for(var i = 0; i< 260; i++) {
            
            const donut = new THREE.Mesh(donutGeo, mat);
            meshArray.push(donut);

            donut.position.x = ((Math.random() - 0.5) * 15);
            donut.position.y = ((Math.random() - 0.5) * 15);
            donut.position.z = ((Math.random() - 0.5) * 15);

            donut.rotation.x = Math.random() * Math.PI;
            donut.rotation.z = Math.random() * Math.PI;

            const scale = Math.random()
            donut.scale.set(scale, scale, scale);
            scene.add(donut);

            if(i%2 === 0) {
                //cubes
                const cube = new THREE.Mesh(cubeGeo, mat);
                meshArray.push(cube);

                cube.position.x = ((Math.random() - 0.5) * 15);
                cube.position.y = ((Math.random() - 0.5) * 15);
                cube.position.z = ((Math.random() - 0.5) * 15);

                cube.rotation.x = Math.random() * Math.PI;
                cube.rotation.z = Math.random() * Math.PI;

                const scale2 = Math.random()
                cube.scale.set(scale2, scale2, scale2);

                scene.add(cube);
            }

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
camera.position.set(1, 1, 6);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 10;
controls.enableZoom = false;
controls.enablePan = false;

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

    update(elapsedTime);

    gsap.to(camera.position, {duration: 1, delay: 0.5, x: cursor.x*3})
    gsap.to(camera.position, {duration: 1, delay: 0.5, y: cursor.x*4})
    gsap.to(camera.position, {duration: 1, delay: 0.5, z: cursor.y*5})

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

const update = (time) => {
    meshArray.forEach((mesh, index) => {
        // mesh.rotation.x = Math.random() * Math.PI * 0.02;
        if(index %2 === 0) mesh.rotation.x = time - (0.9 * index) * Math.PI
        else mesh.rotation.y = time  - (0.2 * index) * Math.PI
    })
}

const createUI = () => {
    const maiDiv = document.createElement('div');
    maiDiv.className = "matcapCont";

    for (let i = 1; i <= 8; i++) {
        const element = document.createElement('span');
        element.className = `matcapSpan matcap-${i} ${i === activematCap ? "active" : ""}`;
        element.id = i;
        element.onclick = invokeMatChange;
        maiDiv.appendChild(element);
        matCapEleArr.push(element);
    }

    document.body.appendChild(maiDiv);

}

const invokeMatChange = (e) => {
    var indx = Number(e.target.id);
    if(activematCap !== indx) {
        activematCap = indx;
        mapcatTexture = texLoader.load(`/textures/matcaps/${indx}.png`);
        mat.matcap = mapcatTexture;
        mat.needsUpdate = true;
        updateClassList();
    }
}

const updateClassList = () => {
    matCapEleArr.forEach((ele, index) => {
        if(index+1 === activematCap) {
            ele.className = `matcapSpan matcap-${index+1} active`;
        } else {
            ele.className = `matcapSpan matcap-${index+1}`;
        }
    })
}

tick();
createUI();
