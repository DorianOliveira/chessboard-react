import * as Chessboard from "./chessboard";

export class PieceBuilder {
  build(position: number): IChessPiece {
    if (Utils.between(position, 8, 16) || Utils.between(position, 48, 56))
      return new Pawn(position);

    if (Utils.is(position, [60, 4])) return new King(position);
  }
}

export class ChessPiece implements IChessPiece {
  constructor(position: number, type: EChessPieceType) {
    this.position = position;
    this.title = type;
  }

  addRule(limit: number, directions: ERuleDirection[]) {
    this.rule = {
      limit,
      directions,
    } as IRule;
  }
}

export class Pawn extends ChessPiece {
  constructor(position: number) {
    super(position, Chessboard.EChessPieceType.pawn);
    this.addRule();
  }

  addRule() {
    super.addRule(1, [Chessboard.ERuleDirection.up]);

    this.rule = {
      ...this.rule,
      limitFirstStep: 2,
    } as ISingleRule;
  }
}

export class King extends ChessPiece {
  constructor(position: number) {
    super(position, Chessboard.EChessPieceType.king);
    this.addRule([Chessboard.ERuleDirection.All]);
  }
}

export class Utils {
  static between = (source: number, start: number, end: number): boolean =>
    source >= start && source < end;

  static is = (source: number, numbers: number[]) =>
    numbers.some((n) => n === source);
}
