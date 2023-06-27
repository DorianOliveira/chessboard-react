import { IBoardCell, IChessPiece } from "../../interfaces/interfaces";
import { BoardCell } from "./board-cell";
import { IBoardProps } from "../../interfaces/props";
import { useEffect, useState } from "react";
import styles from "./board.module.css";

export function Board(props: IBoardProps) {
  const { selectedPiece } = props;
  const [grid, setGrid] = useState<IBoardCell[] | undefined>([]);

  useEffect(() => build(), []);
  useEffect(() => addPieces(), [props.pieces]);
  useEffect(() => {
    if (props.allowedMoves) {
      const newGrid = grid?.map((cell) => {
        const isAvailableStep = props.allowedMoves?.includes(cell.position);

        return {
          ...cell,
          isAvailableStep,
        };
      });

      setGrid(newGrid);
    }
  }, [props.allowedMoves]);

  function mapGrid(position: number): IBoardCell[] | undefined {
    return grid?.map((gridItem) => {
      if (gridItem.position === position) {
        const newItem = {
          ...gridItem,
          chessPiece: {
            ...selectedPiece,
            position,
          } as IChessPiece,
        } as IBoardCell;
        return newItem;
      }

      if (gridItem.position === selectedPiece?.position)
        return {
          ...gridItem,
          chessPiece: null,
        } as IBoardCell;

      return gridItem;
    });
  }

  useEffect(() => {
    if (props.selectedMove) {
      setGrid(mapGrid(props.selectedMove));
    }
  }, [props.selectedMove]);

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
    if (props.onCellClick) props.onCellClick(cell);
  }

  function onPieceSelected(piece: IChessPiece) {
    if (props.onPieceSelected) props.onPieceSelected(piece);
  }

  return (
    <div className={styles.container}>
      <h1>Chess</h1>
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
