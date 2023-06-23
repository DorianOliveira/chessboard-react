"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { ChessboardCell } from "./chessboardCell";
import {
  IChessPiece,
  ICell,
  IChessPieceProps,
  EChessPieceType,
  ERuleDirection,
  ISingleRule,
  IStepRule,
} from "./../../interfaces/chessboard";

import { PieceBuilder } from "./../../interfaces/pieces";

export function Chessboard() {
  const [selectedPiece, setSelectedPiece] = useState<IChessPiece>(null);
  const [oldPosition, setOldPosition] = useState<boolean>(false);
  const [grid, setGrid] = useState<ICell[]>([]);

  useEffect(() => mount(), []);

  useEffect(() => setAvailableSteps(), [selectedPiece]);

  function mapGrid(position: number) {
    return grid.map((gridItem) => {
      if (gridItem.position === position)
        return {
          ...gridItem,
          chessPiece: {
            ...selectedPiece,
            position,
          },
        };

      if (gridItem.position === selectedPiece.position)
        return {
          ...gridItem,
          chessPiece: null,
        };

      return gridItem;
    });
  }

  function onCellClick(position: number) {
    const clickedCell = grid.find((cell) => cell.position === position);

    if (!clickedCell.chessPiece && selectedPiece) {
      setGrid(mapGrid(position));
      setSelectedPiece(null);
    }
  }

  function onPieceSelected(piece: IChessPiece) {
    clearAvailableSteps();
    setSelectedPiece(piece);
  }

  function setAvailableSteps() {
    if (selectedPiece) {
      const { directions, limit, canInvade } = selectedPiece.rule;

      findCellsByDirections(
        selectedPiece.position,
        directions,
        limit,
        canInvade
      );
    }
  }

  function clearAvailableSteps() {
    setGrid(
      grid.map((cell) => {
        return {
          ...cell,
          isAvailableStep: false,
        };
      })
    );
  }
  function getDirections(relatedDirection: ERuleDirection) {
    const base = Object.keys(ERuleDirection).filter(
      (x) =>
        x !== ERuleDirection.onlyStraight &&
        x !== ERuleDirection.onlyDiagonal &&
        x !== ERuleDirection.all &&
        x !== ERuleDirection.lShape
    );

    let keysExcluded: ERuleDirection[] = [];

    const lShapeDirections = [
      ERuleDirection.leftUp,
      ERuleDirection.leftBottom,
      ERuleDirection.rightUp,
      ERuleDirection.rightBottom,
    ];

    const straightDirections = [
      ERuleDirection.up,
      ERuleDirection.bottom,
      ERuleDirection.right,
      ERuleDirection.left,
    ];

    const diagonalDirections = [
      ERuleDirection.upRight,
      ERuleDirection.upLeft,
      ERuleDirection.downRight,
      ERuleDirection.downLeft,
    ];

    switch (relatedDirection) {
      case ERuleDirection.onlyStraight:
        keysExcluded = [...lShapeDirections, ...diagonalDirections];
        break;
      case ERuleDirection.onlyDiagonal:
        keysExcluded = [...lShapeDirections, ...straightDirections];
        break;
      case ERuleDirection.lShape:
        keysExcluded = straightDirections;
        break;
    }

    return base.filter((item) => !keysExcluded.includes(item));
  }

  function isDiagonal(direction: ERuleDirection) {
    return (
      direction === ERuleDirection.upRight ||
      direction === ERuleDirection.upLeft ||
      direction === ERuleDirection.downRight ||
      direction === ERuleDirection.downLeft
    );
  }

  function isDiagonalBottom(direction: ERuleDirection) {
    return (
      direction === ERuleDirection.downRight ||
      direction === ERuleDirection.downLeft
    );
  }

  function isDiagonalUp(direction: ERuleDirection) {
    return (
      direction === ERuleDirection.upLeft ||
      direction === ERuleDirection.upRight
    );
  }

  function isDiagonalRight(direction: ERuleDirection) {
    return (
      direction === ERuleDirection.upRight ||
      direction === ERuleDirection.downRight
    );
  }

  function isDiagonalLeft(direction: ERuleDirection) {
    return (
      direction === ERuleDirection.upLeft ||
      direction === ERuleDirection.downLeft
    );
  }

  function isHorizontal(direction: ERuleDirection) {
    return direction === ERuleDirection.up || direction === ERuleDirection.down;
  }

  function isVertical(direction: ERuleDirection) {
    return (
      direction === ERuleDirection.up || direction === ERuleDirection.bottom
    );
  }

  function isNegativeStep(direction: ERuleDirection) {
    return (
      direction === ERuleDirection.left ||
      direction === ERuleDirection.up ||
      direction === ERuleDirection.upRight ||
      direction === ERuleDirection.upLeft ||
      direction === ERuleDirection.leftUp ||
      direction === ERuleDirection.rightUp
    );
  }

  function isLShapeRight(direction: ERuleDirection) {
    return (
      direction === ERuleDirection.upRight ||
      direction === ERuleDirection.downRight
    );
  }

  function isLShapeLeft(direction: ERuleDirection) {
    return (
      direction === ERuleDirection.upLeft ||
      direction === ERuleDirection.downLeft
    );
  }

  function evaluatePosition(
    direction: ERuleDirection,
    position: number,
    step = 1,
    isLShape = false
  ) {
    let modifier = isVertical(direction) ? 8 : 1;

    const isLShapeMajor =
      direction === ERuleDirection.leftUp ||
      direction === ERuleDirection.rightBottom;

    const isLShapeMinor =
      direction === ERuleDirection.rightUp ||
      direction === ERuleDirection.leftBottom;

    if (isDiagonalRight(direction)) modifier = isLShape ? 15 : 7;

    if (isDiagonalLeft(direction)) modifier = isLShape ? 17 : 9;

    if (isLShapeMajor) modifier = 10;
    else if (isLShapeMinor) modifier = 6;

    if (isNegativeStep(direction)) modifier *= -1;

    // console.log(direction);
    // console.log(position, modifier, step);
    // console.log(position + modifier * step);

    return position + modifier * step;
  }

  const isCellAvailable = (position: number) =>
    grid.some((cell) => cell.position === position && !cell.chessPiece);

  const isInitialPosition = (position: number) =>
    (position >= 0 && position < 16) || (position >= 48 && position <= 64);

  const isBoardEdge = (position: number) =>
    position % 8 === 0 || position % 8 === 7;

  function findCellsByDirections(
    position: number,
    directions: ERuleDirection[],
    limit: number,
    canInvade: boolean
  ) {
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
          const allDirections = getDirections(d);

          allDirections.forEach((x) => {
            const canMoveInThisDirections = !directionsBlocked.some(
              (d) => x === d
            );

            if (canMoveInThisDirections || canInvade) {
              const nextPosition = evaluatePosition(
                ERuleDirection[x],
                position,
                end + 1,
                isLShape
              );

              console.log(x, nextPosition);

              // console.log(nextPosition, isBoardEdge(nextPosition))

              if (!isCellAvailable(nextPosition) || isBoardEdge(nextPosition)) {

                console.log(x);
                console.log(nextPosition);
                directionsBlocked.push(x);
              }
                

              availablePositions.push(nextPosition);
            }
          });
        } else {
          availablePositions.push(evaluatePosition(d, position));
        }

        seekPositions = [
          ...seekPositions,
          ...availablePositions.filter((p) => isCellAvailable(p)),
        ];
      }
    });

    const newGrid = grid.map((cell) => {
      if (seekPositions.includes(cell.position))
        return {
          ...cell,
          isAvailableStep: true,
        };

      return cell;
    });

    setGrid(newGrid);
  }

  function mount() {
    const builder = new PieceBuilder();

    if (grid?.length === 0) {
      const items = [];
      let line = "odd";

      for (let index = 0; index < 64; index++) {
        let cellPiece: IChessPiece = null;

        if (index % 8 === 0) line = line === "odd" ? "even" : "odd";
        if (isInitialPosition(index)) cellPiece = builder.build(index);

        items.push({
          position: index,
          chessPiece: cellPiece,
          line,
        } as ICell);
      }
      setGrid(items);
    }
  }

  return (
    <div className={styles.container}>
      <h2>Chess</h2>
      <div className={styles.chessboard}>
        {grid.map((cell) => (
          <ChessboardCell
            onCellClick={onCellClick}
            onPieceSelected={onPieceSelected}
            isMoving={
              selectedPiece && selectedPiece?.position === cell.position
            }
            cell={cell}
            key={cell.position}
          />
        ))}
      </div>
    </div>
  );
}
