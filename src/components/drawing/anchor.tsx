import { Draggable } from "components/utility/Draggable";
import React from "react";
import type {
  Anchors,
  IFourSides,
  IPosition,
  TCoordsPartial,
} from "types/types";

type IAnchorSetProps = {
  anchors: Anchors[];
  coords: TCoordsPartial;
  onDrawingSelect: () => void;
  boardRef?: HTMLDivElement | null;
  onPositionUpdate: (position: [IPosition, IPosition]) => void;
  anchorStyle: object;
  anchorSize: number;
} & IFourSides;

export const AnchorSet = ({
  anchors,
  coords,
  boardRef,
  onPositionUpdate,
  onDrawingSelect,
  anchorSize,
  top,
  left,
  bottom,
  right,
  anchorStyle,
}: IAnchorSetProps) => {
  return (
    <>
      {anchors.map((anchor) => (
        <Draggable
          coords={coords}
          listenerNode={boardRef}
          onPositionUpdate={(e) => {
            console.log("anchor drag");
            const newCoords = e.map((ee, i) => ({
              x: anchor.mutablePositionFilter[i].x ? e[i].x : coords[i]?.x,
              y: anchor.mutablePositionFilter[i].y ? e[i].y : coords[i]?.y,
            })) as [IPosition, IPosition];
            onPositionUpdate(newCoords);
          }}
        >
          <div
            style={{
              position: "absolute",
              top: anchor.top({ top, left, bottom, right }),
              left: anchor.left({ top, left, bottom, right }),
              width: anchorSize,
              height: anchorSize,
              ...anchorStyle,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDrawingSelect();
            }}
          />
        </Draggable>
      ))}
    </>
  );
};
