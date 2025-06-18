import React, { memo } from "react";
import { selectedBorder, useTheme } from "components/ds/useTheme";
import { neonBorder } from "components/ds/useTheme";
import { Draggable } from "components/utility/Draggable";
import { useGeometry } from "components/hooks/useGeometry";
import { useAnchors } from "components/hooks/useAnchors";
import { check } from "../../utils";
import type { IDrawing, IFourSides, IPosition } from "../../types/types";
import { AnchorSet } from "./anchor";
import { SelectedBorder } from "./shared/selectedBorder";

interface ISideLineProps {
  alignment: "top" | "bottom" | "right" | "left";
  width: number;
  height: number;
}

type BoxProps = IDrawing & {
  onDrawingSelect: () => void;
  selected: boolean;
  onPositionUpdate: (position: [IPosition, IPosition]) => void;
  boardRef?: HTMLDivElement | null;
  xs?: {
    [k: string]: any;
  };
};

const SideLine = ({
  alignment,
  top,
  left,
  bottom,
  right,
  width,
  height,
}: ISideLineProps & IFourSides) => {
  const theme = useTheme();

  const isVertical = alignment === "left" || alignment === "right";

  return (
    <div
      style={{
        position: "absolute",
        top: alignment === "bottom" ? bottom : top,
        left: alignment === "right" ? right : left,
        width: isVertical ? 0 : Math.abs(width),
        height: !isVertical ? 0 : Math.abs(height),
        backgroundColor: theme.neonTubeA,
        ...neonBorder(theme.neonTubeA),
      }}
    />
  );
};

export const Box = memo((props: BoxProps) => {
  const { coords, onDrawingSelect, boardRef, selected, onPositionUpdate } =
    props;

  const theme = useTheme();

  if (!check(coords)) return null;

  const { height, width, ...restOfGeo } = useGeometry(coords);

  const { top, left } = restOfGeo;

  const anchors = useAnchors({ coords });

  return (
    <>
      <Draggable
        onPositionUpdate={(e) => {
          console.log("box drag");
          onPositionUpdate(e);
        }}
        coords={coords}
        listenerNode={boardRef}
      >
        <div>
          <SelectedBorder
            color={theme.neonTubeC}
            visible={selected}
            onClick={(event: React.MouseEvent) => {
              console.log("clicked on box...");
              event.stopPropagation();
              onDrawingSelect();
            }}
            top={top}
            left={left}
            width={width}
            height={height}
            xs={{ ...props.xs }}
          />

          <div
            style={{
              position: "absolute",
              top,
              left,
              width: Math.abs(width),
              height: Math.abs(height),
              backdropFilter: "blur(2px)",
            }}
          />

          <SideLine
            alignment="top"
            {...restOfGeo}
            width={width}
            height={height}
          />
          <SideLine
            alignment="left"
            {...restOfGeo}
            width={width}
            height={height}
          />
          <SideLine
            alignment="right"
            {...restOfGeo}
            width={width}
            height={height}
          />
          <SideLine
            alignment="bottom"
            {...restOfGeo}
            width={width}
            height={height}
          />
        </div>
      </Draggable>

      {selected && (
        <AnchorSet
          anchors={anchors}
          {...props}
          {...restOfGeo}
          anchorStyle={{
            ...selectedBorder(theme.neonTubeC),
            backgroundColor: theme.background,
          }}
        />
      )}
    </>
  );
});
