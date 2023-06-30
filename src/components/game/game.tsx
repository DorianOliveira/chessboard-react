'use client';

import { PieceBuilder } from '@/model/builder';
import { Board } from '../board/board';
import { useEffect, useState } from 'react';
import { IBoardCell, IChessPiece, ISingleRule } from '@/interfaces/interfaces';
import { ERuleDirection, ETeam } from '@/enums/enums';
import { DirectionHelper } from '@/model/direction';

export function Game() {
  const [pieces, setPieces] = useState<IChessPiece[]>();
  const [currentTeam, setCurrentTeam] = useState<ETeam>(ETeam.black);
  const [allowedMoves, setAllowedMoves] = useState<number[]>();
  const [selectedMove, setSelectedMove] = useState<number>();
  const [selectedPiece, setSelectedPiece] = useState<IChessPiece | null | undefined>();

  const [turn, setTurn] = useState<'think' | 'select' | 'drop' | 'end'>('think');
  const [oldPosition, setOldPosition] = useState<number | undefined>();

  useEffect(() => build(), []);

  useEffect(() => {
    if (turn === 'think' && selectedPiece) {
      setAvailableSteps();
      setTurn('select');
    }
  }, [selectedPiece, setAvailableSteps]);

  function setAvailableSteps() {
    if (selectedPiece) {
      const { directions, limit } = selectedPiece.rule as ISingleRule;
      findMoves(selectedPiece.position, directions, limit);
    }
  }

  const isCellAvailable = (position: number) =>
    !pieces?.some((piece: IChessPiece) => piece.position === position);

  function findMoves(position: number, directions: ERuleDirection[], limit?: number) {
    const _ = DirectionHelper;
    let moves: number[] = [];

    directions.forEach((currentDirection) => {
      const directionPositions = [];
      const blocked: ERuleDirection[] = [];
      const isLShape = currentDirection === ERuleDirection.lShape;

      console.log(currentDirection);

      if (!limit) limit = 7;

      for (let step = 0; step < limit; step++) {
        if (!_.isMultiple(currentDirection)) {
          const nextPosition = _.evaluatePosition(currentDirection, position, currentTeam);
          if (isCellAvailable(nextPosition)) directionPositions.push(nextPosition);
        } else {
          const searchDirections = _.getDirections(currentDirection);
          searchDirections.forEach((direction) => {
            const isBlocked = blocked.some((blockedDirection) => direction === blockedDirection);

            const isBoardEdge = _.isBoardEdge(position, direction, currentTeam);

            if (!isBlocked && !isBoardEdge) {
              const nextPosition = _.evaluatePosition(
                direction,
                position,
                currentTeam,
                step + 1,
                isLShape
              );

              const isPositionAvailable = isCellAvailable(nextPosition);
              const isPositionEdge = _.isBoardEdge(nextPosition, direction, currentTeam);
              const mustBlock = !isPositionAvailable || isPositionEdge;

              if (mustBlock) blocked.push(direction);

              if (isPositionAvailable) directionPositions.push(nextPosition);
            }
          });
        }

        moves = [...moves, ...directionPositions];
      }
    });

    setAllowedMoves(moves);
  }

  function onCellClick(cell?: IBoardCell) {
    if (cell?.isAvailableStep) {
      setSelectedMove(cell?.position);

      setOldPosition(selectedPiece?.position);

      const updatedPieces = pieces?.map((piece) => {
        if (piece.position === selectedPiece?.position) piece.position = cell.position;
        return piece;
      });

      setPieces(updatedPieces);
      setTurn('end');
      setCurrentTeam((team) => (team === ETeam.white ? ETeam.black : ETeam.white));
    }
  }

  function onPieceSelected(piece: IChessPiece) {
    if (piece.team !== currentTeam) return;

    setSelectedPiece(piece);
    setTurn('think');
  }

  function build() {
    const builder = new PieceBuilder();
    const chessPieces = builder.build();
    setPieces(chessPieces);
  }

  return (
    <>
      <h3>Player 2</h3>

      <div>
        <h1>
          <strong>Quem joga: {currentTeam === ETeam.white ? 'Brancas' : 'Pretas'}</strong>
        </h1>
        <Board
          onCellClick={onCellClick}
          onPieceSelected={onPieceSelected}
          selectedPiece={selectedPiece ? selectedPiece : undefined}
          allowedMoves={allowedMoves}
          selectedMove={selectedMove}
          oldPosition={oldPosition}
          pieces={pieces}
        />
      </div>

      <h3>Player 1</h3>
    </>
  );
}
