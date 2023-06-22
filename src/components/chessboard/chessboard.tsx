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
      const { directions, limit } = selectedPiece.rule;

      findCellsByDirections(selectedPiece.position, directions, limit);
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
  function getDirections() {
    return Object.keys(ERuleDirection).filter(
      (x) =>
        x !== ERuleDirection.onlyStraight &&
        x !== ERuleDirection.onlyDiagonal &&
        x !== ERuleDirection.all
    );
  }

  function evaluatePosition(
    direction: ERuleDirection,
    position: number,
    step = 1
  ) {
    switch (direction) {
      case ERuleDirection.left:
        return position - 1 * step;
      case ERuleDirection.right:
        return position + 1 * step;
      case ERuleDirection.bottom:
        return position + 8 * step;
      case ERuleDirection.up:
        return position - 8 * step;
      case ERuleDirection.upRight:
        return position - 7 * step;
      case ERuleDirection.upLeft:
        return position - 9 * step;
      case ERuleDirection.downRight:
        return position + 7 * step;
      case ERuleDirection.downLeft:
        return position + 9 * step;
    }
  }

  function isCellAvailable(position: number) {
    return grid.some((cell) => cell.position === position && !cell.chessPiece);
  }

  function findCellsByDirections(
    position: number,
    directions: ERuleDirection[],
    limit: number
  ) {
    let seekPositions: number[] = [];

    directions.forEach((d) => {
      const up = d === ERuleDirection.up;
      const down = d === ERuleDirection.down;
      const left = d === ERuleDirection.left;
      const right = d === ERuleDirection.right;
      const all = d === ERuleDirection.all;
      const onlyStraight = d === ERuleDirection.onlyStraight;
      const onlyDiagonal = d === ERuleDirection.onlyDiagonal;

      let modifier = up || down ? 8 : 1;
      // let availablePosition = position;

      const availablePositions = [];

      let nextPosition = position;
      // const checkPosition = () => grid.some((cell) => availablePosition === cell.position);

      if (!limit) limit = 8;

      for (
        let end = 0;
        end < limit;
        // || !checkPosition()
        end++
      ) {
        if (all) {
          const allDirections = getDirections();
          allDirections.forEach((x) => {
            availablePositions.push(
              evaluatePosition(ERuleDirection[x], position, end + 1)
            );
          });
        } else {
          availablePositions.push(evaluatePosition(d, position));
        }

        seekPositions = [
          ...seekPositions,
          ...availablePositions.filter((p) => isCellAvailable(p)),
        ];

        modifier += modifier;
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
        if (index % 8 === 0) line = line === "odd" ? "even" : "odd";

        let cellPiece: IChessPiece = null;

        const isInitialPosition =
          (index >= 0 && index < 16) || (index >= 48 && index <= 64);

        if (isInitialPosition) cellPiece = builder.build(index);

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
