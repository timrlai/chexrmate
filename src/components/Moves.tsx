import { Hud, PerspectiveCamera } from "@react-three/drei";
import { useTTF, Container, Text } from "@react-three/uikit";
import type { PieceSymbol, Square } from "chess.js";

import specialGothicCondensed from "../assets/fonts/SpecialGothicCondensedOne-Regular.ttf";

type MovesProps = {
  type: PieceSymbol;
  moves: Square[];
};

export default function Moves({ type, moves }: MovesProps) {
  const pieceName =
    type === "p"
      ? "Pawn"
      : type === "n"
        ? "Knight"
        : type === "b"
          ? "Bishop"
          : type === "r"
            ? "Rook"
            : type === "q"
              ? "Queen"
              : "King";
  const fontFamilies = useTTF(specialGothicCondensed);
  return (
    <Hud>
      <PerspectiveCamera makeDefault position={[0, 0, 10]}>
        <group position={[1.2, 0.4, -2]}>
          <Container
            flexDirection="column"
            alignContent="flex-end"
            gap={2}
            opacity={0.8}
          >
            <Container
              fontFamilies={fontFamilies}
              backgroundColor="#065f74"
              borderRadius={2}
              paddingX={4}
              paddingY={2}
            >
              <Text color="#fffad4" fontSize={8}>
                {pieceName}:
              </Text>
            </Container>
            {moves.length > 0 ? (
              moves.map((move) => (
                <Container
                  fontFamilies={fontFamilies}
                  backgroundColor="#065f74"
                  borderRadius={2}
                  paddingX={4}
                  paddingY={2}
                >
                  <Text color="#fffad4" fontSize={8}>
                    {move.toUpperCase()}
                  </Text>
                </Container>
              ))
            ) : (
              <Container
                fontFamilies={fontFamilies}
                backgroundColor="#8e2e00"
                borderRadius={2}
                paddingX={4}
                paddingY={2}
              >
                <Text color="#fffad4" fontSize={8}>
                  None
                </Text>
              </Container>
            )}
          </Container>
        </group>
      </PerspectiveCamera>
    </Hud>
  );
}
