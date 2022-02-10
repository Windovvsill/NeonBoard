export type Id = string | number;

interface IPosition {
  x: number;
  y: number;
}

type TCoords = [IPosition, IPosition];
type TCoordsPartial = [IPosition?, IPosition?];

/**
 * Mutable Position Filter
 * Eg, [{x: true, y: true}, {x: false, y: false}] means
 * that the x1 and y1 coordinates (of the top left corner)
 * can be dragged by this anchor.
 */
type MPF = [{ x: boolean; y: boolean }, { x: boolean; y: boolean }];

type AnchorPosition = {
  top: number;
  left: number;
  bottom: number;
  right: number;
};

interface Anchors {
  /** Returns where the anchor should be on the plane. */
  top: (positions: AnchorPosition) => number;
  /** Returns where the anchor should be on the plane. */
  left: (positions: AnchorPosition) => number;
  /** 4 filters describing which coordinates can be changed. */
  mutablePositionFilter: MPF;
}

interface IFourSides {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

interface IDrawing {
  coords: TCoordsPartial;
  tool: Tools;
  stopPropagation?: boolean;
  id: Id;
  text?: string;
}
