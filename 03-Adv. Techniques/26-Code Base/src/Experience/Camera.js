import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//Comp
import Experience from "./Experience";

export default class Camera {
    
    constructor() {
        
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.canvas = this.experience.canvas;
        this.scene = this.experience.scene;

        this.initInstance();
        this.initOrbitControls();
    }
    

    initInstance = () => {
        this.instance = new THREE.PerspectiveCamera(
            35, 
            this.sizes.width / this.sizes.height,
            0.1,
            1000
        );
        this.instance.position.set(6, 4, 8);
        this.scene.add(this.instance);
    }

    initOrbitControls = () => {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
    }

    resize = () => {
        this.instance.aspect = this.sizes.width/this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update = () => {
        this.controls.update();
    }
}