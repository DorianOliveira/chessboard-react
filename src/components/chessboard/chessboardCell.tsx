import React, { useState } from "react";
import styles from "./styles.module.css";
import {
  ICellProps,
  IChessPieceProps,
  IChessPiece,
} from "./../../interfaces/chessboard";

function ChessPiece(props: IChessPieceProps) {
  const [piece, setPiece] = useState<IChessPiece>(null);

  function onChessPieceSelected() {
    props.onSelected(props.piece);
  }
  return (
    <div onMouseDown={onChessPieceSelected} className={styles.chesspiece}>
      {props.piece.title}
    </div>
  );
}

export function ChessboardCell(props: ICellProps) {
  const { isMoving, cell } = props;
  const { isAvailableStep, position, line, chessPiece } = cell;

  const positionClassName = line === "odd" ? styles.odd : styles.even;
  const movingClassName = props.isMoving ? styles.moving : "";
  const availableStepClassName = isAvailableStep ? styles.availableStep : "";
  const className = `${styles.square} ${positionClassName} ${movingClassName} ${availableStepClassName}`;

  function onPieceSelected() {
    props.onPieceSelected(chessPiece);
  }

  function onClick() {
    props.onCellClick(position, chessPiece);
  }

  return (
    <div className={className} onClick={onClick}>
      <strong style={{ color: "#ccc" }}>{position}</strong>
      {chessPiece ? (
        <ChessPiece onSelected={onPieceSelected} piece={chessPiece} />
      ) : null}
    </div>
  );
}
