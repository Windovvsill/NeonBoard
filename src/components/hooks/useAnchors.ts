import type { Anchors, IPosition, MPF } from "../../types/types";
import { pipe } from "../../utils";

interface IAnchorProps {
  /** Used to determine the proper offset */
  anchorSize: number;
  /**
   * Coords of the drawing, used to determine the relative
   * position of coordinates.
   */
  coords: [IPosition, IPosition];
  filterAnchors?: (anchor: Anchors) => boolean;
}

export const useAnchors = ({
  anchorSize,
  coords,
  filterAnchors,
}: IAnchorProps) => {
  /**
   * Drawing from top-left to bottom-right will result in x2>x1 and y2>y1.
   * If you instead draw to the left then it's a horizontal flip,
   * draw to the top and it's a vertical flip.
   */
  const originFlips = {
    horizontal: coords[0].x > coords[1].x,
    vertical: coords[0].y > coords[1].y,
  };

  /**
   * Re-arrange the position filter values so that they
   * are flipped if the drawing is flipped.
   */
  const flipPositionFilter = (positionFilter: MPF) => {
    const flipper = (cursor: 0 | 1, when: boolean) => (mpf: MPF) => {
      if (!when) return mpf;
      return mpf.map((_, i) => ({
        x: mpf[(i + Number(cursor === 0)) % 2].x,
        y: mpf[(i + Number(cursor === 1)) % 2].y,
      })) as MPF;
    };

    return pipe(
      flipper(1, originFlips.vertical),
      flipper(0, originFlips.horizontal)
    )(positionFilter);
  };

  const anchors: Anchors[] = [
    {
      top: ({ top }) => top - anchorSize * 1.5,
      left: ({ left }) => left - anchorSize * 1.5,
      mutablePositionFilter: flipPositionFilter([
        { x: true, y: true },
        { x: false, y: false },
      ]),
    },
    {
      top: ({ bottom }) => bottom + anchorSize,
      left: ({ left }) => left - anchorSize * 1.5,
      mutablePositionFilter: flipPositionFilter([
        { x: true, y: false },
        { x: false, y: true },
      ]),
    },
    {
      top: ({ top }) => top - anchorSize * 1.5,
      left: ({ right }) => right + anchorSize,
      mutablePositionFilter: flipPositionFilter([
        { x: false, y: true },
        { x: true, y: false },
      ]),
    },
    {
      top: ({ bottom }) => bottom + anchorSize,
      left: ({ right }) => right + anchorSize,
      mutablePositionFilter: flipPositionFilter([
        { x: false, y: false },
        { x: true, y: true },
      ]),
    },
  ];

  return anchors.filter(filterAnchors || (() => true));
};
