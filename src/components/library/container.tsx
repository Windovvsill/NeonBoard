import React from "react";
import { FC } from "react";

const paddingScales = [0, 4, 16, 32];

interface LayoutProps {
  paddingScale?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const flexBase = (paddingScale?: number) => ({
  paddingRight: paddingScales[paddingScale ?? 1],
  paddingLeft: paddingScales[paddingScale ?? 1],
  paddingTop: paddingScales[paddingScale ?? 1],
  paddingBottom: paddingScales[paddingScale ?? 1],
  justifyContent: "center",
  display: "flex",
});

const FlexElement: (flexDirection: "row" | "column") => FC<LayoutProps> =
  () =>
  ({ children, paddingScale, onClick }) => {
    return (
      <div
        style={{
          flexDirection: "row",
          ...flexBase(paddingScale),
        }}
        onClick={onClick}
      >
        {children}
      </div>
    );
  };

export const Row = FlexElement("row");

export const Column = FlexElement("column");
