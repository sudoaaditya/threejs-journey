// import { OrbitControls } from '@react-three/drei';
import Lights from './Lights.jsx';
import { Level } from './Level.js';

import { Physics } from "@react-three/rapier";
import { Player } from './Player.js';

import useGame from './stores/useGame.js';

export default function Experience() {

    const blocksCount = useGame((state) => state.blocksCount);
    const blockSeed = useGame((state) => state.blockSeed);

    return <>

        {/* <OrbitControls makeDefault /> */}

        <color args={["#bdedfc"]} attach="background" />

        <Physics /* debug */>
            <Lights />
            <Level count={blocksCount} seed={blockSeed} />
            <Player />
        </Physics>

    </>
}