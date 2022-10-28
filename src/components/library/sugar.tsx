import { colors } from "components/ds";
import React from "react";

export const Delim = ({
  label,
  scale = 1,
  color = colors.maximumRed,
}: {
  label: string;
  scale?: number;
  color?: string;
}) => {
  return (
    <div
      style={{
        color,
        fontSize: `${scale * 24}px`,
        fontWeight: "bold",
        cursor: "default",
      }}
    >
      {label}
    </div>
  );
};
