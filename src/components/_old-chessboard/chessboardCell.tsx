// import React, { useState, useEffect } from "react";
// import styles from "./styles.module.css";
// import Image from "next/image";
// import {
//   ICellProps,
//   IChessPieceProps,
//   IChessPiece,
// } from "../../interfaces/_old-chessboard";

// function ChessPiece(props: IChessPieceProps) {
//   function onChessPieceSelected() {
//     props.onSelected(props.piece);
//   }

//   return (
//     <div
//       title={props.piece.title}
//       onMouseDown={onChessPieceSelected}
//       className={styles.chesspiece}
//     >
//       {props.piece?.imageSrc ? (
//         <Image
//           src={props.piece.imageSrc}
//           width={60}
//           height={60}
//           alt={props.piece.title}
//         />
//       ) : null}
//     </div>
//   );
// }

// export function ChessboardCell(props: ICellProps) {
//   const { isMoving, cell } = props;
//   const { isAvailableStep, position, line, chessPiece } = cell;

//   const positionClassName = line === "odd" ? styles.odd : styles.even;
//   const movingClassName = props.isMoving ? styles.moving : "";
//   const availableStepClassName = isAvailableStep ? styles.availableStep : "";
//   const className = `${styles.square} ${positionClassName} ${movingClassName} ${availableStepClassName}`;

//   function onPieceSelected() {
//     props.onPieceSelected(chessPiece);
//   }

//   function onClick() {
//     props.onCellClick(position, chessPiece);
//   }

//   return (
//     <div className={className} onClick={onClick}>
//       <strong style={{ color: "#777", fontSize: "0.7rem" }}>{position}</strong>
//       {chessPiece ? (
//         <ChessPiece onSelected={onPieceSelected} piece={chessPiece} />
//       ) : null}
//     </div>
//   );
// }
