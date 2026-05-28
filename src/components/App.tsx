import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { XR, createXRStore } from "@react-three/xr";
import Board from "./Board";
import Opponent from "./Opponent";
import Locomotion from "./Locomotion";

const store = createXRStore({
  controller: { rayPointer: { rayModel: { color: "#065f74" } } },
});

export default function App() {
  return (
    <main>
      <header>
        <h1>CheXRmate</h1>
      </header>
      <nav id="xr-button-container">
        <button
          onClick={() => store.enterAR()}
          className="special-gothic-condensed-one-regular"
        >
          Enter AR
        </button>
      </nav>
      <Canvas shadows>
        <XR store={store}>
          <Suspense fallback={null}>
            <Opponent />

            <Board />

            <ambientLight
              position={[0, 10, -12]}
              color="pink"
              intensity={0.6}
              castShadow
            />
            <directionalLight
              position={[3, 8, -10]}
              color="lightyellow"
              intensity={0.7}
              castShadow
            />

            <Environment preset="park" environmentIntensity={0.5} />

            <Locomotion />

            <OrbitControls />
          </Suspense>
        </XR>
      </Canvas>
    </main>
  );
}
