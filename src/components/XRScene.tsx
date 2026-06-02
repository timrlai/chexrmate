import { Suspense, useEffect, type JSX } from "react";
import { createXRStore, XR, type XRStore } from "@react-three/xr";

type XRSceneProps = {
  children: JSX.Element;
  existingStore: XRStore | null;
  setXrStore: (store: XRStore) => void;
};

type XRFallbackProps = { store: XRStore };

function XRFallback({ store }: XRFallbackProps) {
  console.error("XR scene not loaded");
  console.error("XR Store:", store);
  return null;
}

const store = createXRStore({
  controller: { rayPointer: { rayModel: { color: "#065f74" } } },
});

export default function XRScene({
  children,
  existingStore,
  setXrStore,
}: XRSceneProps) {
  useEffect(() => {
    if (!existingStore && store) setXrStore(store);
  }, [existingStore, setXrStore]);

  return (
    <Suspense fallback={<XRFallback store={existingStore ?? store} />}>
      <XR store={existingStore ?? store}>{children}</XR>
    </Suspense>
  );
}
