import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { EffectComposer, Vignette, ToneMapping, Glitch, Noise, Bloom, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { useRef } from 'react';
import Drunk from './Drunk';
import { useControls } from 'leva';

export default function Experience() {
    const drunkRef = useRef();

    const { frequency, amplitude} = useControls('DrunkEffect', {
        frequency: {value: 2, min: 1, max: 50, step: 0.5},
        amplitude: {value: 0.1, min: 0, max: 1, step: 0.01},
    })

    return <>

        <color args={['#ffffff']} attach='background' />

        <Perf position="top-left" />

        <EffectComposer disableNormalPass multisampling={4}>
            {/* <Vignette
                offset={0.3}
                darkness={0.9}
                blendFunction={BlendFunction.NORMAL}
            /> */}
            {/* <ToneMapping /> */}

            {/* <Glitch
                delay={[0.5, 1]}
                duration={[0.1, 0.3]}
                strength={[0.2, 0.4]}
                mode={GlitchMode.CONSTANT_MILD}
            /> */}

            {/* <Noise
                premultiply
                blendFunction={BlendFunction.SOFT_LIGHT}
            /> */}

            {/* <Bloom 
                intensity={0.5}
                luminanceThreshold={ 1.1 } 
                mipmapBlur
            /> */}

            {/* <DepthOfField 
                focusDistance={0.025}
                focalLength={0.025}
                bokehScale={6}
            /> */}
            <Drunk
                ref={drunkRef}
                frequency={frequency}
                amplitude={amplitude}
                // blendFunction={BlendFunction.DARKEN}
            />
        </EffectComposer>

        <OrbitControls makeDefault />

        <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
        <ambientLight intensity={1.5} />

        <mesh castShadow position-x={- 2}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh castShadow position-x={2} scale={1.5}>
            <boxGeometry />
            {/* <meshStandardMaterial color="white" emissive="orange" emissiveIntensity={2} toneMapped={false} /> */}
            {/* <meshBasicMaterial color={[1.5, 1, 4]} toneMapped={false} /> */}
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh receiveShadow position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

    </>
}