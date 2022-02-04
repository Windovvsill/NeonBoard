import { check } from "../../utils";
import React, { memo } from "react";
import type { IFourSides, IPosition } from "../../types/types";
import { useAnchors } from "../hooks/useAnchors";
import { Draggable } from "../utility/Draggable";
import { useGeometry } from "components/hooks/useGeometry";
import { AnchorSet } from "./anchor";
import { useTheme } from "components/ds/useTheme";

interface ILineProps {
  coords: [IPosition?, IPosition?];
  stopPropagation?: boolean;
  id?: number;
  onDrawingSelect: () => void;
  selected: boolean;
  onPositionUpdate: (position: [IPosition, IPosition]) => void;
  boardRef?: HTMLDivElement | null;
}

const neonStyle = (color: string) => ({
  boxShadow: `0 0 .2rem #fff,
            0 0 .2rem #fff,
            0 0 2rem ${color},
            0 0 0.8rem ${color},
            0 0 2.8rem ${color},
            inset 0 0 1.3rem ${color}`,
  border: `2px solid ${color}`,
  borderRadius: 8,
});

export const LineI = (props: ILineProps) => {
  const { coords, onPositionUpdate, onDrawingSelect, selected, boardRef } =
    props;

  const theme = useTheme();

  if (!check(coords)) return null;

  const {
    hyp,
    height,
    width,
    top,
    left,
    rotation,
    theta,
    bottom,
    right,
    x,
    y,
  } = useGeometry(coords);

  console.log(
    "LINE rotation, degrees, height, hyp",
    rotation,
    theta,
    height,
    hyp
  );

  const selectedBorder = selected
    ? { border: `1px dotted ${theme.neonTubeD}` }
    : {};

  const anchors = useAnchors({ anchorSize, coords });

  return (
    <div>
      <Draggable
        onPositionUpdate={onPositionUpdate}
        coords={coords}
        listenerNode={boardRef}
      >
        <div
          style={{
            position: "absolute",
            top: y - (hyp - height) / 2 - 12,
            left: x + width / 2 - 12,
            width: 24,
            height: `${24 + hyp + (hyp > 7 ? -9 : 9)}px`,
            transform: `rotate(${rotation}deg)`,
            ...selectedBorder,
          }}
          onClick={(event) => {
            console.log("clicked on line");
            event.stopPropagation();
            onDrawingSelect();
          }}
        />
      </Draggable>

      <div
        style={{
          position: "absolute",
          top: y - (hyp - height) / 2,
          left: x + width / 2,
          width: `0`,
          height: `${hyp}px`,
          transform: `rotate(${rotation}deg)`,
          ...neonStyle(theme.neonTubeC),
        }}
      />

      {selected && (
        <AnchorSet
          anchors={anchors}
          top={top}
          left={left}
          right={right}
          bottom={bottom}
          anchorSize={anchorSize}
          anchorStyle={neonStyle(theme.anchor)}
          boardRef={boardRef}
          {...props}
        />
      )}
    </div>
  );
};

export const Line = memo(LineI);

export const Text = memo(({ coords, stopPropagation }: ILineProps) => {
  const theme = useTheme();

  if (!check(coords)) return null;

  const { hyp, height, width, top, left } = useGeometry(coords);

  return (
    <textarea
      onClick={(e) => (stopPropagation === false ? null : e.stopPropagation())}
      style={{
        position: "absolute",
        top,
        left,
        width: Math.abs(width),
        height: Math.abs(height),
        border: `2px solid ${theme.neonTubeA}`,
        borderRadius: 8,
        backgroundColor: "#ffffffff",
        // ...neonStyle(colors.a),
      }}
    />
  );
});

const anchorSize = 12;

export const Box = memo((props: ILineProps) => {
  const { coords, onDrawingSelect, boardRef, selected, onPositionUpdate } =
    props;

  const theme = useTheme();

  if (!check(coords)) return null;

  const { height, width, ...restOfGeo } = useGeometry(coords);

  const { top, left } = restOfGeo;

  const anchors = useAnchors({ anchorSize, coords });

  return (
    <div>
      <Draggable
        onPositionUpdate={(e) => {
          console.log("box drag");
          onPositionUpdate(e);
        }}
        coords={coords}
        listenerNode={boardRef}
      >
        <div
          style={{
            position: "absolute",
            top: top - 7,
            left: left - 7,
            width: `${Math.abs(width)}px`,
            // width,
            // height,
            height: `${Math.abs(height)}px`,
            padding: "8px",
            border: selected ? `1px dotted ${theme.neonTubeC}` : undefined,
          }}
          onClick={(event) => {
            console.log("clicked on box");
            event.stopPropagation();
            onDrawingSelect();
          }}
        ></div>
      </Draggable>

      <SideLine alignment="top" {...restOfGeo} width={width} height={height} />
      <SideLine alignment="left" {...restOfGeo} width={width} height={height} />
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
      {selected && (
        <AnchorSet
          anchors={anchors}
          {...props}
          {...restOfGeo}
          anchorSize={anchorSize}
          anchorStyle={neonStyle(theme.anchor)}
        />
      )}
    </div>
  );
});

interface ISideLineProps {
  alignment: "top" | "bottom" | "right" | "left";
  width: number;
  height: number;
}

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
        ...neonStyle(theme.neonTubeA),
      }}
    />
  );
};
