import type { TCoordsPartial, TCoords } from "types/types";

export const degrees = ([{ x, y }, { x: x2, y: y2 }]: TCoords) =>
  (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;

export const check = (tuple: TCoordsPartial): tuple is TCoords => {
  return !!(tuple?.[0] && tuple?.[1]);
};

export const toRadians = (theta: number) => theta * (Math.PI / 180);
