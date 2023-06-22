export interface IChessPiece {
  position: number;
  title: string;
  rule: IRule;
  imageSrc: string;
}


export interface ICell {
  position: number;
  chessPiece: IChessPiece;
  line: "odd" | "even";
  isAvailableStep: boolean;
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

export interface IRule {}

/**
 * Define as regras de passos para: Peão, Torre, Rei, Rainha, Bispo
 *
 */
export interface ISingleRule extends IRule {
  limitFirstStep?: number;
  limit?: number;
  directions: ERuleDirection[];
}

/**
 * Define as regras de passos complexos para: Cavalo
 */
export interface IStepRule extends IRule {
  steps: IStep[];
}

export interface IStep {
  direction: IRuleDirection;
}
export enum ERuleDirection {
  all = "all",
  up = "up",
  right = "down",
  bottom = "bottom",
  left = "left",
}

export enum EChessPieceType {
  pawn = "Peão",
  tower = "Torre",
  bishop = "Bispo",
  horse = "Cavalo",
  queen = "Queen",
  king = "Rei",
}
