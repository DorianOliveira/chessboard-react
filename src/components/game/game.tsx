"use client";

import { PieceBuilder } from "@/model/builder";
import { Board } from "../board/board";
import { useEffect, useState } from "react";
import { IBoardCell, IChessPiece, ISingleRule } from "@/interfaces/interfaces";
import { ERuleDirection } from "@/enums/enums";
import { DirectionHelper } from "@/model/direction";

export function Game() {
  const [pieces, setPieces] = useState<IChessPiece[]>();
  const [allowedMoves, setAllowedMoves] = useState<number[]>();
  const [selectedMove, setSelectedMove] = useState<number>();
  const [selectedPiece, setSelectedPiece] = useState<
    IChessPiece | null | undefined
  >();

  const [turn, setTurn] = useState<"think" | "select" | "drop" | "end">(
    "think"
  );
  const [oldPosition, setOldPosition] = useState<number | undefined>();

  useEffect(() => build(), []);

  useEffect(() => {
    if (turn === "think" && selectedPiece) {
      console.log("setting available steps");
      setAvailableSteps();
      setTurn("select");
    }
  }, [selectedPiece, setAvailableSteps]);

  function setAvailableSteps() {
    if (selectedPiece) {
      const { directions, limit, canInvade } =
        selectedPiece.rule as ISingleRule;

      findCellsByDirections(
        selectedPiece.position,
        directions,
        limit,
        canInvade
      );
    }
  }

  const isCellAvailable = (position: number) => {
    // console.log(position);
    // console.log(pieces?.map((x) => ({ position: x.position, title: x.title })));
    // console.log(
    //   pieces?.some((piece: IChessPiece) => piece.position === position)
    // );

    return !pieces?.some((piece: IChessPiece) => piece.position === position);
  };

  function findCellsByDirections(
    position: number,
    directions: ERuleDirection[],
    limit?: number,
    canInvade?: boolean
  ) {
    const _ = DirectionHelper;

    let seekPositions: number[] = [];

    directions.forEach((d) => {
      const availablePositions = [];

      if (!limit) limit = 7;

      const directionsBlocked: ERuleDirection[] = [];

      const isLShape = d === ERuleDirection.lShape;

      const hasMultipleDirections =
        d === ERuleDirection.all ||
        d === ERuleDirection.onlyStraight ||
        d === ERuleDirection.onlyDiagonal ||
        isLShape;

      for (let end = 0; end < limit; end++) {
        if (hasMultipleDirections) {
          const allDirections = _.getDirections(d);

          allDirections.forEach((direction) => {


            const canMoveInThisDirections = !directionsBlocked.some(
              (d) => direction === d
            );

            const isValid =
              canMoveInThisDirections && !_.isBoardEdge(position, direction);

            if (isValid) {
              const nextPosition = _.evaluatePosition(
                direction,
                position,
                end + 1,
                isLShape
              );

              // console.log(
              //   nextPosition,
              //   direction,
              //   _.isBoardEdge(nextPosition, direction)
              // );

              // console.log(nextPosition);
              if (
                !isCellAvailable(nextPosition) ||
                _.isBoardEdge(nextPosition, direction)
              ) {
                // console.log(nextPosition, direction)
                directionsBlocked.push(direction);
              }

              // if (!_.isBoardEdge(position, direction))
              availablePositions.push(nextPosition);
            }
          });
        } else {
          availablePositions.push(_.evaluatePosition(d, position));
        }

        seekPositions = [
          ...seekPositions,
          ...availablePositions.filter((p) => isCellAvailable(p)),
        ];

        setAllowedMoves(seekPositions);
      }
    });
  }

  function onCellClick(cell?: IBoardCell) {
    if (cell?.isAvailableStep) {
      setSelectedMove(cell?.position);

      setOldPosition(selectedPiece?.position);

      const updatedPieces = pieces?.map((piece) => {
        if (piece.position === selectedPiece?.position)
          piece.position = cell.position;
        return piece;
      });

      setPieces(updatedPieces);
      setTurn("end");
    }
  }

  function onPieceSelected(piece: IChessPiece) {
    setSelectedPiece(piece);
    setTurn("think");
  }

  function build() {
    const builder = new PieceBuilder();
    const chessPieces = builder.build();
    setPieces(chessPieces);
  }

  return (
    <>
      <h3>Player 2</h3>
      <Board
        onCellClick={onCellClick}
        onPieceSelected={onPieceSelected}
        selectedPiece={selectedPiece ? selectedPiece : undefined}
        allowedMoves={allowedMoves}
        selectedMove={selectedMove}
        oldPosition={oldPosition}
        pieces={pieces}
      />
      <h3>Player 1</h3>
    </>
  );
}
