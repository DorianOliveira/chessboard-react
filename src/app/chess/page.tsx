"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import {
  IChessPiece,
  ICell,
  IChessPieceProps,
} from "./../../interfaces/chessboard";

function ChessboardCell(props: ICellProps) {
  const positionStyle = props.type === "odd" ? styles.odd : styles.even;
  const movingStyle = props.isMoving ? styles.moving : "";
  const className = `${styles.square} ${positionStyle} ${movingStyle}`;

  function onPieceSelected() {
    props.onPieceSelected(props.chessPiece);
  }

  function onClick() {
    props.onCellClick(props.position, props.chessPiece);
  }

  return (
    <div className={className} onClick={onClick}>
      <strong style={{ color: "#ccc" }}>{props.position}</strong>
      {props.chessPiece ? (
        <ChessPiece
          onSelected={onPieceSelected}
          chessPiece={props.chessPiece}
        />
      ) : null}
    </div>
  );
}

function ChessPiece(props: IChessPieceProps) {
  const [piece, setPiece] = useState<IChessPiece>(null);

  function onChessPieceSelected() {
    props.onSelected(props.piece);
  }

  return (
    <div onMouseDown={onChessPieceSelected} className={styles.chesspiece} />
  );
}

function Chessboard() {
  // const [cells, setCells] = useState<ChessboardCell[]>(null);

  const [selectedPiece, setSelectedPiece] = useState<IChessPiece>(null);
  const [oldPosition, setOldPosition] = useState<boolean>(false);

  const [grid, setGrid] = useState<ICell[]>([]);

  useEffect(() => mount(), []);

  function onCellClick(position: number) {
    const newGrid = grid.map((gridItem) => {
      if (gridItem.position === position)
        return {
          ...gridItem,
          chessPiece: selectedPiece,
        };

      if (gridItem.position === selectedPiece.position)
        return {
          ...gridItem,
          chessPiece: null,
        };

      return gridItem;
    });

    setGrid(newGrid);
  }

  function onPieceSelected(piece: IChessPiece) {
    const gridItem = grid.find((cell) => cell.position === piece.position);
    setSelectedPiece(gridItem.chessPiece);

    // if (!selectedPiece) {
    //   setSelectedPiece(piece);
    // } else {
    //   setOldPosition(selectedPiece.position);
    //   setSelectedPiece({
    //     ...selectedPiece,
    //     position,
    //   });
    // }
  }

  function mount() {
    if (grid?.length === 0) {
      const items = [];

      let type = "odd";

      for (let index = 0; index < 64; index++) {
        if (index % 8 === 0) type = type === "odd" ? "even" : "odd";

        let cellPiece: IChessPiece = null;

        const isInitialPosition =
          (index >= 0 && index < 16) || (index >= 48 && index <= 64);

        if (isInitialPosition) {
          cellPiece = {
            position: index,
            title: `ChessPiece-${index}`,
          } as IChessPiece;
        }

        items.push({
          position: index,
          chessPiece: cellPiece,
          type,
        } as ICell);
      }
      setGrid(items);
    }
  }

  // for (let index = 0; index < 64; index++) {
  //   if (index % 8 === 0) type = type === 'odd' ? 'even' : 'odd'

  //   let cellPiece: IChessPiece = null;
  //   let position = selectedPiece?.position;

  //   const isInitialPosition =
  //     (index >= 0 && index < 16) ||
  //     (index >= 48 && index <= 64 && index !== oldPosition);

  //   if (isInitialPosition && !position) position = index;

  //   if (position === index || isInitialPosition) {
  //     cellPiece = {
  //       position,
  //       title: `ChessPiece-${position}`,
  //     } as IChessPiece;
  //   }

  //   items.push({
  //     position: index,
  //     chessPiece: cellPiece,
  //     type
  //   } as ICell);
  // }

  console.log(grid);

  return (
    <div className={styles.container}>
      <h2>Chess</h2>
      <div className={styles.chessboard}>
        {grid.map((cell) => (
          <ChessboardCell
            onCellClick={onCellClick}
            onPieceSelected={onPieceSelected}
            isMoving={selectedPiece?.position === cell.position}
            position={cell.position}
            chessPiece={cell.chessPiece}
            type={cell.type}
            key={cell.position}
          />
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return <Chessboard />;
}
