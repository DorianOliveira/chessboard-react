'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { ChessboardCell } from './chessboardCell';
import {
  IChessPiece,
  ICell,
  IChessPieceProps,
  EChessPieceType,
  ERuleDirection,
  ISingleRule,
  IStepRule,
} from '../../interfaces/_old-chessboard';

import { PieceBuilder } from '../../interfaces/_old-pieces';

export function Chessboard() {
  const [selectedPiece, setSelectedPiece] = useState<IChessPiece | null>();
  const [isTurnEnd, setIsTurnEnd] = useState(false);
  const [oldPosition, setOldPosition] = useState<boolean>(false);
  const [grid, setGrid] = useState<ICell[]>([]);

  useEffect(() => createBoard(), []);

  useEffect(() => {
    setAvailableSteps();
  }, [selectedPiece, setAvailableSteps]);

  useEffect(() => {
    if (isTurnEnd) clearAvailableSteps();
  }, [isTurnEnd, clearAvailableSteps]);

  function mapGrid(position: number): ICell[] {
    return grid.map((gridItem) => {
      if (gridItem.position === position) {
        const newItem = {
          ...gridItem,
          chessPiece: {
            ...selectedPiece,
            position,
          } as IChessPiece,
        } as ICell;
        return newItem;
      }

      if (gridItem.position === selectedPiece?.position)
        return {
          ...gridItem,
          chessPiece: null,
        } as ICell;

      return gridItem;
    });
  }

  function onCellClick(position: number) {
    const clickedCell = grid.find((cell) => cell.position === position);

    const hasValidStep = grid.some(
      (cell) => cell.position === position && cell.isAvailableStep
    );

    if (!clickedCell?.chessPiece && selectedPiece && hasValidStep) {
      setGrid(mapGrid(position));
      setSelectedPiece(null);
      setIsTurnEnd(true);
    }
  }

  function onPieceSelected(piece: IChessPiece) {
    setSelectedPiece(piece);
    setIsTurnEnd(false);
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

    // if (isDiagonal(direction))

    if (isDiagonalLeft(direction) && isDiagonalUp(direction))
      modifier = isLShape ? 17 : 9;
    if (isDiagonalLeft(direction) && isDiagonalBottom(direction))
      modifier = isLShape ? 17 : 7;
    if (isDiagonalRight(direction) && isDiagonalUp(direction))
      modifier = isLShape ? 15 : 7;
    if (isDiagonalRight(direction) && isDiagonalBottom(direction))
      modifier = isLShape ? 15 : 9;

    // if (isDiagonalRight(direction)) modifier = isLShape ? 15 : 9;
    // if (isDiagonalUp(direction)) modifier = isLShape ? 15 : 7;

    // if (isDiagonalLeft(direction)) modifier = isLShape ? 17 : 9;
    // if (isDiagonalBottom(direction)) modifier = isLShape ? 17 : 7;

    if (isLShapeMajor) modifier = 10;
    else if (isLShapeMinor) modifier = 6;

    if (isNegativeStep(direction)) modifier *= -1;

    return position + modifier * step;
  }

  const isCellAvailable = (position: number) =>
    grid.some((cell) => cell.position === position && !cell.chessPiece);

  const isInitialPosition = (position: number) =>
    (position >= 0 && position < 16) || (position >= 48 && position <= 64);

  const isBoardEdge = (position: number, keyDirection: string): boolean => {
    const direction = ERuleDirection[keyDirection];

    const limits: {
      min?: number;
      max?: number;
      edge: 'horizontal' | 'vertical';
    }[] = [];

    const isUpDirection =
      direction === ERuleDirection.up ||
      direction === ERuleDirection.upLeft ||
      direction === ERuleDirection.upRight;

    const isBottomDirection =
      direction === ERuleDirection.bottom ||
      direction === ERuleDirection.downLeft ||
      direction === ERuleDirection.downRight;

    const isLeftDirection =
      direction === ERuleDirection.left ||
      direction === ERuleDirection.downLeft ||
      direction === ERuleDirection.upLeft;

    const isRightDirection =
      direction === ERuleDirection.right ||
      direction === ERuleDirection.downRight ||
      direction === ERuleDirection.upRight;

    // console.log(isUpDirection, isBottomDirection, isLeftDirection, isRightDirection)

    if (isUpDirection)
      limits.push({
        min: 0,
        max: 7,
      });

    if (isBottomDirection)
      limits.push({
        min: 56,
        max: 63,
      });

    if (isLeftDirection)
      limits.push({
        min: 0,
        max: 56,
        edge: 'vertical',
      });

    if (isRightDirection)
      limits.push({
        min: 7,
        max: 63,
        edge: 'vertical',
      });

    let isEdge = false;

    limits.forEach((limit) => {
      const { min, max, edge } = limit;
      const modifier = edge === 'vertical' ? 8 : 1;
      const searchPositions = [];
      for (let i = min; i < max; i += modifier) searchPositions.push(i);
      isEdge ||= searchPositions.includes(position);
    });

    return isEdge;
  };

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
            const direction = ERuleDirection[x];
            const canMoveInThisDirections = !directionsBlocked.some(
              (d) => x === d
            );

            if (
              (canMoveInThisDirections || canInvade) &&
              !isBoardEdge(position, direction)
            ) {
              const nextPosition = evaluatePosition(
                direction,
                position,
                end + 1,
                isLShape
              );

              if (
                !isCellAvailable(nextPosition) ||
                isBoardEdge(nextPosition, direction)
              ) {
                directionsBlocked.push(x);
              }

              // if (!isBoardEdge(position, direction))
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
      const isAvailableStep = seekPositions.includes(cell.position);

      return {
        ...cell,
        isAvailableStep,
      };
    });

    setGrid(newGrid);
  }

  function createBoard() {
    const builder = new PieceBuilder();

    const pieces = builder.build();
    if (grid?.length === 0) {
      let items = [];
      let line = 'odd';

      for (let index = 0; index < 64; index++) {
        if (index % 8 === 0) line = line === 'odd' ? 'even' : 'odd';
        const chessPiece = pieces.find((piece) => piece.position === index);

        items.push({
          position: index,
          line,
          chessPiece,
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
