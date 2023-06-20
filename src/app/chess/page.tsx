"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { IChessPiece } from "./../../interfaces/chessboard";

function ChessboardCell(props) {
  // const [piece, setPiece] = useState<IChessPiece>(null);
  const [isMoving, setIsMoving] = useState<boolean>(false);

  const positionStyle = props.isStart ? styles.start : styles.end;
  const movingStyle = isMoving ? styles.moving : "";

  // useEffect(() => {
  //   if (props.piece) setPiece(state => piece);
  // }, []);

  return (
    <div
      onMouseDown={() => {
        setIsMoving((_) => !_);
        props.onCellMouseDown(props.piece);
      }}
      className={`${styles.square} ${positionStyle} ${movingStyle}`}
    >
      {props.piece ? <ChessPiece /> : null}
    </div>
  );
}

function ChessPiece() {
  const [piece, setPiece] = useState<IChessPiece>(null);

  return <div className={styles.chesspiece} />;
}

function Chessboard(props) {
  // const [cells, setCells] = useState<ChessboardCell[]>(null);

  const [isBoardMount, setIsBoardMount] = useState(true);
  const [selectedPiece, setSelectedPiece] = useState<IChessPiece>(null);

  let isStart = false;


  const items = [];

  for (let index = 0; index < 64; index++) {
    if (index % 8 === 0) isStart = !isStart;

    let cellPiece: IChessPiece = null;

    
    if ((index >= 0 && index < 16) || (index >= 48 && index <= 64))
      cellPiece = {
        title: `ChessPiece-${index}`,
      } as IChessPiece;

    items.push(
      <ChessboardCell
        onCellMouseDown={(piece: IChessPiece) => {
          if (!selectedPiece) setSelectedPiece(piece);
        }}
        piece={cellPiece}
        key={index}
        isStart={isStart}
      />
    );
  }

  return (
    <div className={styles.container}>
      <h2>Chess</h2>
      <div className={styles.chessboard}>{items}</div>
    </div>
  );
}

export default function Page() {
  return <Chessboard />;
}
