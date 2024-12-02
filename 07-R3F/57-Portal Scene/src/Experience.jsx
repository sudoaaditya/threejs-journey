import { useRef } from 'react';
import { Center, OrbitControls, Sparkles, useGLTF, useTexture, shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import portalVertexSahder from './shaders/portal/vertex.glsl';
import portalFragmentSahder from './shaders/portal/fragment.glsl';

const PortalMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorStart: new THREE.Color('#ffffff'),
        uColorEnd: new THREE.Color('#000000'),
    },
    portalVertexSahder,
    portalFragmentSahder
);

extend({ PortalMaterial });

export default function Experience() {

    const portalRef = useRef();

    const { nodes } = useGLTF('./model/portal.glb');
    const bakedTexture = useTexture('./model/baked.jpg');
    // bakedTexture.flipY = false;

    useFrame((_, delta) => {
        portalRef.current.uTime += delta * 2;
    })

    return <>

        <color args={['#201919']} attach='background' />

        <OrbitControls makeDefault />

        <Center>
            <mesh geometry={nodes.baked.geometry} >
                <meshBasicMaterial map={bakedTexture} map-flipY={false} />
            </mesh>

            <mesh
                geometry={nodes.poleLightA.geometry}
                position={nodes.poleLightA.position}
                rotation={nodes.poleLightA.rotation}
                scale={nodes.poleLightA.scale}
            >
                <meshBasicMaterial color="#ffffe5" />
            </mesh>

            <mesh
                geometry={nodes.poleLightB.geometry}
                position={nodes.poleLightB.position}
                rotation={nodes.poleLightB.rotation}
                scale={nodes.poleLightB.scale}
            >
                <meshBasicMaterial color="#ffffe5" />
            </mesh>

            <mesh
                geometry={nodes.portalLight.geometry}
                position={nodes.portalLight.position}
                rotation={nodes.portalLight.rotation}
                scale={nodes.portalLight.scale}
            >
                {/* <shaderMaterial
                    vertexShader={portalVertexSahder}
                    fragmentShader={portalFragmentSahder}
                    uniforms={{
                        uTime: { value: 0 },
                        uColorStart: { value: new THREE.Color('#ffffff') },
                        uColorEnd: { value: new THREE.Color('#000000') },
                    }}
                /> */}
                <portalMaterial ref={portalRef} />
            </mesh>

            <Sparkles
                size={6}
                scale={[4, 2, 4]}
                position-y={1}
                speed={0.2}
                count={40}
            />
        </Center>

    </>
}