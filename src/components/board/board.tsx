import { IBoardCell, IChessPiece } from "../../interfaces/interfaces";

import { BoardCell } from "./board-cell";
import { IBoardProps } from "../../interfaces/props";
import styles from "./board.module.css";
import { useEffect, useState } from "react";

export function Board(props: IBoardProps) {
  const { selectedPiece } = props;
  const [grid, setGrid] = useState<IBoardCell[] | undefined>([]);

  useEffect(() => build(), []);
  useEffect(() => addPieces(), [props.pieces]);
  useEffect(() => {

    // console.log(props.targetPositions);
    // if (props.targetPositions) {
    //   const newGrid = grid?.map((cell) => {
    //     const isAvailableStep = props.targetPositions?.includes(cell.position);

    //     return {
    //       ...cell,
    //       isAvailableStep,
    //     };
    //   });

    //   setGrid(newGrid);
    // }
  }, [props.targetPositions]);

  // function updateGrid(updatedGrid?: IBoardCell[]) {
  //   if (updatedGrid) {
  //     setGrid(updatedGrid);
  //     if (props.onUpdateGrid) props.onUpdateGrid(grid);
  //   }
  // }

  function updateCell(cell?: IBoardCell) {
    if (cell) {
      const updatedGrid = grid?.map((g) => {
        if (g.position === cell.position) g = cell;
        return g;
      });

      setGrid(updatedGrid);
    }

    return grid;
  }

  function addPieces() {
    if (props.pieces) {
      props.pieces.forEach((piece) => {
        const cell = grid?.find((c) => piece.position === c.position);
        if (cell) cell.chessPiece = piece;
        updateCell(cell);
      });
    }
  }

  function build() {
    if (grid?.length === 0) {
      let items = [];
      let line = "odd";

      for (let index = 0; index < 64; index++) {
        if (index % 8 === 0) line = line === "odd" ? "even" : "odd";

        items.push({
          position: index,
          line,
        } as IBoardCell);
      }

      setGrid(items);
    }
  }

  function onCellClick(cell?: IBoardCell) {
    const clickedCell = grid?.find((g) => g.position === cell?.position);

    const hasValidStep = grid?.some(
      (cell) => cell.position === cell.position && cell.isAvailableStep
    );

    if (props.onCellClick) props.onCellClick(clickedCell);

    // if (!clickedCell?.chessPiece && selectedPiece && hasValidStep) {
    //   setGrid(mapGrid(position));
    //   setSelectedPiece(null);
    //   setIsTurnEnd(true);
    // }
  }

  function onPieceSelected(piece: IChessPiece) {
    if (props.onPieceSelected) props.onPieceSelected(piece);
    // setSelectedPiece(piece);
    // setIsTurnEnd(false);
  }

  return (
    <div className={styles.container}>
      <h2>Chess</h2>
      <div className={styles.chessboard}>
        {grid?.map((cell: IBoardCell) => (
          <BoardCell
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
