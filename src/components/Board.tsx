import { useEffect, useRef, useState, type JSX } from "react";
import {
  Color,
  DoubleSide,
  Material,
  Mesh,
  Vector3,
  type ColorRepresentation,
} from "three";
import { useTTF, Container, Text } from "@react-three/uikit";
import { Chess, type PieceSymbol, type Square } from "chess.js";

import specialGothicCondensed from "../assets/fonts/SpecialGothicCondensedOne-Regular.ttf";
import Piece, { type PieceHandle } from "./Piece";
import type { ThreeEvent } from "@react-three/fiber";
import GameStatus from "./GameStatus";
import Promotion from "./Promotion";

export type MaterialWithMap = Material & {
  map: { needsUpdate: boolean };
  color: ColorRepresentation;
};

export type SquarePositions = {
  [key: string]: Vector3;
};

type LabelledSquareProps = {
  position?: [number, number, number];
  squareSize: number;
  bgColor: string;
  textColor: string;
  labelText: string;
  legalMove?: boolean;
  selectedSquare?: boolean;
  onSelect?: (event: ThreeEvent<MouseEvent>) => void;
};

type MoveHighlightProps = {
  square: Square;
  squarePositions: SquarePositions;
  onSelect?: (event: ThreeEvent<MouseEvent>) => void;
};

type BoardProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  squareSize?: number;
};

function LabelledSquare({
  position,
  squareSize,
  bgColor,
  textColor,
  labelText,
  legalMove = false,
  selectedSquare = false,
  onSelect,
}: LabelledSquareProps) {
  const meshRef = useRef<Mesh>(null);
  const fontFamilies = useTTF(specialGothicCondensed);

  useEffect(() => {
    if (!meshRef.current) return;
    (meshRef.current.material as MaterialWithMap).color = new Color(
      legalMove && selectedSquare ? 0x8e2e00 : bgColor,
    );
  }, [meshRef, legalMove, selectedSquare, bgColor]);

  return (
    <group position={position} onClick={onSelect}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <planeGeometry args={[squareSize, squareSize]} />
        <meshStandardMaterial
          color={bgColor}
          metalness={0.3}
          roughness={0.2}
          envMapIntensity={0.8}
          side={DoubleSide}
        />
      </mesh>
      <group position={[0, 0, 0.1]}>
        <Container>
          <Text
            fontFamilies={fontFamilies}
            fontSize={52}
            color={selectedSquare ? 0xfffad4 : textColor}
          >
            {labelText}
          </Text>
        </Container>
      </group>
    </group>
  );
}

function MoveHighlight({
  square,
  squarePositions,
  onSelect,
}: MoveHighlightProps) {
  const squarePosition = squarePositions[square];
  return (
    <mesh
      position={
        new Vector3(squarePosition.x, squarePosition.y + 0.1, squarePosition.z)
      }
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={onSelect}
    >
      <circleGeometry args={[1, 32]} />
      <meshBasicMaterial
        color="#8e2e00"
        transparent
        opacity={0.5}
        side={DoubleSide}
      />
    </mesh>
  );
}

export default function Board({
  position = [-7, -3, -15],
  rotation = [0, 0, 0],
  squareSize = 2,
}: BoardProps) {
  const [gameState, setGameState] = useState(new Chess());
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null);
  const [pieceType, setPieceType] = useState<PieceSymbol | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [promotion, setPromotion] = useState<{
    from: Square;
    to: Square;
  } | null>(null);
  const pieceRefs = useRef<Record<string, PieceHandle>>({});
  const gameBoard = gameState.board();
  const squares: JSX.Element[] = [];
  const squarePositions: SquarePositions = {};
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const lightColor = "#fffad4";
  const darkColor = "#065f74";

  const resetSelection = () => {
    setSelectedPiece(null);
    setPieceType(null);
    setSelectedSquare(null);
    setLegalMoves([]);
    setPromotion(null);
  };

  const opponentMove = () => {
    const moves = gameState.moves();
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    const selectedMove = gameState.move(randomMove);
    if (pieceRefs.current) {
      const opponentPiece = pieceRefs.current[selectedMove.from];
      opponentPiece.playLift();
      opponentPiece.playMoveAnimation(squarePositions[selectedMove.to]);
      opponentPiece.playSettle();
    }
    setTimeout(() => {
      setGameState(new Chess(gameState.fen()));
    }, 300);
  };

  const selectSquare = (square: Square) => {
    if (!selectedPiece) return;

    if (gameState.get(square) && !legalMoves.includes(square)) {
      setSelectedPiece(square);
      return;
    }

    if (!legalMoves.includes(square)) return;

    setSelectedSquare(square);

    if (pieceRefs.current) {
      const playerPiece = pieceRefs.current[selectedPiece];
      playerPiece.playLift();
      playerPiece.playMoveAnimation(squarePositions[square]);
      playerPiece.playSettle();
    }

    setTimeout(() => {
      const piece = gameState.get(selectedPiece);
      const isPromotion =
        piece?.type === "p" &&
        ((piece.color === "w" && square.endsWith("8")) ||
          (piece.color === "b" && square.endsWith("1")));

      if (isPromotion) {
        setPromotion({ from: selectedPiece, to: square });
        return;
      }

      gameState.move({
        from: selectedPiece,
        to: square,
      });

      setGameState(new Chess(gameState.fen()));

      resetSelection();
      opponentMove();
    }, 300);
  };

  const promote = (piece: PieceSymbol) => {
    if (!promotion) return;

    const { from, to } = promotion;

    gameState.move({
      from,
      to,
      promotion: piece,
    });

    setGameState(new Chess(gameState.fen()));

    resetSelection();
    opponentMove();
  };

  const selectPiece = (square: Square, type: PieceSymbol) => {
    setSelectedSquare(null);
    setLegalMoves([]);
    setSelectedPiece(square);
    setPieceType(type);
    const moves = gameState.moves({
      square: square,
      verbose: true,
    });
    setLegalMoves(moves.map((move) => move.to));
  };

  for (let col = 0; col < 8; col++) {
    for (let row = 0; row < 8; row++) {
      const leftCol = col === 0;
      const bottomRow = row === 7;
      const fileLetter = letters[col];
      const rankNum = 8 - row;
      const square = `${fileLetter}${rankNum}` as Square;
      const isEven = (col + row) % 2 === 0;
      const bgColor = isEven ? lightColor : darkColor;
      const textColor = isEven ? darkColor : lightColor;
      const squarePosition = new Vector3(col * squareSize, 0, row * squareSize);
      Object.assign(squarePositions, { [square]: squarePosition });
      squares.push(
        <group
          key={square}
          position={squarePosition}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {leftCol && (
            <LabelledSquare
              squareSize={squareSize}
              position={[-squareSize, 0, 0]}
              bgColor={lightColor}
              textColor={darkColor}
              labelText={`${rankNum}`}
            />
          )}
          {bottomRow && (
            <LabelledSquare
              squareSize={squareSize}
              position={[0, -squareSize, 0]}
              bgColor={lightColor}
              textColor={darkColor}
              labelText={fileLetter.toUpperCase()}
            />
          )}
          <LabelledSquare
            squareSize={squareSize}
            position={[0, 0, 0]}
            bgColor={bgColor}
            textColor={textColor}
            labelText={square.toUpperCase()}
            legalMove={legalMoves.includes(square)}
            selectedSquare={selectedSquare === square}
            onSelect={(event: ThreeEvent<MouseEvent>) => {
              event.stopPropagation();
              selectSquare(square);
            }}
          />
        </group>,
      );
    }
  }

  return (
    <group position={position} rotation={rotation}>
      {gameBoard.map((rank) =>
        rank.map((square) => {
          if (!square) return null;

          return (
            <Piece
              ref={(ref) => {
                if (!pieceRefs.current) return;
                if (ref) {
                  pieceRefs.current[square.square] = ref;
                } else {
                  delete pieceRefs.current[square.square];
                }
              }}
              key={square.square}
              type={square.type}
              player={square.color}
              square={square.square}
              squarePositions={squarePositions}
              isSelected={selectedPiece === square.square}
              onSelect={() => selectPiece(square.square, square.type)}
            />
          );
        }),
      )}

      {legalMoves.map((square) => (
        <MoveHighlight
          square={square as Square}
          squarePositions={squarePositions}
          onSelect={(event: ThreeEvent<MouseEvent>) => {
            event.stopPropagation();
            selectSquare(square);
          }}
        />
      ))}

      {squares}

      <GameStatus
        type={pieceType}
        moves={legalMoves}
        isCheck={gameState.isCheck()}
        isCheckMate={gameState.isCheckmate()}
        isStaleMate={gameState.isStalemate()}
        isDraw={gameState.isDraw()}
        isThreefoldRepetition={gameState.isThreefoldRepetition()}
      />

      {promotion && <Promotion square={promotion.to} promote={promote} />}
    </group>
  );
}
