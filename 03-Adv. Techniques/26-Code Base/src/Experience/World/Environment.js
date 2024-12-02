import * as THREE from 'three';
import Experience from "../Experience";

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        if(this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Environment')
        }

        this.initSunlight();
        this.setEnvMap();
    }

    initSunlight = () => {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, -1.25)
        this.scene.add(this.sunLight);

        if(this.debug.active) {
            this.debugFolder.add(this.sunLight, 'intensity', 0, 10, 0.001).name('sunlight Intensity');
            this.debugFolder.add(this.sunLight.position, 'x', -5, 5, 0.001).name('sunlightX');
            this.debugFolder.add(this.sunLight.position, 'y', -5, 5, 0.001).name('sunlightY');
            this.debugFolder.add(this.sunLight.position, 'z', -5, 5, 0.001).name('sunlightZ');
        }
    }

    setEnvMap = () => {
        this.environmentMap = {};
        this.environmentMap.intensity = 0.4;
        this.environmentMap.texture = this.resources.items.environmentMapTexture;
        this.environmentMap.encoding = THREE.sRGBEncoding;
        this.environmentMap.updateMaterial = () => {
            this.scene.traverse((child) => {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity = this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            })
        }

        if(this.debug.active) {
            this.debugFolder.add(this.environmentMap, 'intensity', 0, 4, 0.001).name('envMapIntensity').onFinishChange(this.environmentMap.updateMaterial)
        }

        this.scene.environment = this.environmentMap.texture;
        this.environmentMap.updateMaterial();

    }
}