import { OrbitControls, useGLTF } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { /* BallCollider, */  CuboidCollider, CylinderCollider, InstancedRigidBodies, Physics, RigidBody } from '@react-three/rapier';
import { /* useEffect, */ useMemo, useRef, /* useState */ } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Experience() {

    const cube = useRef();
    const twister = useRef();
    // const instancedMeshRef = useRef();

    const cubeCount = 100;

    // const [hitSound] = useState(() => new Audio('/hit.mp3'));

    const model = useGLTF('/hamburger.glb');

    /* useEffect(() => { //InstancedRigidBodies takes care of passing matrices to instancedMesh 
        for (var i = 0; i < cubeCount; i++) {

            const matrix = new THREE.Matrix4();
            matrix.compose(
                new THREE.Vector3(i * 2, 0, 0),
                new THREE.Quaternion(),
                new THREE.Vector3(1, 1, 1)
            )
            instancedMeshRef.current.setMatrixAt(i, matrix)
        }
    }, []); */

    const instances = useMemo(() => {
        const instances = [];

        for (let i = 0; i < cubeCount; i++) {
            instances.push({
                key: `instances_${i}`,
                position: [
                    (Math.random() - 0.5) * 8,
                    6 + i * 0.2,
                    (Math.random() - 0.5) * 8
                ],
                rotation: [Math.random(), Math.random(), Math.random()]
            })
        }

        return instances;
    })

    const handleCubeJump = () => {
        // console.log("CLICKED CUBE");
        const mass = cube.current.mass();
        cube.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 });
        // cube.current.applyTorqueImpulse({ x: 0, y: 1, z: 0 });
        cube.current.applyTorqueImpulse({
            x: Math.random() - 0.5,
            y: Math.random() - 0.5,
            z: Math.random() - 0.5
        });
    }

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (time) {
            const eulerRot = new THREE.Euler(0, time, 0);
            const quatRot = new THREE.Quaternion().setFromEuler(eulerRot);

            twister.current.setNextKinematicRotation(quatRot);

            const angle = time * 0.8;
            const x = Math.sin(angle);
            const z = Math.cos(angle);

            twister.current.setNextKinematicTranslation({ x, y: -0.8, z })
        }

    })

    const collisionEnter = () => {
        // console.log("Collided");

        // hitSound.currentTime = 0;
        // hitSound.volume = Math.random();
        // hitSound.play();

    }

    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />
            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <Physics debug={false} gravity={[0, -9.8, 0]}>
                <RigidBody colliders="ball">
                    <mesh castShadow position={[-1.5, 4, 0]}>
                        <sphereGeometry />
                        <meshStandardMaterial color="orange" />
                    </mesh>
                </RigidBody>

                <RigidBody
                    position={[1.5, 4, 0]} ref={cube}
                    gravityScale={1}
                    restitution={1}
                    friction={0.7}
                    // colliders={false}
                    onCollisionEnter={collisionEnter}
                // onCollisionExit={() => console.log("Exit!")} 
                // onSleep={() => console.log("Sleep!")} 
                // onWake={() => console.log("Wake!")} 
                >
                    <mesh castShadow onClick={handleCubeJump}>
                        <boxGeometry /* args={[3, 2, 1]} */ />
                        <meshStandardMaterial color="mediumpurple" />
                    </mesh>
                    {/* <CuboidCollider args={[0.5, 0.5, 0.5]} /> */}
                </RigidBody>


                {/* <RigidBody colliders={false} position={[0, 1, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
                <CuboidCollider args={[1.5, 1.5, 0.5]} />
                <CuboidCollider
                    args={[0.25, 1, 0.25]}
                    position={[0, 0, 1]}
                    rotation={[Math.PI * 0.35, 0, 0]}
                /> 
                <BallCollider args={[1.5]} />
                <mesh castShadow >
                    <torusGeometry args={[1, 0.5, 16, 32]} />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </RigidBody> */}

                {/* <RigidBody >
                <mesh castShadow position={[2, 2, 0]}>
                    <boxGeometry args={[3, 2, 1]} />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
                <mesh castShadow position={[2, 2, 3]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </RigidBody> */}

                <RigidBody
                    type='fixed'
                    /* restitution={1} */
                    friction={0.7}

                >
                    <mesh receiveShadow position-y={- 1.25}>
                        <boxGeometry args={[10, 0.5, 10]} />
                        <meshStandardMaterial color="greenyellow" />
                    </mesh>
                </RigidBody>

                <RigidBody
                    ref={twister}
                    position={[0, - 0.8, 0]}
                    friction={0}
                    type="kinematicPosition"
                >
                    <mesh castShadow scale={[0.4, 0.4, 3]}>
                        <boxGeometry />
                        <meshStandardMaterial color="red" />
                    </mesh>
                </RigidBody>

                <RigidBody
                    position={[0, 4, 0]}
                    colliders={false}
                >
                    <primitive object={model.scene} scale={0.25} />
                    <CylinderCollider args={[0.5, 1.25]} />
                </RigidBody>

                <RigidBody type='fixed'>
                    <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
                    <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]} />
                    <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
                    <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]} />
                </RigidBody>

                <InstancedRigidBodies instances={instances}>
                    <instancedMesh /* ref={instancedMeshRef} */ castShadow args={[null, null, cubeCount]}>
                        <boxGeometry />
                        <meshStandardMaterial color="tomato" />
                    </instancedMesh>
                </InstancedRigidBodies>
            </Physics>
        </>
    )
}