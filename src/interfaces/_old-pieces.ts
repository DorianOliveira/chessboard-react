// // import * as Chessboard from "./chessboard";
// // import {
// //   IChessPiece,
// //   ERuleDirection,
// //   IStepRule,
// //   EChessPieceType,
// //   ITeamSetting,
// //   ETeam,
// // } from "./chessboard";

// // export class PieceBuilder {
// //   buildList<T>(type: { new (): T }, team: ETeam, quantity = 2) {
// //     const pieces: T[] = [];
// //     for (
// //       let relativePosition = 0;
// //       relativePosition < quantity;
// //       relativePosition++
// //     ) {
// //       pieces.push(this.buildPiece(type, team, relativePosition));
// //     }

// //     return pieces;
// //   }

// //   buildPiece<T extends ChessPiece>(
// //     type: { new (): T },
// //     team: ETeam,
// //     position = 0
// //   ) {
// //     const piece = new type(team);
// //     piece.setPosition(position);
// //     piece.setImage();
// //     return piece;
// //   }

// //   buildPieces(team: ETeam) {
// //     return [
// //       this.buildPiece(King, team),
// //       this.buildPiece(Queen, team),
// //       ...this.buildList(Pawn, team, 8),
// //       ...this.buildList(Tower, team, 2),
// //       ...this.buildList(Horse, team, 2),
// //       ...this.buildList(Bishop, team, 2),
// //     ];
// //   }

// //   build(): IChessPiece[] {
// //     const teamKeys = Object.keys(ETeam);
// //     let pieces: IChessPiece[] = [];
// //     teamKeys.forEach(
// //       (key) => (pieces = [...pieces, ...this.buildPieces(ETeam[key])])
// //     );

// //     return pieces;
// //   }
// // }

// // export class ChessPiece implements IChessPiece {
// //   constructor(team: ETeam, type: EChessPieceType) {
// //     this.title = type;
// //     this.imageFolder = "/pieces";
// //     this.team = team;

// //     this.settings = {
// //       white: {},
// //       black: {},
// //     } as { white: ITeamSetting; black: ITeamSetting };
// //   }

// //   get teamPositions() {
// //     if (this.team === ETeam.white) return this.settings.white.positions;
// //     return this.settings.black.positions;
// //   }

// //   addRule(limit?: number, directions: ERuleDirection[], canInvade = false) {
// //     this.rule = {
// //       limit,
// //       directions,
// //       canInvade,
// //     } as IRule;
// //   }

// //   setPosition(index: number) {
// //     this.position = this.teamPositions[index];
// //   }

// //   setSettingsImage(whiteImageSrc: string, blackImageSrc) {
// //     this.settings.white.imageSrc = whiteImageSrc;
// //     this.settings.black.imageSrc = blackImageSrc;
// //   }

// //   addInitialPositions(whitePositions: number[], blackPositions: number[]) {
// //     this.settings.white.positions = whitePositions;
// //     this.settings.black.positions = blackPositions;
// //   }

// //   setImage() {
// //     this.imageSrc =
// //       this.team === ETeam.white
// //         ? this.settings.white.imageSrc
// //         : this.settings.black.imageSrc;
// //   }
// // }

// export class Pawn extends ChessPiece {
//   constructor(team: ETeam) {
//     super(team, EChessPieceType.pawn);
//     this.addRule();

//     const whitePositions = [];
//     const blackPositions = [];

//     for (let position = 8; position < 16; position++)
//       whitePositions.push(position);

//     for (let position = 48; position < 56; position++)
//       blackPositions.push(position);

//     this.addInitialPositions(whitePositions, blackPositions);
//     this.setSettingsImage("/pieces/pawn_white.png", "/pieces/pawn_black.png");
//   }

//   addRule() {
//     super.addRule(1, [ERuleDirection.up]);

//     this.rule = {
//       ...this.rule,
//       limitFirstStep: 2,
//     } as ISingleRule;
//   }
// }

// export class King extends ChessPiece {
//   constructor(position: number) {
//     super(position, EChessPieceType.king);
//     this.addRule(1, [ERuleDirection.onlyDiagonal, ERuleDirection.onlyStraight]);
//     this.addInitialPositions([4], [60]);
//     this.setSettingsImage("/pieces/king_white.png", "/pieces/king_black.png");
//   }
// }

// export class Queen extends ChessPiece {
//   constructor(position: number) {
//     super(position, EChessPieceType.queen);
//     this.addRule(null, [
//       ERuleDirection.onlyDiagonal,
//       ERuleDirection.onlyStraight,
//     ]);

//     this.addInitialPositions([3], [59]);
//     this.setSettingsImage("/pieces/queen_white.png", "/pieces/queen_black.png");
//   }
// }

// export class Tower extends ChessPiece {
//   constructor(position: number) {
//     super(position, EChessPieceType.tower);
//     this.addRule(null, [ERuleDirection.onlyStraight]);
//     this.addInitialPositions([0, 7], [56, 63]);
//     this.setSettingsImage("/pieces/rook_white.png", "/pieces/rook_black.png");
//   }
// }

// export class Bishop extends ChessPiece {
//   constructor(position: number) {
//     super(position, EChessPieceType.bishop);
//     this.addRule(null, [ERuleDirection.onlyDiagonal]);
//     this.addInitialPositions([1, 6], [57, 62]);
//     this.setSettingsImage(
//       "/pieces/bishop_white.png",
//       "/pieces/bishop_black.png"
//     );
//   }
// }

// export class Horse extends ChessPiece {
//   constructor(position: number) {
//     super(position, EChessPieceType.horse);
//     this.addRule(1, [ERuleDirection.lShape], true);
//     this.addInitialPositions([2, 5], [58, 61]);
//     this.setSettingsImage(
//       "/pieces/knight_white.png",
//       "/pieces/knight_black.png"
//     );
//   }
// }

