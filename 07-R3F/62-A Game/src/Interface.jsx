import { useKeyboardControls } from "@react-three/drei";
import useGame from "./stores/useGame";
import { useEffect, useRef } from "react";
import { addEffect } from "@react-three/fiber";


const Interface = () => {

    const timeRef = useRef();

    const forward = useKeyboardControls((state) => state.forward);
    const backward = useKeyboardControls((state) => state.backward);
    const leftward = useKeyboardControls((state) => state.leftward);
    const rightward = useKeyboardControls((state) => state.rightward);
    const space = useKeyboardControls((state) => state.jump);

    const phase = useGame((state) => state.phase);
    const restart = useGame((state) => state.restart);

    const unsubscribeAddEffect = useEffect(() => {
        addEffect(() => {
            const state = useGame.getState();

            let elapsedTime = 0;

            if (state.phase === "playing") {
                elapsedTime = Date.now() - state.startTime;
            } else if (state.phase === "ended") {
                elapsedTime = state.endTime - state.startTime;
            }

            elapsedTime /= 1000;
            elapsedTime = elapsedTime.toFixed(2);

            if (timeRef.current) {
                timeRef.current.textContent = elapsedTime;
            }

        });

        return () => {
            unsubscribeAddEffect && unsubscribeAddEffect();
        }

    }, [])

    return (
        <div className="interface">

            <div className="time" ref={timeRef}>0.00</div>

            {phase === "ended" && <div className="restart" onClick={restart}>Restart</div>}

            <div className="controls">
                <div className="raw">
                    <div className={`key ${forward ? "active" : ""} `}></div>
                </div>
                <div className="raw">
                    <div className={`key ${leftward ? "active" : ""} `}></div>
                    <div className={`key ${backward ? "active" : ""} `}></div>
                    <div className={`key ${rightward ? "active" : ""} `}></div>
                </div>
                <div className="raw">
                    <div className={`key ${space ? "active" : ""} large`}></div>
                </div>
            </div>

        </div>
    )
}

export default Interface;