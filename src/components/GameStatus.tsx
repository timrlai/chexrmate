import { Hud, PerspectiveCamera } from "@react-three/drei";
import { useTTF, Container, Text } from "@react-three/uikit";
import type { PieceSymbol, Square } from "chess.js";

import specialGothicCondensed from "../assets/fonts/SpecialGothicCondensedOne-Regular.ttf";

type GameStatusProps = {
  type: PieceSymbol | null;
  moves: Square[];
  isCheck: boolean;
  isCheckMate: boolean;
  isStaleMate: boolean;
  isDraw: boolean;
  isThreefoldRepetition: boolean;
};

export default function GameStatus({
  type,
  moves,
  isCheck,
  isCheckMate,
  isStaleMate,
  isDraw,
  isThreefoldRepetition,
}: GameStatusProps) {
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
  const statusFontSize = 24;
  const moveFontSize = 6;
  return (
    <Hud>
      <PerspectiveCamera makeDefault position={[0, 0, 10]}>
        <group position={[0, 0.4, -2]}>
          <Container
            flexDirection="column"
            gap={2}
            textAlign="center"
            fontFamilies={fontFamilies}
            fontSize={statusFontSize}
            color="#8e2e00"
            opacity={0.8}
          >
            {isCheck && !isCheckMate && <Text>Check!</Text>}
            {isCheckMate && <Text fontSize={statusFontSize}>Checkmate!</Text>}
            {isStaleMate && <Text fontSize={statusFontSize}>Stalemate!</Text>}
            {isDraw && <Text fontSize={statusFontSize}>Draw!</Text>}
            {isThreefoldRepetition && (
              <Text fontSize={statusFontSize}>Threefold Repetition!</Text>
            )}
          </Container>
        </group>
        {type && (
          <group position={[1.2, 0, -2]}>
            <Container
              maxHeight={100}
              flexDirection="column"
              flexWrap="wrap"
              justifyContent="flex-end"
              alignContent="flex-end"
              gap={2}
              opacity={0.8}
              fontFamilies={fontFamilies}
              fontSize={moveFontSize}
            >
              <Container
                backgroundColor="#065f74"
                borderRadius={2}
                paddingX={4}
                paddingY={2}
              >
                <Text color="#fffad4">{pieceName}:</Text>
              </Container>
              {moves.length > 0 ? (
                moves.map((move) => (
                  <Container
                    backgroundColor="#065f74"
                    borderRadius={2}
                    paddingX={4}
                    paddingY={2}
                    flexShrink={1}
                  >
                    <Text color="#fffad4">{move.toUpperCase()}</Text>
                  </Container>
                ))
              ) : (
                <Container
                  backgroundColor="#8e2e00"
                  borderRadius={2}
                  paddingX={4}
                  paddingY={2}
                >
                  <Text color="#fffad4">None</Text>
                </Container>
              )}
            </Container>
          </group>
        )}
      </PerspectiveCamera>
    </Hud>
  );
}
