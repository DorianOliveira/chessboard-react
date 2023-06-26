import { IChessPieceProps } from "@/interfaces/props";
import Image from "next/image";


export function ChessPiece(props: IChessPieceProps) {

  function onChessPieceSelected() {
    props.onSelected(props.piece);
  }

  return (
    <div
      title={props.piece.title}
      onMouseDown={onChessPieceSelected}
    >
      {props.piece?.imageSrc ? (
        <Image
          src={props.piece.imageSrc}
          width={60}
          height={60}
          alt={props.piece.title}
        />
      ) : null}
    </div>
  );
}
