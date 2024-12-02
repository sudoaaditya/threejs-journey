import { TransformControls, OrbitControls, PivotControls, Html, Text, Float, MeshReflectorMaterial } from '@react-three/drei';
import { useRef } from 'react';

export default function Experience() {

    const cubeRef = useRef();
    const sphereRef = useRef();

    return (
        <>
            <OrbitControls makeDefault />

            <directionalLight position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <PivotControls
                anchor={[0, 0, 0]}
                depthTest={false}
                lineWidth={3}
                axisColors={['#9381FF', '#FF4D6D', '#7AE582']}
            // scale={2}
            >
                <mesh position-x={-2} ref={sphereRef}>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                    <Html
                        position={[1, 1, 0]}
                        wrapperClass='label'
                        center
                        distanceFactor={6}
                        occlude={[sphereRef, cubeRef]}
                    >This is me trying!</Html>
                </mesh>
            </PivotControls>

            <mesh position-x={2} scale={1.5} ref={cubeRef}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>

            <mesh position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
                <planeGeometry />
                {/* <meshStandardMaterial color="greenyellow" /> */}
                <MeshReflectorMaterial
                    resolution={512}
                    blur={[1000, 1000]}
                    mixBlur={1}
                    mirror={0.5}
                    color="greenyellow"
                />
            </mesh>

            <Float
                speed={5}
                floatIntensity={2}
            >
                <Text
                    font="./bangers-v20-latin-regular.woff"
                    color='salmon'
                    position-y={2}
                    maxWidth={2}
                    textAlign='center'
                >
                    I Love R3F
                </Text>
            </Float>

            <TransformControls object={cubeRef} />

        </>
    )

}
