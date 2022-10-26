import React, { ReactNode } from "react";

const paddingScales = [0, 4, 16, 32];

interface LayoutProps {
  children: ReactNode;
  paddingScale?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const flexBase = (paddingScale?: number) => ({
  paddingRight: paddingScales[paddingScale ?? 1],
  paddingLeft: paddingScales[paddingScale ?? 1],
  paddingTop: paddingScales[paddingScale ?? 1],
  paddingBottom: paddingScales[paddingScale ?? 1],
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
});

const FlexElement =
  (flexDirection: "row" | "column") => (props: LayoutProps) => {
    return (
      <div
        style={{
          flexDirection,
          ...flexBase(props.paddingScale),
        }}
        onClick={props.onClick}
      >
        {props.children}
      </div>
    );
  };

export const Row = FlexElement("row");

export const Column = FlexElement("column");
