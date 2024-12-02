import './style.css'
import * as THREE from 'three'
// orbit controls
import  { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// UI
const mainDiv = document.createElement('div');
let audio;
const loader = () => {
    mainDiv.className = "loaderDiv";

    const loaderContDiv = document.createElement('div');
    loaderContDiv.className = 'loaderContDiv';
    mainDiv.appendChild(loaderContDiv);

    const textSpan = document.createElement('span');
    textSpan.className = 'textSpan';
    textSpan.innerHTML = "Loading..."
    loaderContDiv.appendChild(textSpan)

    document.body.appendChild(mainDiv);
}

const playAudio = () => {
    audio.pause();
    audio.play();
}

const pauseAudio = () => {
    audio.play();
    audio.pause();
    
}

const createControlButtons = () => {
    const mainDiv = document.createElement('div');
    mainDiv.className = "controlsDiv"

    const btnPlay = document.createElement('span');
    btnPlay.className = "btnPlay";
    btnPlay.onclick = playAudio;
    mainDiv.appendChild(btnPlay);

    const btnPause = document.createElement('span');
    btnPause.className = "btnPause";
    btnPause.onclick = pauseAudio;
    mainDiv.appendChild(btnPause);

    document.body.appendChild(mainDiv);
}


// Canvas
const canvas = document.getElementById("webgl-canvas");

//Scene
const scene = new THREE.Scene();

//Fog
const fog = new THREE.Fog('#262837', 1, 15);
scene.fog = fog;

// Loader Manager
const loaderManager = new THREE.LoadingManager()
loaderManager.onStart = () => {
    loader();
}
loaderManager.onLoad = () => {
    document.body.removeChild(mainDiv);
    audio = new Audio('/sounds/Creepy_Wind.mp3');
    audio.muted = false;
    audio.autoplay = true;
    audio.loop = true;
    audio.play();
    createControlButtons();
}
loaderManager.onProgress = (e, c, t) => {
    mainDiv.style.opacity = 1 - (c/t);
}
loaderManager.onError = () => {
    console.log("onError");
}

// Textures
const texLoader = new THREE.TextureLoader(loaderManager);
const doorColorTexture = texLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = texLoader.load('/textures/door/alpha.jpg');
const doorAOTexture = texLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = texLoader.load('/textures/door/height.jpg');
const doorNormalTexture = texLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = texLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = texLoader.load('/textures/door/roughness.jpg');
// bricks
const bricksColorTexture = texLoader.load('/textures/bricks/color.jpg');
const bricksNormalTexture = texLoader.load('/textures/bricks/normal.jpg');
const bricksRoughnessTexture = texLoader.load('/textures/bricks/roughness.jpg');
const bricksAOTexture = texLoader.load('/textures/bricks/ambientOcclusion.jpg');

// grass
const grassColorTexture = texLoader.load('/textures/grass/color.jpg');
const grassNormalTexture = texLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = texLoader.load('/textures/grass/roughness.jpg');
const grassAOTexture = texLoader.load('/textures/grass/ambientOcclusion.jpg');
grassColorTexture.repeat.set(16, 16);
grassNormalTexture.repeat.set(16, 16);
grassRoughnessTexture.repeat.set(16, 16);
grassAOTexture.repeat.set(16, 16);
grassColorTexture.wrapS = grassColorTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapS = grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
grassAOTexture.wrapS = grassAOTexture.wrapT = THREE.RepeatWrapping;

//tombstone
let tombStoneTexts = [];
for(let i = 0; i <= 5; i++) {
    tombStoneTexts[i] =  texLoader.load(`/textures/tombstone/color${i}.jpg`);
    tombStoneTexts[i].wrapS = tombStoneTexts[i].wrapT = THREE.RepeatWrapping;
    tombStoneTexts[i].minFilter = THREE.NearestFilter;
    tombStoneTexts[i].generateMipmaps = false;
}


/* House Group */
const house = new THREE.Group();
scene.add(house);

// house walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ 
        map: bricksColorTexture,
        aoMap: bricksAOTexture,
        normalMap: bricksNormalTexture,
        roughness: bricksRoughnessTexture,
    })
);
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2));
walls.position.y = (2.5/2);
house.add(walls);

//  house roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45'})
);
roof.position.y = 3;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

//Door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({ 
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAOTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture

    })
);
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.set(0, 1, 2.01);
house.add(door);

// Bushes
const bushGeo = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMat = new THREE.MeshStandardMaterial({ color: '#89c854'});

const bush1 = new THREE.Mesh(bushGeo, bushMat);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeo, bushMat);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeo, bushMat);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.2, 2.2);

const bush4 = new THREE.Mesh(bushGeo, bushMat);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeo = new THREE.BoxBufferGeometry(0.6, 0.8, 0.1);


for( let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3.5 + Math.random() * 8;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const graveMat = new THREE.MeshStandardMaterial({
        map: tombStoneTexts[Math.floor(Math.random() *5)],
        roughness: 0.8
    });
    const grave = new THREE.Mesh( graveGeo, graveMat);
    grave.position.set(x, 0.3, z);
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.castShadow = true;
    graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({ 
        map: grassColorTexture,
        aoMap: grassAOTexture,
        normalMap: grassNormalTexture,
        roughness: grassRoughnessTexture,
    })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0;
scene.add(floor)

// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.13)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.13)
moonLight.position.set(4, 5, - 2)
scene.add(moonLight);


const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);


// ghosts
const ghostOne = new THREE.PointLight('#ff9329', 2, 3);
scene.add(ghostOne);

const ghostTwo = new THREE.PointLight('#00ffff', 2, 3);
scene.add(ghostTwo);

const ghostThree = new THREE.PointLight('#ffff00', 2, 3);
scene.add(ghostThree);

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, (sizes.width/sizes.height), 0.1, 1000);
camera.position.set(4, 2, 5);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 10;
controls.minDistance = 4;
controls.maxPolarAngle = Math.PI * 0.45;

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor('#262837');
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* Shadows */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
ghostOne.castShadow = true;
ghostTwo.castShadow = true;
ghostThree.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghostOne.shadow.mapSize.width = 256;
ghostOne.shadow.mapSize.height = 256;
ghostOne.shadow.camera.far = 7;

ghostTwo.shadow.mapSize.width = 256;
ghostTwo.shadow.mapSize.height = 256;
ghostTwo.shadow.camera.far = 7;

ghostThree.shadow.mapSize.width = 256;
ghostThree.shadow.mapSize.height = 256;
ghostThree.shadow.camera.far = 7;


const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // ghost 1
    const gAngle = elapsedTime * 0.5;
    ghostOne.position.x = Math.cos(gAngle) * 6;
    ghostOne.position.z = Math.sin(gAngle) * 6;
    ghostOne.position.y = Math.sin(elapsedTime * 3);

    // ghost 2
    const gAngle2 = -elapsedTime * 0.32;
    ghostTwo.position.x = Math.cos(gAngle2) * 4;
    ghostTwo.position.z = Math.sin(gAngle2) * 4;
    ghostTwo.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    // ghost 3
    const gAngle3 = -elapsedTime * 0.18;
    ghostThree.position.x = Math.cos(gAngle3) * (7 + Math.sin(elapsedTime * 0.32));
    ghostThree.position.z = Math.sin(gAngle3) * (7 + Math.sin(elapsedTime * 0.5));
    ghostThree.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()