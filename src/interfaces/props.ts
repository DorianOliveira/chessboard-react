import { IBoardCell, IChessPiece } from "./interfaces";

export interface IBoardProps {
  selectedPiece?: IChessPiece | undefined;
  pieces?: IChessPiece[];
  allowedMoves?: number[];
  selectedMove?: number;
  onCellClick: (cell?: IBoardCell) => void;
  onPieceSelected: (piece: IChessPiece) => void;
  onUpdateGrid?: (grid: IBoardCell[] | undefined) => void;
}

export interface IBoardCellProps {
  // position: number;
  // chessPiece: IChessPiece;
  cell: IBoardCell;
  // isStart: boolean;
  isMoving?: boolean;
  onPieceSelected: (piece: IChessPiece) => void;
  onCellClick: (cell: IBoardCell) => void;
}

export interface IChessPieceProps {
  onSelected: (piece: IChessPiece) => void;
  piece: IChessPiece;
}
