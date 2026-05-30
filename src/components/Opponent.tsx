import { useState } from "react";
import { ClampToEdgeWrapping, FileLoader } from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useTexture, Billboard } from "@react-three/drei";

type OpponentProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

type SpriteData = {
  frames: any[];
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
  const opponentTexture = "/img/sprites/timrlai_chess_spritesheet.png";
  const texture = useTexture(opponentTexture, (texture) => {
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
  });

  const spriteData = useLoader(
    FileLoader,
    "/sprites/timrlai_chess_sprites.json",
    (loader) => {
      loader.setResponseType("json");
    },
  ) as SpriteData;

  const frames = spriteData.frames;
  const atlasWidth = spriteData.meta.size.w;
  const atlasHeight = spriteData.meta.size.h;

  const [frameIndex, setFrameIndex] = useState(0);
  const fps = 16;

  useFrame((_, delta) => {
    const nextFrameIndex = (frameIndex + delta * fps) % frames.length;
    setFrameIndex(nextFrameIndex);

    const frame = frames[Math.floor(nextFrameIndex)].frame;

    texture.offset.set(
      frame.x / atlasWidth,
      1 - (frame.y + frame.h) / atlasHeight,
    );

    texture.repeat.set(frame.w / atlasWidth, frame.h / atlasHeight);
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
