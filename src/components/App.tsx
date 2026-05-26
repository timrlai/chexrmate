import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { XR, createXRStore } from "@react-three/xr";
import { Box3 } from "three";
import Intersectable from "./Intersectable";
import Draggable from "./Draggable";
import Model from "./Model";

const store = createXRStore();

export default function App() {
  const [box, setBox] = useState<Box3 | null>(null);
  const [red, setRed] = useState(false);

  return (
    <main>
      <nav id="xr-button-container">
        {/* <button onClick={() => store.enterAR()}>Enter AR</button> */}
        <button
          onClick={() => store.enterVR()}
          className="special-gothic-condensed-one-regular"
        >
          Enter VR
        </button>
      </nav>
      <Canvas>
        <XR store={store}>
          <Suspense fallback={null}>
            <Intersectable
              position={[-2, 1, -1]}
              box={box}
              onIntersect={() => setRed(true)}
            >
              <mesh>
                <boxGeometry />
                <meshBasicMaterial color={red ? "red" : "blue"} />
              </mesh>
            </Intersectable>
            <Draggable position={[2, 1, -1]} onDragged={(box) => setBox(box)}>
              <mesh>
                <boxGeometry />
                <meshBasicMaterial color="red" />
              </mesh>
            </Draggable>
            <Model />

            <OrbitControls />
          </Suspense>
        </XR>
      </Canvas>
    </main>
  );
}
