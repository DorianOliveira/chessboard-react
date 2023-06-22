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
      // const cells = findCellsByDirections(selectedPiece.position, directions, limit);
      // console.log(cells);

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

  function findCellsByDirections(
    position: number,
    directions: ERuleDirection[],
    limit: number
  ) {
    const seekPositions: number[] = [];

    directions.forEach((d) => {
      const up = d === ERuleDirection.up;
      const down = d === ERuleDirection.down;
      const left = d === ERuleDirection.left;
      const right = d === ERuleDirection.right;
      const all = d === ERuleDirection.all;
      let modifier = up || down ? 8 : 1;

      for (let end = 0; end < limit; end++) {
        if (down || right || all) seekPositions.push(position + modifier);
        if (up || left || all) seekPositions.push(position - modifier);
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
