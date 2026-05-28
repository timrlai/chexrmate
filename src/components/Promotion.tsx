import { useState } from "react";
import { useTTF, Container, Text } from "@react-three/uikit";
import type { PieceSymbol } from "chess.js";

import specialGothicCondensed from "../assets/fonts/SpecialGothicCondensedOne-Regular.ttf";
import { Billboard } from "@react-three/drei";

type PromotionProps = {
  promote: (piece: PieceSymbol) => void;
};

export default function Promotion({ promote }: PromotionProps) {
  const fontFamilies = useTTF(specialGothicCondensed);
  const buttonColor = "#065f74";
  const hoverColor = "#8e2e00";
  const [queenColor, setQueenColor] = useState(buttonColor);
  const [rookColor, setRookColor] = useState(buttonColor);
  const [bishopColor, setBishopColor] = useState(buttonColor);
  const [knightColor, setKnightColor] = useState(buttonColor);
  const fontSize = 8;
  return (
    <Billboard position={[2, 7, -1]} lockX lockZ>
      <group scale={10}>
        <Container
          fontFamilies={fontFamilies}
          fontSize={fontSize}
          flexDirection="column"
          gap={2}
          color="#fffad4"
          opacity={0.8}
        >
          <Container
            borderRadius={2}
            paddingX={4}
            paddingY={2}
            backgroundColor="#065f74"
          >
            <Text>Promote pawn to:</Text>
          </Container>
          <Container
            borderRadius={2}
            paddingX={4}
            paddingY={2}
            backgroundColor={queenColor}
            onClick={() => promote("q")}
            onPointerOver={() => setQueenColor(hoverColor)}
            onPointerOut={() => setQueenColor(buttonColor)}
          >
            <Text>Queen</Text>
          </Container>
          <Container
            borderRadius={2}
            paddingX={4}
            paddingY={2}
            backgroundColor={rookColor}
            onClick={() => promote("r")}
            onPointerOver={() => setRookColor(hoverColor)}
            onPointerOut={() => setRookColor(buttonColor)}
          >
            <Text>Rook</Text>
          </Container>
          <Container
            borderRadius={2}
            paddingX={4}
            paddingY={2}
            backgroundColor={bishopColor}
            onClick={() => promote("b")}
            onPointerOver={() => setBishopColor(hoverColor)}
            onPointerOut={() => setBishopColor(buttonColor)}
          >
            <Text>Bishop</Text>
          </Container>
          <Container
            borderRadius={2}
            paddingX={4}
            paddingY={2}
            backgroundColor={knightColor}
            onClick={() => promote("n")}
            onPointerOver={() => setKnightColor(hoverColor)}
            onPointerOut={() => setKnightColor(buttonColor)}
          >
            <Text>Knight</Text>
          </Container>
        </Container>
      </group>
    </Billboard>
  );
}
