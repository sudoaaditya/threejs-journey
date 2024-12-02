const scene = new THREE.Scene();

//Create Cube
const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial({color: "#ffff00"});
const cube = new THREE.Mesh(geo, mat);
scene.add(cube);


//Sizes
const sizes = {
    width: 800,
    height: 600
};

// Cube
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height);
camera.position.set(0, 0, 3)
scene.add(camera);


// RENDERER
const canvas = document.getElementById("webgl-canvas")
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);




