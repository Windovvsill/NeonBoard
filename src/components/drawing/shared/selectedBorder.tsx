import { sensibles } from "components/ds";
import { selectedBorder } from "components/ds/useTheme";
import React from "react";

export const SelectedBorder = ({
  onClick,
  width,
  height,
  top,
  left,
  visible,
  transform,
  color,
  xs,
}: {
  visible: boolean;
  top: number;
  left: number;
  height: number;
  width: number;
  onClick: (event: any) => void;
  transform?: string;
  color: string;
  xs?: {
    [k: string]: any;
  };
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: top - sensibles.selectedBorderBuffer,
        left: left - sensibles.selectedBorderBuffer,
        width: `${Math.abs(width) + sensibles.selectedBorderBuffer * 2}px`,
        height: `${Math.abs(height) + sensibles.selectedBorderBuffer * 2}px`,
        padding: "0px",
        transform,
        ...selectedBorder(color, visible),
        ...xs,
      }}
      onClick={onClick}
    ></div>
  );
};
