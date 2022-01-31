import React, { memo } from "react";
import { IPosition } from "../../types/types";
import { Draggable } from "../utility/Draggable";

interface ILineProps {
  coords: [IPosition?, IPosition?];
  stopPropagation?: boolean;
  id?: number;
  onDrawingSelect: () => void;
  selected: boolean;
  onPositionUpdate: (position: [IPosition, IPosition]) => void;
}

type TCoords = [IPosition, IPosition];

const neonStyle = (color: string) => ({
  boxShadow: `0 0 .2rem #fff,
            0 0 .2rem #fff,
            0 0 2rem ${color},
            0 0 0.8rem ${color},
            0 0 2.8rem ${color},
            inset 0 0 1.3rem ${color}`,
});

const colors = {
  a: "#0CECDD",
  b: "#FFF338",
  c: "#FF67E7",
  d: "#C400FF",
};

const useGeometry = (coords: TCoords) => {
  const [{ x, y }, { x: x2, y: y2 }] = coords;

  const theta = degrees(coords);
  const rotation = theta + 90;

  const top = Math.min(y, y2);
  const left = Math.min(x, x2);

  const height = y2 - y;
  const width = x2 - x;

  const hyp = height / Math.sin(toRadians(theta));

  return {
    hyp,
    height,
    width,
    top,
    left,
    rotation,
    theta,
    x,
    y,
    x2,
    y2,
  };
};

export const LineI = ({ coords, onPositionUpdate }: ILineProps) => {
  if (!check(coords)) return null;

  const { hyp, height, width, top, left, rotation, theta, x, y, x2, y2 } =
    useGeometry(coords);

  console.log(
    "LINE rotation, degrees, height, hyp",
    rotation,
    theta,
    height,
    hyp
  );

  return (
    <Draggable onPositionUpdate={onPositionUpdate} coords={coords}>
      <div>
        <div
          style={{
            position: "absolute",
            top: y - (hyp - height) / 2,
            left: x + width / 2,
            width: `0`,
            height: `${hyp}px`,
            border: `2px solid ${colors.c}`,
            borderRadius: 8,
            transform: `rotate(${rotation}deg)`,
            ...neonStyle(colors.c),
          }}
        />
        <div
          style={{
            position: "absolute",
            top: y - (hyp - height) / 2 + height - 20,
            left: x + width / 2 + width - 20,
            width: 0,
            height: 20,
            border: `2px solid ${colors.c}`,
            borderRadius: 8,
            transform: `rotate(${rotation + 15}deg)`,
            ...neonStyle(colors.c),
          }}
        />
      </div>
    </Draggable>
  );
};

export const Line = memo(LineI);

export const Text = memo(({ coords, stopPropagation }: ILineProps) => {
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
        border: `2px solid ${colors.a}`,
        borderRadius: 8,
        // ...neonStyle(colors.a),
      }}
    />
  );
});

export const Box = memo(
  ({ coords, onDrawingSelect, selected, onPositionUpdate }: ILineProps) => {
    if (!check(coords)) return null;

    const { hyp, height, width, top, left, rotation, theta, x, y, x2, y2 } =
      useGeometry(coords);

    // console.log(
    //   "BOX rotation, degrees, height, hyp",
    //   rotation,
    //   theta,
    //   height,
    //   hyp
    // );

    return (
      <Draggable onPositionUpdate={onPositionUpdate} coords={coords}>
        <div>
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
              border: selected ? `1px dotted red` : undefined,
            }}
            // draggable
            onClick={(event) => {
              console.log("clicked on box");
              event.stopPropagation();
              onDrawingSelect();
            }}
          ></div>
          {/* left side */}
          <div
            style={{
              position: "absolute",
              top,
              left: x,
              // width: `${x2 - x}px`,
              width: `0`,
              height: `${Math.abs(height)}px`,
              border: `2px solid ${colors.a}`,
              borderRadius: 8,
              ...neonStyle(colors.a),
            }}
          />

          {/* bottom */}
          <div
            style={{
              position: "absolute",
              top: y2,
              left,
              width: `${Math.abs(width)}px`,
              height: `0px`,
              border: `2px solid ${colors.b}`,
              borderRadius: 8,
              ...neonStyle(colors.b),
            }}
          />

          {/* right */}
          <div
            style={{
              position: "absolute",
              top,
              left: x2,
              width: `0`,
              height: `${Math.abs(height)}px`,
              border: `2px solid ${colors.c}`,
              borderRadius: 8,
              ...neonStyle(colors.c),
            }}
          />

          {/* top */}
          <div
            style={{
              position: "absolute",
              top: y,
              left,
              width: `${Math.abs(width)}px`,
              height: `0px`,
              border: `2px solid ${colors.d}`,
              borderRadius: 8,
              ...neonStyle(colors.d),
            }}
          />
        </div>
      </Draggable>
    );
  }
);

const degrees = ([{ x, y }, { x: x2, y: y2 }]: TCoords) =>
  (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;

const check = (tuple: [IPosition?, IPosition?]): tuple is TCoords => {
  return !!(tuple?.[0] && tuple?.[1]);
};

const toRadians = (theta: number) => theta * (Math.PI / 180);
