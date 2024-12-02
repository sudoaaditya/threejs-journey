import { Center, OrbitControls, Text3D, useMatcapTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Perf } from 'r3f-perf'
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32);
const material = new THREE.MeshMatcapMaterial();

export default function Experience() {

    // const donutGroup = useRef();

    const donuts = useRef([]);

    const [mapCapTex] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256);

    // const [torusGeometry, setTorusGeometry] = useState();
    // const [material, setMaterial] = useState();

    useEffect(() => {
        mapCapTex.colorSpace = THREE.SRGBColorSpace;
        mapCapTex.needsUpdate = true;

        material.matcap = mapCapTex;
        material.needsUpdate = true;
    }, [])

    useFrame((state, delta) => {
        /* for (const donut of donutGroup.current.children) {
            donut.rotation.y += delta * 0.1;
        } */
        for (const donut of donuts.current) {
            donut.rotation.y += delta * 0.5;
        }
    })

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        {/* <torusGeometry ref={setTorusGeometry} args={[1, 0.6, 16, 32]} /> */}
        {/* <meshMatcapMaterial ref={setMaterial} matcap={mapCapTex} /> */}

        {/* <mesh scale={ 1.5 }>
            <boxGeometry />
            <meshNormalMaterial />
        </mesh> */}

        <Center>
            <Text3D
                font="./fonts/helvetiker_regular.typeface.json"
                size={0.75}
                height={0.2}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelSegments={5}
                material={material}
            >
                Hello R3F
            </Text3D>
        </Center>

        {/* <group ref={donutGroup}> */}
            {[...Array(100)].map((_, index) =>
                <mesh
                    key={index}
                    ref={(element) => donuts.current[index] = element }
                    position={[
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10
                    ]}
                    scale={(Math.random() * 0.2 + 0.2)}
                    rotation={[
                        Math.random() * Math.PI,
                        Math.random() * Math.PI,
                        0
                    ]}
                    geometry={torusGeometry}
                    material={material}
                />
            )}
        {/* </group> */}


    </>
}