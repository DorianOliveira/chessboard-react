import styles from './board.module.css';
import { ChessPiece } from "../chess/chess-piece";
import { IBoardCellProps } from "../../interfaces/props";

export function BoardCell(props: IBoardCellProps) {

  const { isAvailableStep, position, line, chessPiece } = props.cell;

  const positionClassName = line === "odd" ? styles.odd : styles.even;
  const movingClassName = props.isMoving ? styles.moving : "";
  const availableStepClassName = isAvailableStep ? styles.availableStep : "";
  const className = `${styles.square} ${positionClassName} ${movingClassName} ${availableStepClassName}`;

  function onPieceSelected() {
    props.onPieceSelected(chessPiece);
  }

  function onClick() {
    props.onCellClick(props.cell);
  }

  return (
    <div className={className} onClick={onClick}>
      <strong style={{ color: "#777", fontSize: "0.7rem" }}>{position}</strong>
      {chessPiece ? (
        <ChessPiece onSelected={onPieceSelected} piece={chessPiece} />
      ) : null}
    </div>
  );
}
