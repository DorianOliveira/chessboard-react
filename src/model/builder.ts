import { ETeam } from "@/enums/enums";
import { Bishop, ChessPiece, King, Knight, Pawn, Queen, Rook } from "./pieces";
import { IChessPiece } from "@/interfaces/interfaces";

export class PieceBuilder {
  buildList<T extends ChessPiece>(type: { new(team: ETeam): T }, team: ETeam, quantity = 2) {
    const pieces: T[] = [];
    for (
      let relativePosition = 0;
      relativePosition < quantity;
      relativePosition++
    ) {
      pieces.push(this.buildPiece(type, team, relativePosition));
    }

    return pieces;
  }

  buildPiece<T extends ChessPiece>(
    activator: { new(team: ETeam): T },
    team: ETeam,
    position = 0
  ) {
    const piece = new activator(team);
    piece.setPosition(position);
    piece.setImage();
    return piece;
  }

  buildPieces(team: ETeam) {
    return [
      this.buildPiece(King, team),
      this.buildPiece(Queen, team),
      ...this.buildList(Pawn, team, 8),
      ...this.buildList(Rook, team, 2),
      ...this.buildList(Knight, team, 2),
      ...this.buildList(Bishop, team, 2),
    ];
  }

  build(): IChessPiece[] {
    return [
      ...this.buildPieces(ETeam.black),
      ...this.buildPieces(ETeam.white),
    ]
  }
}
