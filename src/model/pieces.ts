import { EChessPieceType, ERuleDirection, ETeam } from '@/enums/enums';
import {
  ICaptureRule,
  IChessPiece,
  IRule,
  ISingleRule,
  ITeamSetting,
} from '@/interfaces/interfaces';

const settings = {
  imageFolder: '/pieces',
};

export class ChessPiece implements IChessPiece {
  position!: number;
  imageSrc!: string;
  title: string;
  team: ETeam;
  settings: { white: ITeamSetting; black: ITeamSetting };
  rule?: IRule;
  captureRule: ICaptureRule;

  constructor(team: ETeam, type: EChessPieceType) {
    this.title = type;
    this.team = team;
    this.captureRule = {
      canCaptureOnDrop: true,
    } as ICaptureRule;

    this.settings = {
      white: {},
      black: {},
    } as { white: ITeamSetting; black: ITeamSetting };
  }

  get teamPositions() {
    if (this.team === ETeam.white) return this.settings.white.positions;
    return this.settings.black.positions;
  }

  setCaptureRule(captureRule: ICaptureRule) {
    this.captureRule = captureRule;
  }

  addRule(limit?: number | null, directions?: ERuleDirection[], canInvade = false) {
    this.rule = {
      limit,
      directions,
      canInvade,
    } as IRule;
  }

  setPosition(index: number) {
    this.position = this.teamPositions[index];
  }

  setSettingsImage(whiteImageSrc: string, blackImageSrc: string) {
    this.settings.white.imageSrc = whiteImageSrc;
    this.settings.black.imageSrc = blackImageSrc;
  }

  addInitialPositions(whitePositions: number[], blackPositions: number[]) {
    this.settings.white.positions = whitePositions;
    this.settings.black.positions = blackPositions;
  }

  setImage() {
    const folder = settings.imageFolder;
    let src = this.settings.white.imageSrc;

    if (this.team === ETeam.black) src = this.settings.black.imageSrc;
    this.imageSrc = `${folder}/${src}`;
  }
}

export class Pawn extends ChessPiece {
  constructor(team: ETeam) {
    super(team, EChessPieceType.pawn);
    this.addRule();

    this.setCaptureRule({
      directions: [ERuleDirection.leftUp, ERuleDirection.rightUp],
    } as ICaptureRule);

    const whitePositions = [];
    const blackPositions = [];

    for (let position = 8; position < 16; position++) whitePositions.push(position);

    for (let position = 48; position < 56; position++) blackPositions.push(position);

    this.addInitialPositions(whitePositions, blackPositions);
    this.setSettingsImage('pawn_white.png', 'pawn_black.png');
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
  constructor(team: ETeam) {
    super(team, EChessPieceType.king);
    this.addRule(1, [ERuleDirection.onlyDiagonal, ERuleDirection.onlyStraight]);
    this.addInitialPositions([4], [60]);
    this.setSettingsImage('king_white.png', 'king_black.png');
  }
}

export class Queen extends ChessPiece {
  constructor(team: ETeam) {
    super(team, EChessPieceType.queen);
    this.addRule(null, [ERuleDirection.onlyDiagonal, ERuleDirection.onlyStraight]);

    this.addInitialPositions([3], [59]);
    this.setSettingsImage('queen_white.png', 'queen_black.png');
  }
}

export class Rook extends ChessPiece {
  constructor(team: ETeam) {
    super(team, EChessPieceType.tower);
    this.addRule(null, [ERuleDirection.onlyStraight]);
    this.addInitialPositions([0, 7], [56, 63]);
    this.setSettingsImage('rook_white.png', 'rook_black.png');
  }
}

export class Bishop extends ChessPiece {
  constructor(team: ETeam) {
    super(team, EChessPieceType.bishop);
    this.addRule(null, [ERuleDirection.onlyDiagonal]);
    this.addInitialPositions([1, 6], [57, 62]);
    this.setSettingsImage('bishop_white.png', 'bishop_black.png');
  }
}

export class Knight extends ChessPiece {
  constructor(team: ETeam) {
    super(team, EChessPieceType.horse);
    this.addRule(1, [ERuleDirection.lShape], true);
    this.addInitialPositions([2, 5], [58, 61]);
    this.setSettingsImage('knight_white.png', 'knight_black.png');
  }
}
