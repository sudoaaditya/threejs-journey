import * as THREE from 'three';
// loader
import { GLTFLoader } from'three/examples/jsm/loaders/GLTFLoader';
import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter {


    constructor(sources) {
        super();

        this.sources = sources;

        this.items = {};
        this.toLoad = this.sources.length;//
        this.loaded = 0;
        this.loaders = {};

        this.setLoaders();
        this.startLoading();
    }

    setLoaders = () => {
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.texLoader = new THREE.TextureLoader();
        this.loaders.cubeTexLoader = new THREE.CubeTextureLoader();
    }

    startLoading = () => {
        for(const source of this.sources) {
            if(source.type === 'texture') {
                this.loaders.texLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);
                    }
                )
            } else if(source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);
                    }
                )
            } else if(source.type === 'cubeTexture') {
                this.loaders.cubeTexLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);
                    }
                )
            }
        }
    }

    sourceLoaded = (source, file) => {
        this.items[source.name] = file;
        this.loaded++;

        if(this.loaded === this.toLoad) {
            this.trigger('ready');
        }
    }

}