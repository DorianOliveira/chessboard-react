export interface IChessPiece {
  position: number;
  title: string;
}

export interface ICell {
  position: number;
  chessPiece: IChessPiece;
  line: 'odd' | 'even';
}

export interface ICellProps {
  position: number;
  chessPiece: IChessPiece;
  isStart: boolean;
  isMoving: boolean;
  onPieceSelected: (piece: IChessPiece) => void;
  onCellClick: (position: number, piece: IChessPiece) => void;
}

export interface IChessPieceProps {
  onSelected: (piece: IChessPiece) => void;
  piece: IChessPiece;

}
