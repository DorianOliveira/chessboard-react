export enum ERuleDirection {
  //Todas as direções
  all = 0,

  //Todas as direções não-diagonais
  onlyStraight,

  //Todas as direções diagonais
  onlyDiagonal,

  //Direções no formato L-Shape
  lShape,

  //Direções retas
  up,
  right,
  bottom,
  left,

  //Direções diagonais
  upRight,
  upLeft,
  downRight,
  downLeft,

  leftUp,
  leftBottom,
  rightUp,
  rightBottom,
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
  white = "white",
  black = "black",
}
