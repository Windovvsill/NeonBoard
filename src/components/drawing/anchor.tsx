import { sensibles } from "components/ds";
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
  anchorSize?: number;
} & IFourSides;

export const AnchorSet = ({
  anchors,
  coords,
  boardRef,
  onPositionUpdate,
  onDrawingSelect,
  anchorSize = sensibles.anchorSize,
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
          onPositionUpdate={(positions) => {
            const newCoords = positions.map((pos, i) => ({
              x: anchor.mutablePositionFilter[i].x ? pos.x : coords[i]?.x,
              y: anchor.mutablePositionFilter[i].y ? pos.y : coords[i]?.y,
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
              zIndex: 10,
              borderRadius: 100,
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
