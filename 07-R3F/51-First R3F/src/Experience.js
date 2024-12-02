import { useRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import CustomObject from "./CustomObject";

extend({ OrbitControls })

export default function Experience() {

    const { camera, gl } = useThree();

    const cubeRef = useRef();
    const groupRef = useRef();

    useFrame((state, delta) => {

        /* const angle = state.clock.elapsedTime;
        state.camera.position.x = 8 * Math.sin(angle);
        state.camera.position.z = 8 *Math.cos(angle);
        state.camera.lookAt(0, 0, 0) */

        cubeRef.current.rotation.y += delta;
        // groupRef.current.rotation.y += delta;
    })

    return (
        <>
            <orbitControls args={[camera, gl.domElement]} />
            <directionalLight position={[1, 2, 3]} intensity={1.5}/>
            <ambientLight intensity={1.5} />

            <group ref={groupRef}>
                <mesh scale={1.5} position-x={3} rotation-y={Math.PI * 0.25} ref={cubeRef}>
                    {/* <torusKnotGeometry />
                        <meshNormalMaterial /> */}
                    {/* <sphereGeometry args={[1.5, 32, 32]} /> */}
                    <boxGeometry />
                    <meshStandardMaterial color='mediumpurple' />
                </mesh>

                <mesh scale={1.5} position={[-3, 0, 0]}>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </group>

            <mesh position={[0, -2, 0]} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshStandardMaterial color='greenyellow' />
            </mesh>

            <CustomObject />
        </>
    )
}