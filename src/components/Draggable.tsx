import { type JSX, useRef, useState } from "react";
import { type Group, Box3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useXRInputSourceState } from "@react-three/xr";

type DraggableProps = {
  position?: [number, number, number];
  children: JSX.Element;
  onDragged?: (box: Box3) => void;
};

export default function Draggable({
  position = [0, 0, 0],
  children,
  onDragged,
}: DraggableProps) {
  const groupRef = useRef<Group>(null);
  const boundingBox = useRef<Box3>(null);
  const [isGrabbed, setIsGrabbed] = useState(false);
  const controller = useXRInputSourceState("controller", "right");
  const { scene } = useThree();

  const grab = () => {
    if (controller?.object && groupRef.current) {
      controller.object.attach(groupRef.current);
      setIsGrabbed(true);
    }
  };

  const release = () => {
    if (isGrabbed && groupRef.current) {
      scene.attach(groupRef.current);
      setIsGrabbed(false);
    }
  };

  useFrame(() => {
    if (isGrabbed && groupRef.current && boundingBox.current && onDragged) {
      const box = boundingBox.current.clone();
      box.applyMatrix4(groupRef.current.matrixWorld);
      onDragged(box);
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={grab}
      onPointerUp={release}
      position={position}
    >
      {children}
    </group>
  );
}
