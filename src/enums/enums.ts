export enum ERuleDirection {
  //Todas as direções
  all = 'All',

  //Todas as direções não-diagonais
  onlyStraight = 'Only Straight',

  //Todas as direções diagonais
  onlyDiagonal = 'Only Diagonal',

  //Direções no formato L-Shape
  lShape = 'L Shape',

  //Direções retas
  up = 'Up',
  right = 'Right',
  bottom = 'Bottom',
  left = 'Left',

  //Direções diagonais
  upRight = 'Up Right',
  upLeft = 'Up Left',
  downRight = 'Down Right',
  downLeft = 'Down Left',

  leftUp = 'Left Up',
  leftBottom = 'Left Bottom',
  rightUp = 'Right Up',
  rightBottom = 'Right Bottom',
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
