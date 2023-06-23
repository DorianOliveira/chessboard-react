// import * as Chessboard from "./chessboard";
import { ERuleDirection, IStepRule, EChessPieceType } from "./chessboard";

export class PieceBuilder {
  build(position: number): IChessPiece {
    if (Utils.between(position, 8, 16) || Utils.between(position, 48, 56))
      return new Pawn(position);

    if (Utils.is(position, [60, 4])) return new King(position);

    if (Utils.is(position, [59, 3])) return new Queen(position);

    if (Utils.is(position, [1, 6, 57, 62])) return new Bishop(position);

    if (Utils.is(position, [0, 7, 56, 63])) return new Tower(position);

    if (Utils.is(position, [2, 5, 58, 61])) return new Horse(position);
  }
}

export class ChessPiece implements IChessPiece {
  constructor(position: number, type: EChessPieceType) {
    this.position = position;
    this.title = type;
  }

  addRule(limit?: number, directions: ERuleDirection[], canInvade = false) {
    this.rule = {
      limit,
      directions,
      canInvade
    } as IRule;
  }
}

export class Pawn extends ChessPiece {
  constructor(position: number) {
    super(position, EChessPieceType.pawn);
    this.addRule();
  }

  addRule() {
    super.addRule(1, [ERuleDirection.up]);

    this.rule = {
      ...this.rule,
      limitFirstStep: 2,
    } as ISingleRule;
  }
}

export class King extends ChessPiece {
  constructor(position: number) {
    super(position, EChessPieceType.king);
    this.addRule(1, [ERuleDirection.all]);
  }
}

export class Queen extends ChessPiece {
  constructor(position: number) {
    super(position, EChessPieceType.queen);
    this.addRule(null, [ERuleDirection.all]);
  }
}

export class Tower extends ChessPiece {
  constructor(position: number) {
    super(position, EChessPieceType.tower);
    this.addRule(null, [ERuleDirection.onlyStraight]);
  }
}

export class Bishop extends ChessPiece {
  constructor(position: number) {
    super(position, EChessPieceType.bishop);
    this.addRule(null, [ERuleDirection.onlyDiagonal]);
  }
}

export class Horse extends ChessPiece {
  constructor(position: number) {
    super(position, EChessPieceType.horse);
    this.addRule(1, [ERuleDirection.lShape], true);
  }
}

export class Utils {
  static between = (source: number, start: number, end: number): boolean =>
    source >= start && source < end;

  static is = (source: number, numbers: number[]) =>
    numbers.some((n) => n === source);
}
