import { ERuleDirection, ETeam } from '@/enums/enums';

export interface IRule {
  canInvade: boolean;
}

export interface ISingleRule extends IRule {
  limitFirstStep?: number;
  limit?: number;
  directions: ERuleDirection[];
}

export interface ICaptureRule extends IRule {
  canCaptureOnDrop?: boolean;
  directions: ERuleDirection[];
}

/**
 * Define as regras de passos complexos para: Cavalo
 */
export interface IStepRule extends IRule {
  direction: ERuleDirection;
  patterns: number[];
  blockPatternOnChangeDirection: boolean;
  allowBackToLastPosition: boolean;
}

export interface ITeamSetting {
  positions: number[];
  imageSrc: string;
}

export interface IBoardCell {
  position: number;
  chessPiece?: IChessPiece | null;
  line: 'odd' | 'even';
  isAvailableStep?: boolean;
}

export interface IChessPiece {
  position: number;
  imageSrc: string;
  title: string;
  rule?: IRule;
  captureRule: ICaptureRule;
  team: ETeam;
  settings: { white: ITeamSetting; black: ITeamSetting };
}
