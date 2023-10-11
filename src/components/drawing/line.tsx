import { check, toRadians } from "../../utils";
import React, { memo } from "react";
import type { Id, IFourSides, IPosition } from "../../types/types";
import { useAnchors } from "../hooks/useAnchors";
import { Draggable } from "../utility/Draggable";
import { useGeometry } from "components/hooks/useGeometry";
import { AnchorSet } from "./anchor";
import { neonBorder, selectedBorder, useTheme } from "components/ds/useTheme";

interface ILineProps {
  coords: [IPosition?, IPosition?];
  stopPropagation?: boolean;
  id?: Id;
  onDrawingSelect: () => void;
  selected: boolean;
  onPositionUpdate: (position: [IPosition, IPosition]) => void;
  boardRef?: HTMLDivElement | null;
  interactive?: boolean;
  text?: string;
}

const ArrowLineI = (props: ILineProps) => {
  const { coords } = props;

  if (!check(coords)) return null;

  const { theta } = useGeometry(coords);

  const headAngle = 45 / 2;

  const r = 24;

  const ax = r * Math.sin(toRadians(180 - theta + 45 + headAngle));
  const ay = r * Math.cos(toRadians(180 - theta + 45 + headAngle));
  const ax2 = r * Math.sin(toRadians(180 - theta + 90 + headAngle));
  const ay2 = r * Math.cos(toRadians(180 - theta + 90 + headAngle));

  return (
    <div>
      <Line {...props} />
      <Line
        {...props}
        coords={[{ x: coords[1].x + ax2, y: coords[1].y + ay2 }, coords[1]]}
        interactive={false}
      />
      <Line
        {...props}
        coords={[{ x: coords[1].x + ax, y: coords[1].y + ay }, coords[1]]}
        interactive={false}
      />
    </div>
  );
};

export const ArrowLine = memo(ArrowLineI);

export const LineI = (props: ILineProps) => {
  const {
    coords,
    onPositionUpdate,
    onDrawingSelect,
    selected,
    boardRef,
    interactive = true,
  } = props;

  const theme = useTheme();

  if (!check(coords)) return null;

  const { hyp, height, width, top, left, rotation, bottom, right, x, y } =
    useGeometry(coords);

  const anchors = useAnchors({ anchorSize, coords });

  const containerWidth = 24;
  const halfContainer = containerWidth / 2;

  return (
    <div>
      <Draggable
        onPositionUpdate={onPositionUpdate}
        coords={coords}
        listenerNode={boardRef}
        bypass={!interactive}
      >
        <SelectedBorder
          color={theme.neonTubeA}
          visible={selected}
          onClick={(event) => {
            console.log("clicked on line");
            if (selected) event.stopPropagation();
            onDrawingSelect();
          }}
          top={y - (hyp - height) / 2}
          left={x + width / 2 - halfContainer}
          width={containerWidth}
          height={hyp}
          transform={`rotate(${rotation}deg)`}
        />
        {/* <div
          style={{
            position: "absolute",
            top: y - (hyp - height) / 2 - halfContainer - 3, // half large border
            left: x + width / 2 - halfContainer - 3, // half large border
            width: containerWidth,
            height: `${containerWidth + hyp}px`,
            transform: `rotate(${rotation}deg)`,
            ...selectedBorder(interactive && selected, theme.neonTubeD),
          }}
          onClick={() => {
            if (!interactive) return;
            console.log("| LINE CLICK clicked on line");
            // event.stopPropagation();
            onDrawingSelect();
          }}
        /> */}
      </Draggable>
      <div
        style={{
          position: "absolute",
          top: y - (hyp - height) / 2,
          left: x + width / 2,
          width: `0`,
          height: `${hyp}px`,
          transform: `rotate(${rotation}deg)`,
          backgroundColor: theme.neonTubeC,
          ...neonBorder(theme.neonTubeC),
        }}
      />

      {selected && interactive && (
        <AnchorSet
          anchors={anchors}
          top={top}
          left={left}
          right={right}
          bottom={bottom}
          anchorSize={anchorSize}
          anchorStyle={{
            ...neonBorder(theme.anchor),
            backgroundColor: theme.anchor,
          }}
          boardRef={boardRef}
          {...props}
        />
      )}
    </div>
  );
};

export const Line = memo(LineI);

const anchorSize = 6;
const selectedBuffer = 8;

const SelectedBorder = ({ onClick, width, height, top, left, visible, transform, color }:
  { visible: boolean, top: number, left: number; height: number; width: number; onClick: (event: any) => void, transform?: string, color: string }
) => {
  const theme = useTheme();

  return < div
    style={{
      position: "absolute",
      top: top - selectedBuffer,
      left: left - selectedBuffer,
      width: `${Math.abs(width) + selectedBuffer * 2}px`,
      height: `${Math.abs(height) + selectedBuffer * 2}px`,
      padding: "0px",
      transform,
      ...selectedBorder(visible, color),
    }}
    onClick={onClick}
  ></div >
};

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
        <SelectedBorder
          color={theme.neonTubeC}
          visible={selected}
          onClick={(event) => {
            console.log("clicked on box");
            if (selected) event.stopPropagation();
            onDrawingSelect();
          }}
          top={top}
          left={left}
          width={width}
          height={height}
        />
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
          anchorStyle={{
            ...neonBorder(theme.anchor),
            backgroundColor: theme.anchor,
          }}
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
        backgroundColor: theme.neonTubeA,
        ...neonBorder(theme.neonTubeA),
      }}
    />
  );
};

export const Text = memo((props: ILineProps) => {
  const { coords, onDrawingSelect, stopPropagation, selected, text } = props;

  const theme = useTheme();

  if (!check(coords)) return null;

  const { height, width, ...restOfGeo } = useGeometry(coords);
  const { top, left } = restOfGeo;

  const anchors = useAnchors({ anchorSize, coords });

  return (
    <div>
      {selected && (
        <AnchorSet
          anchors={anchors}
          {...props}
          {...restOfGeo}
          anchorStyle={{
            ...neonBorder(theme.anchor),
            backgroundColor: theme.anchor,
          }}
          anchorSize={anchorSize}
        />
      )}
      <Draggable
        coords={coords}
        listenerNode={props.boardRef}
        onPositionUpdate={props.onPositionUpdate}
      >
        <textarea
          onClick={(e) => {
            onDrawingSelect();
            stopPropagation === false ? null : e.stopPropagation();
          }}
          value={text}
          style={{
            resize: "none",
            position: "absolute",
            top,
            left,
            width: Math.abs(width),
            height: Math.abs(height),
            outline: "none",
            overflow: "auto",
            backgroundColor: "#ffffff00",
            color: theme.primaryText,
            ...selectedBorder(selected, theme.neonTubeD),
          }}
        />
      </Draggable>
    </div>
  );
});
