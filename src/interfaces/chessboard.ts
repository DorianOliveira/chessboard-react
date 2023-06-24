export interface IChessPiece {
  position: number;
  imageSrc: string;

  title: string;
  rule: IRule;
  team: ETeam;
  settings: { white: ITeamSetting; black: ITeamSetting };

  imageFolder: string;
}

export interface ITeamSetting {
  positions: number[];
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

export interface IRule {
  canInvade: boolean;
}

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
  direction: IRuleDirection;
  patterns: number[];
  blockPatternOnChangeDirection: boolean;
  allowBackToLastPosition: boolean;
}

export enum ERuleDirection {
  //Todas as direções
  all = "all",

  //Todas as direções não-diagonais
  onlyStraight = "onlyStraight",

  //Todas as direções diagonais
  onlyDiagonal = "onlyDiagonal",

  //Direções no formato L-Shape
  lShape = "lShape",

  //Direções retas
  up = "up",
  right = "right",
  bottom = "bottom",
  left = "left",

  //Direções diagonais
  upRight = "upRight",
  upLeft = "upLeft",
  downRight = "downRight",
  downLeft = "downLeft",

  leftUp = "leftUp",
  leftBottom = "leftBottom",
  rightUp = "rightUp",
  rightBottom = "rightBottom",
}

export enum EChessPieceType {
  pawn = "Peão",
  tower = "Torre",
  bishop = "Bispo",
  horse = "Cavalo",
  queen = "Rainha",
  king = "Rei",
}

export enum ETeam {
  white = 'white'
  black = 'black'
}
