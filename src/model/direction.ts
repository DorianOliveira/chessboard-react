import { EChessPieceType, ERuleDirection, ETeam } from '@/enums/enums';

export class DirectionHelper {
  static getDirections(relatedDirection: ERuleDirection): ERuleDirection[] {
    const keys = Object.keys(ERuleDirection);
    const base = keys.filter((x) => {
      const ruleDirection = ERuleDirection[x as keyof typeof ERuleDirection];

      return (
        ruleDirection !== ERuleDirection.onlyStraight &&
        ruleDirection !== ERuleDirection.onlyDiagonal &&
        ruleDirection !== ERuleDirection.all &&
        ruleDirection !== ERuleDirection.lShape
      );
    });

    let keysExcluded: ERuleDirection[] = [];

    const lShapeDirections = [
      ERuleDirection.leftUp,
      ERuleDirection.leftBottom,
      ERuleDirection.rightUp,
      ERuleDirection.rightBottom,
    ];

    const straightDirections = [
      ERuleDirection.up,
      ERuleDirection.bottom,
      ERuleDirection.right,
      ERuleDirection.left,
    ];

    const diagonalDirections = [
      ERuleDirection.upRight,
      ERuleDirection.upLeft,
      ERuleDirection.downRight,
      ERuleDirection.downLeft,
    ];

    switch (relatedDirection) {
      case ERuleDirection.onlyStraight:
        keysExcluded = [...lShapeDirections, ...diagonalDirections];
        break;
      case ERuleDirection.onlyDiagonal:
        keysExcluded = [...lShapeDirections, ...straightDirections];
        break;
      case ERuleDirection.lShape:
        keysExcluded = straightDirections;
        break;
    }

    const data = base
      .filter((key) => {
        return !keysExcluded.some((e) => e === ERuleDirection[key as keyof typeof ERuleDirection]);
      })
      .map((key) => ERuleDirection[key as keyof typeof ERuleDirection]);

    return data;
  }

  static isDiagonal(direction: ERuleDirection) {
    return (
      direction === ERuleDirection.upRight ||
      direction === ERuleDirection.upLeft ||
      direction === ERuleDirection.downRight ||
      direction === ERuleDirection.downLeft
    );
  }

  static isDiagonalBottom(direction: ERuleDirection) {
    return direction === ERuleDirection.downRight || direction === ERuleDirection.downLeft;
  }

  static isDiagonalUp(direction: ERuleDirection) {
    return direction === ERuleDirection.upLeft || direction === ERuleDirection.upRight;
  }

  static isMultiple(direction: ERuleDirection): boolean {
    return (
      direction === ERuleDirection.all ||
      direction === ERuleDirection.onlyStraight ||
      direction === ERuleDirection.onlyDiagonal ||
      direction === ERuleDirection.lShape
    );
  }

  static isDiagonalRight(direction: ERuleDirection) {
    return direction === ERuleDirection.upRight || direction === ERuleDirection.downRight;
  }

  static isDiagonalLeft(direction: ERuleDirection) {
    return direction === ERuleDirection.upLeft || direction === ERuleDirection.downLeft;
  }

  static isHorizontal(direction: ERuleDirection) {
    return direction === ERuleDirection.up || direction === ERuleDirection.bottom;
  }

  static isVertical(direction: ERuleDirection) {
    return direction === ERuleDirection.up || direction === ERuleDirection.bottom;
  }

  static isNegativeStep(direction: ERuleDirection) {
    return (
      direction === ERuleDirection.left ||
      direction === ERuleDirection.up ||
      direction === ERuleDirection.upRight ||
      direction === ERuleDirection.upLeft ||
      direction === ERuleDirection.leftUp ||
      direction === ERuleDirection.rightUp
    );
  }

  static isLShapeRight(direction: ERuleDirection) {
    return direction === ERuleDirection.upRight || direction === ERuleDirection.downRight;
  }

  static isLShapeLeft(direction: ERuleDirection) {
    return direction === ERuleDirection.upLeft || direction === ERuleDirection.downLeft;
  }

  static evaluatePosition(
    direction: ERuleDirection,
    position: number,
    team: ETeam,
    step = 1,
    isLShape = false
  ) {
    let modifier = this.isVertical(direction) ? 8 : 1;

    const isLShapeMajor =
      direction === ERuleDirection.leftUp || direction === ERuleDirection.rightBottom;

    const isLShapeMinor =
      direction === ERuleDirection.rightUp || direction === ERuleDirection.leftBottom;

    if (this.isDiagonalLeft(direction) && this.isDiagonalUp(direction))
      modifier = isLShape ? 17 : 9;
    if (this.isDiagonalLeft(direction) && this.isDiagonalBottom(direction))
      modifier = isLShape ? 17 : 7;
    if (this.isDiagonalRight(direction) && this.isDiagonalUp(direction))
      modifier = isLShape ? 15 : 7;
    if (this.isDiagonalRight(direction) && this.isDiagonalBottom(direction))
      modifier = isLShape ? 15 : 9;

    if (isLShapeMajor) modifier = 10;
    else if (isLShapeMinor) modifier = 6;

    if (this.isNegativeStep(direction)) modifier *= -1;

    if (team === ETeam.white) modifier *= -1;

    return position + modifier * step;
  }

  static isBoardEdge(position: number, direction: ERuleDirection, team: ETeam) {
    const limits: {
      min?: number;
      max?: number;
      edge?: 'horizontal' | 'vertical';
    }[] = [];

    const isUpDirection =
      direction === ERuleDirection.up ||
      direction === ERuleDirection.upLeft ||
      direction === ERuleDirection.upRight;

    const isBottomDirection =
      direction === ERuleDirection.bottom ||
      direction === ERuleDirection.downLeft ||
      direction === ERuleDirection.downRight;

    const isLeftDirection =
      direction === ERuleDirection.left ||
      direction === ERuleDirection.downLeft ||
      direction === ERuleDirection.upLeft;

    const isRightDirection =
      direction === ERuleDirection.right ||
      direction === ERuleDirection.downRight ||
      direction === ERuleDirection.upRight;

    if (isUpDirection)
      limits.push({
        min: 0,
        max: 7,
      });

    if (isBottomDirection)
      limits.push({
        min: 56,
        max: 63,
      });

    if (isLeftDirection)
      limits.push({
        min: 0,
        max: 56,
        edge: 'vertical',
      });

    if (isRightDirection)
      limits.push({
        min: 7,
        max: 63,
        edge: 'vertical',
      });

    const searchPositions: number[] = [];

    limits.forEach((limit) => {
      let { min, max, edge } = limit;

      if (team === ETeam.white) {
        min = limit.max;
        max = limit.min;
      }

      const modifier = edge === 'vertical' ? 8 : 1;

      if (min !== undefined && max !== undefined) {
        for (let i = min; i < max; i += modifier) {
          searchPositions.push(i);
        }
      }
    });

    return searchPositions.some((s) => s === position);
  }
}
