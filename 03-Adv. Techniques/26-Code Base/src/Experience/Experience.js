//three
import * as THREE from 'three';
//components
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';
import Resources from './Utils/Resources';
import sources from './sources';
import Debug from './Utils/Debug';

//singleton obj
let instance = null;
class Experience {

    constructor(canvas) {

        if(instance) return instance;

        instance = this;
        
        this.debug = new Debug();
        this.canvas = canvas;
        this.sizes = new Sizes();
        this.time = new Time();

        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();

        this.sizes.on('resize', this.resize);
        this.time.on('tick', this.update);

        // global vars
        window.experience = this;
    }

    resize = () => {
        this.camera.resize();
        this.renderer.resize();
    }
    
    update = () => {
        this.camera.update();
        this.renderer.update();
        this.world.update();
    }

    destroy = () => {
        this.sizes.off('resize');
        this.time.off('tick');

        this.scene.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                child.geometry.dispose();
                for(const key in child.material) {
                    const value = child.material[key];
                    if(value && typeof value === 'function') {
                        value.dispose();
                    }
                }
            }
        });

        this.camera.controls.dispose();
        this.renderer.instance.dispose();

        if(this.debug.active) {
            this.debug.ui.destroy();
        }
    }
}

export default Experience;