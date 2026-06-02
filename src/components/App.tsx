import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import type { XRStore } from "@react-three/xr";
import type { FontFamilies } from "@react-three/uikit";

import Board from "./Board";
import Opponent from "./Opponent";
import Locomotion from "./Locomotion";
import XRScene from "./XRScene";
import PreloadFont from "./PreloadFont";
import XRButton from "./XRButton";

type ComponentFallbackProps = {
  componentName: string;
};

type XRComponentFallbackProps = ComponentFallbackProps & {
  store: XRStore | null;
  session: XRSession | null;
};

function ComponentFallback({ componentName }: ComponentFallbackProps) {
  console.error(`${componentName} not loaded`);
  return null;
}

function XRComponentFallback({
  componentName,
  store,
  session,
}: XRComponentFallbackProps) {
  console.error(`${componentName} not loaded`);
  console.error("XR store:", store);
  console.error("XR session:", session);
  return null;
}

export default function App() {
  const [xrStore, setXrStore] = useState<XRStore | null>(null);
  const [xrSession, setXrSession] = useState<XRSession | null>(null);
  const [fontFamilies, setFontFamilies] = useState<FontFamilies | undefined>(
    undefined,
  );

  return (
    <main>
      <header>
        <h1>CheXRmate</h1>
      </header>
      <XRButton
        store={xrStore}
        existingSession={xrSession}
        setSession={setXrSession}
      />
      <Canvas shadows>
        <XRScene existingStore={xrStore} setXrStore={setXrStore}>
          <>
            <Suspense
              fallback={<ComponentFallback componentName="PreloadFont" />}
            >
              <PreloadFont setFontFamilies={setFontFamilies} />
            </Suspense>

            <Suspense fallback={<ComponentFallback componentName="Opponent" />}>
              <Opponent />
            </Suspense>

            <Suspense
              fallback={
                <XRComponentFallback
                  componentName="Board"
                  store={xrStore}
                  session={xrSession}
                />
              }
            >
              <Board fontFamilies={fontFamilies} />
            </Suspense>

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

            <OrbitControls />

            {xrStore && xrSession && (
              <Suspense
                fallback={
                  <XRComponentFallback
                    componentName="Locomotion"
                    store={xrStore}
                    session={xrSession}
                  />
                }
              >
                <Locomotion />
              </Suspense>
            )}
          </>
        </XRScene>
      </Canvas>
    </main>
  );
}
