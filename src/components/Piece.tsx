import {
  Suspense,
  forwardRef,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
} from "react";
import { Color, LoopOnce, Object3D, Vector3, type Mesh } from "three";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useTTF, Container, Text } from "@react-three/uikit";
import {
  type Color as PlayerColor,
  type PieceSymbol,
  type Square,
} from "chess.js";

import type { MaterialWithMap, SquarePositions } from "./Board";
import specialGothicCondensed from "../assets/fonts/SpecialGothicCondensedOne-Regular.ttf";
import { useFrame, type ThreeEvent } from "@react-three/fiber";

type PieceProps = {
  type: PieceSymbol;
  player: PlayerColor;
  square: Square;
  squarePositions: SquarePositions;
  isSelected: boolean;
  scale?: number;
  onSelect: (event: ThreeEvent<MouseEvent>) => void;
};

type MoveAnimation = {
  from: Vector3;
  to: Vector3;
  startTime: number;
  duration: number;
};

export type PieceHandle = {
  playLift: () => void;
  playMoveAnimation: (to: Vector3) => void;
  playSettle: () => void;
};

const Piece = forwardRef<PieceHandle, PieceProps>(function Piece(
  {
    type = "p",
    player = "w",
    square,
    squarePositions,
    isSelected,
    scale = 1,
    onSelect,
  }: PieceProps,
  ref,
) {
  const groupRef = useRef<Object3D>(null);
  const pieceRef = useRef<Object3D>(null);
  const fileName =
    type === "p"
      ? "pawn"
      : type === "n"
        ? "knight"
        : type === "b"
          ? "bishop"
          : type === "r"
            ? "rook"
            : type === "q"
              ? "queen"
              : "king";
  const { scene, animations } = useGLTF(`/models/${fileName}/${fileName}.gltf`);
  const { actions, names } = useAnimations(animations, pieceRef);
  const clone = useMemo(() => {
    const initialClone = SkeletonUtils.clone(scene);

    initialClone.traverse((object) => {
      if ((object as Mesh).isMesh) {
        const mesh = object as Mesh;
        const material = mesh.material as MaterialWithMap;
        (object as Mesh).material = material.clone();

        material.needsUpdate = true;
      }
    });

    return initialClone;
  }, [scene]);
  const [moveAnimation, setMoveAnimation] = useState<MoveAnimation | null>(
    null,
  );
  const lightColor = 0xfffad4;
  const darkColor = 0x065f74;
  const highlightColor = 0x8e2e00;
  const pieceColor = player === "w" ? lightColor : darkColor;
  const textColor = player === "w" ? darkColor : lightColor;
  const fontFamilies = useTTF(specialGothicCondensed);

  useEffect(() => {
    if (!clone) return;

    clone.traverse((object) => {
      if ((object as Mesh).isMesh) {
        const mesh = object as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const material = mesh.material as MaterialWithMap;
        material.color = new Color(
          isSelected && player === "w" ? highlightColor : pieceColor,
        );
      }
    });
  }, [clone, pieceColor, isSelected, player]);

  const playLift = useCallback(() => {
    const actionName = names[0];
    const action = actions[actionName];
    if (action) {
      action.reset();
      // eslint-disable-next-line
      action.timeScale = 1;
      action.time = 0;
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
    }
  }, [names, actions]);

  const playSettle = useCallback(() => {
    const actionName = names[1];
    const action = actions[actionName];
    if (action) {
      action.reset();
      // eslint-disable-next-line
      action.timeScale = 1;
      action.time = 0;
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
    }
  }, [names, actions]);

  const playMoveAnimation = useCallback(
    (to: Vector3) => {
      if (!groupRef.current) return;
      setMoveAnimation({
        from: groupRef.current.position.clone(),
        to,
        startTime: performance.now(),
        duration: 6000,
      });
    },
    [groupRef],
  );

  useEffect(() => {
    playSettle();
  }, [playSettle]);

  const handleStopPropagation = (event: ThreeEvent<MouseEvent>) => {
    // Stop propagation of React events
    event.stopPropagation();
    // Stop propagation of native events
    event.nativeEvent?.stopPropagation();
    event.nativeEvent?.stopImmediatePropagation();
  };

  const handleSelect = (event: ThreeEvent<MouseEvent>) => {
    if (player === "b") return;
    handleStopPropagation(event);
    playLift();
    playSettle();
    onSelect(event);
  };

  useImperativeHandle(
    ref,
    () => ({
      playLift,
      playSettle,
      playMoveAnimation,
    }),
    [playLift, playMoveAnimation, playSettle],
  );

  useFrame(() => {
    console.log(moveAnimation);
    if (!moveAnimation || !groupRef.current) return;

    const { from, to, startTime, duration } = moveAnimation;
    const elapsed = performance.now() - startTime;
    const time = Math.min(elapsed / duration, 1);

    const smoothTime =
      time < 0.5 ? 4 * time * time * time : 1 - Math.pow(-2 * time + 2, 3) / 2;

    const currentPosition = from.clone().lerp(to, smoothTime);

    groupRef.current.position.set(
      currentPosition.x,
      currentPosition.y,
      currentPosition.z,
    );

    if (time >= 1) {
      setMoveAnimation(null);
    }
  });

  return (
    <Suspense fallback={null}>
      <group
        ref={groupRef}
        position={squarePositions[square]}
        scale={scale}
        onClick={(event) => handleSelect(event)}
      >
        <group position={[0, 2.5, 0]} rotation={[0, 0, 0]}>
          <Container
            backgroundColor={isSelected ? highlightColor : pieceColor}
            borderRadius={30}
            paddingX={10}
            paddingY={2}
            opacity={0.8}
          >
            <Text
              fontFamilies={fontFamilies}
              fontSize={24}
              color={isSelected ? lightColor : textColor}
            >
              {square.toUpperCase()}
            </Text>
          </Container>
        </group>
        <group
          rotation={[
            0,
            type === "n" && player === "w"
              ? Math.PI
              : type === "k"
                ? Math.PI / 2
                : 0,
            0,
          ]}
        >
          <primitive ref={pieceRef} object={clone} />
        </group>
      </group>
    </Suspense>
  );
});

export default Piece;
