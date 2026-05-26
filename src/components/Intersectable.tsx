import { type JSX, useEffect, useRef } from "react";
import { type Mesh, Box3 } from "three";

type IntersectableProps = {
  position?: [number, number, number];
  box: Box3 | null;
  children: JSX.Element;
  onIntersect: () => void;
};

export default function Intersectable({
  position = [0, 0, 0],
  box,
  children,
  onIntersect,
}: IntersectableProps) {
  const groupRef = useRef<Mesh>(null);

  useEffect(() => {
    if (!groupRef.current || !box) return;
    groupRef.current.updateWorldMatrix(true, false);
    const intersectableBox = new Box3().setFromObject(groupRef.current);
    const intersects = box ? intersectableBox.intersectsBox(box) : false;
    if (intersects) onIntersect();
  }, [box, onIntersect]);

  return (
    <group ref={groupRef} position={position}>
      {children}
    </group>
  );
}
