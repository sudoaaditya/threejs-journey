import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useGLTF, Float, Text } from '@react-three/drei';

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floorMaterial = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

export const BlockStart = ({ position = [0, 0, 0] }) => {
    return (
        <group position={position}>
            <Float floatIntensity={0.25} rotationIntensity={0.25}>
                <Text
                    font='/bebas-neue-v9-latin-regular.woff'
                    scale={0.5}
                    maxWidth={0.25}
                    lineHeight={0.75}
                    textAlign='right'
                    position={[0.75, 0.65, 0]}
                    rotation-y={-0.25}
                >
                    Marble Race
                    <meshBasicMaterial toneMapped={false} />
                </Text>
            </Float>
            <mesh
                geometry={boxGeometry}
                material={floorMaterial}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />
        </group>
    );
}

export const BlockSpinnerTrap = ({ position = [0, 0, 0] }) => {

    const spinner = useRef();
    const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1))

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        spinner.current.setNextKinematicRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, time * speed, 0)));
    });


    return (
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />

            <RigidBody
                ref={spinner}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[3.5, 0.3, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    )
}

export const BlockSlidingTrap = ({ position = [0, 0, 0] }) => {

    const spinner = useRef();
    const [timeOffset] = useState(() => Math.random() + 0.2 * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const y = Math.sin(time * timeOffset) + 1.15;
        spinner.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] });
    });


    return (
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />

            <RigidBody
                ref={spinner}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[3.5, 0.3, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    )
}

export const BlockJumpingTrap = ({ position = [0, 0, 0] }) => {

    const spinner = useRef();
    const [timeOffset] = useState(() => Math.random() + 0.2 * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const x = Math.sin(time * timeOffset) * 1.25;
        spinner.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.75, z: position[2] });
    });


    return (
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />

            <RigidBody
                ref={spinner}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[1.5, 1.5, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    )
}

export const BlockEnd = ({ position = [0, 0, 0] }) => {

    const hamburger = useGLTF('/hamburger.glb');

    hamburger.scene.children.forEach(child => child.castShadow = true)

    return (
        <group position={position}>
            <Text
                font='/bebas-neue-v9-latin-regular.woff'
                scale={1}
                position={[0, 2.25, 2]}
            >
                FINISH
                <meshBasicMaterial toneMapped={false} />
            </Text>
            <mesh
                geometry={boxGeometry}
                material={floorMaterial}
                position={[0, 0, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />

            <RigidBody type='fixed' colliders="hull" position={[0, 0.25, 0]} restitution={0.2} friction={0}>
                <primitive object={hamburger.scene} scale={0.2} />
            </RigidBody>
        </group>
    );
}

export const Bounds = ({ length = 1 }) => {
    return (
        <RigidBody type='fixed' restitution={0.2} friction={0}>
            <mesh
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, length * 4]}
                position={[2.15, 0.75, - (length * 2) + 2]}
                castShadow
            />

            <mesh
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, length * 4]}
                position={[-2.15, 0.75, - (length * 2) + 2]}
                receiveShadow
            />

            <mesh
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[4, 1.5, 0.3]}
                position={[0, 0.75, - (length * 4) + 2]}
                receiveShadow
            />

            <CuboidCollider
                args={[2, 0.1, 2 * length]}
                position={[0, -0.1, - (length * 2) + 2]}
                restitution={0.2}
                friction={1}
            />
        </RigidBody>
    );
}

export const Level = ({
    count = 5,
    types = [BlockSpinnerTrap, BlockSlidingTrap, BlockJumpingTrap],
    seed = 0
}) => {

    const traps = useMemo(() => {
        const traps = [];
        for (let i = 0; i < count; i++) {
            traps.push(types[Math.floor(Math.random() * types.length)]);
        }
        return traps;
    }, [count, types, seed]);

    return (
        <>
            <BlockStart position={[0, 0, 0]} />
            {traps.map((Block, index) => <Block key={index} position={[0, 0, - (index + 1) * 4]} />)}
            <BlockEnd position={[0, 0, - (count + 1) * 4]} />
            <Bounds length={count + 2} />
        </>
    )
}