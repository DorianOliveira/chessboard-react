"use client";

import { PieceBuilder } from "@/model/builder";
import { Board } from "../board/board";
import { useEffect, useState } from "react";
import { IBoardCell, IChessPiece, ISingleRule } from "@/interfaces/interfaces";
import { ERuleDirection } from "@/enums/enums";
import { DirectionHelper } from "@/model/direction";

export function Game() {
  // const [grid, setGrid] = useState<IBoardCell[]>();

  const [pieces, setPieces] = useState<IChessPiece[]>();
  const [targetPositions, setTargetPositions] = useState<number[]>();
  const [selectedPiece, setSelectedPiece] = useState<IChessPiece>();
  const [isTurnEnd, setIsTurnEnd] = useState(false);
  const [oldPosition, setOldPosition] = useState<boolean>(false);

  useEffect(() => build(), []);

  useEffect(() => {
    if (!isTurnEnd) {
      setAvailableSteps();
    }
  }, [selectedPiece, setAvailableSteps]);

  function setAvailableSteps() {
    if (selectedPiece) {
      const { directions, limit, canInvade } =
        selectedPiece.rule as ISingleRule;

      findCellsByDirections(
        selectedPiece.position,
        directions,
        limit,
        canInvade
      );
    }
  }

  const isCellAvailable = (position: number) => {
    return !pieces?.some((piece: IChessPiece) => piece.position === position);
  };

  function findCellsByDirections(
    position: number,
    directions: ERuleDirection[],
    limit?: number,
    canInvade?: boolean
  ) {
    const _ = DirectionHelper;

    let seekPositions: number[] = [];

    directions.forEach((d) => {
      const availablePositions = [];

      if (!limit) limit = 7;

      const directionsBlocked: ERuleDirection[] = [];

      const isLShape = d === ERuleDirection.lShape;

      const hasMultipleDirections =
        d === ERuleDirection.all ||
        d === ERuleDirection.onlyStraight ||
        d === ERuleDirection.onlyDiagonal ||
        isLShape;

      for (let end = 0; end < limit; end++) {
        if (hasMultipleDirections) {
          const allDirections = _.getDirections(d);

          allDirections.forEach((direction) => {
            const canMoveInThisDirections = !directionsBlocked.some(
              (d) => direction === d
            );

            if (
              (canMoveInThisDirections || canInvade) &&
              !_.isBoardEdge(position, direction)
            ) {
              const nextPosition = _.evaluatePosition(
                direction,
                position,
                end + 1,
                isLShape
              );

              if (
                !isCellAvailable(nextPosition) ||
                _.isBoardEdge(nextPosition, direction)
              ) {
                directionsBlocked.push(direction);
              }

              // if (!isBoardEdge(position, direction))
              availablePositions.push(nextPosition);
            }
          });
        } else {
          availablePositions.push(_.evaluatePosition(d, position));
        }
        seekPositions = [
          ...seekPositions,
          ...availablePositions.filter((p) => isCellAvailable(p)),
        ];

        setTargetPositions(seekPositions);
      }
    });

    // const newGrid = pieces?.map((cell) => {
    //   const isAvailableStep = seekPositions.includes(cell.position);

    //   return {
    //     ...cell,
    //     isAvailableStep,
    //   };
    // });

    // setGrid(newGrid);
  }

  function onCellClick(cell?: IBoardCell) {
    // if (!clickedCell?.chessPiece && selectedPiece && hasValidStep) {
    //   setGrid(mapGrid(position));
    //   setSelectedPiece(null);
    //   setIsTurnEnd(true);
    // }
  }

  function onPieceSelected(piece: IChessPiece) {
    setSelectedPiece(piece);
    setIsTurnEnd(false);
  }

  function build() {
    const builder = new PieceBuilder();
    const chessPieces = builder.build();
    setPieces(chessPieces);
  }

  // function onUpdateGrid(data: IBoardCell[] | undefined): void {
  //   setGrid(data);
  // }

  return (
    // <GameContext.Provider value={grid}>
    <Board
      onCellClick={onCellClick}
      onPieceSelected={onPieceSelected}
      selectedPiece={selectedPiece}
      targetPositions={targetPositions}
      pieces={pieces}
    />
    // </GameContext.Provider>
  );
}
