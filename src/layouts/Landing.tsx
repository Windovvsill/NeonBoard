import React from "react";
import { FC } from "react";
import { Board } from "../components/drawing/board";
import { Row } from "../components/library/container";

export const LandingContainer: FC = ({ children }) => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#000000",
      }}
    >
      <Row>
        <Board />
      </Row>
      {children}
    </div>
  );
};
