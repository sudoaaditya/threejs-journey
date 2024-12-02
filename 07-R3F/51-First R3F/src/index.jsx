import './style.css'
import ReactDOM from 'react-dom/client';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience';

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <Canvas
        // dpr={[1, 2]} // this is the default one by r3f
        camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [3, 2, 6]
        }}
        gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace
        }}
    // flat // flat tome mapping
    >
        <Experience />
    </Canvas>
)