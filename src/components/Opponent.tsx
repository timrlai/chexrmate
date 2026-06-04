import { useState } from "react";
import { ClampToEdgeWrapping, FileLoader } from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useTexture, Billboard } from "@react-three/drei";

type OpponentProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

type Frame = {
  frame: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
};

type SpriteData = {
  frames: Frame[];
  meta: {
    size: {
      w: number;
      h: number;
    };
  };
};

export default function Opponent({
  position = [-2, 1, -25],
  rotation = [0, 0, 0],
  scale = 5,
}: OpponentProps) {
  const opponentTexture = "/textures/timrlai_chess_spritesheet.png";
  const opponentSprite = "/sprites/timrlai_chess_sprites.json";

  const texture = useTexture(opponentTexture, (texture) => {
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
  });

  const spriteData = useLoader(FileLoader, opponentSprite, (loader) => {
    loader.setResponseType("json");
  }) as SpriteData;

  const { frames, meta } = spriteData;
  const { w: metaW, h: metaH } = meta.size;
  const [frameIndex, setFrameIndex] = useState(0);
  const fps = 16;

  useFrame((_, delta) => {
    const nextFrameIndex = (frameIndex + delta * fps) % frames.length;
    const { x, y, w, h } = frames[Math.floor(nextFrameIndex)].frame;
    const offsetX = x / metaW;
    const offsetY = 1 - (y + h) / metaH;
    const repeatX = w / metaW;
    const repeatY = h / metaH;

    texture.offset.set(offsetX, offsetY);
    texture.repeat.set(repeatX, repeatY);

    setFrameIndex(nextFrameIndex);
  });

  return (
    <Billboard
      position={position}
      rotation={rotation}
      scale={scale}
      follow
      lockX
      lockZ
    >
      <mesh castShadow receiveShadow>
        <planeGeometry args={[6, 8]} />
        <meshStandardMaterial map={texture} transparent={true} />
      </mesh>
    </Billboard>
  );
}
