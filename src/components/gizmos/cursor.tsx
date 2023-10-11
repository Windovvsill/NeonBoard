import React from "react";

export const Cursor = ({ top, left, color }:
  { color: string; top: number; left: number; }) => {
  return <div
    style={{
      position: "absolute",
      top,
      left,
      width: "48px",
      // Ignore clicks!
      pointerEvents: "none",
    }}
  >
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      xmlSpace="preserve"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      y="0px"
      viewBox="0 0 28 28"
      enableBackground="new 0 0 28 28"
    >
      <polygon
        fill={color}
        points="8.2,20.9 8.2,4.9 19.8,16.5 13,16.5 12.6,16.6 "
      />
      <polygon
        fill="#0ff"
        points="17.3,21.6 13.7,23.1 9,12 12.7,10.5 "
      />
      <rect
        fill="#f0f"
        x="12.5"
        y="13.6"
        transform="matrix(0.9221 -0.3871 0.3871 0.9221 -5.7605 6.5909)"
        width="2"
        height="8"
      />
      <polygon
        fill="#fff"
        points="9.2,7.3 9.2,18.5 12.2,15.6 12.6,15.5 17.4,15.5 "
      />
    </svg>
  </div>;
};
