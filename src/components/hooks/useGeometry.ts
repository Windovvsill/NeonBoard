import { degrees, toRadians } from "../../utils";
import type { TCoords } from "types/types";

export const useGeometry = (coords: TCoords) => {
  const [{ x, y }, { x: x2, y: y2 }] = coords;

  const theta = degrees(coords);
  const rotation = theta + 90;

  const top = Math.min(y, y2);
  const left = Math.min(x, x2);
  const right = Math.max(x, x2);
  const bottom = Math.max(y, y2);

  const height = y2 - y;
  const width = x2 - x;

  const hyp = height / Math.sin(toRadians(theta));

  return {
    hyp,
    height,
    width,
    top,
    left,
    right,
    bottom,
    rotation,
    theta,
    x,
    y,
    x2,
    y2,
  };
};
