import React, { useState } from "react";
import { useEffect } from "react";
import { IPosition } from "../../types/types";
import { Line, Box, Text } from "./line";
import { ToolBar } from "./toolBar";

const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const setFromEvent = (e: MouseEvent) =>
    setPosition({ x: e.clientX, y: e.clientY });

  const off = () => window.removeEventListener("mousemove", setFromEvent);

  const on = () => window.addEventListener("mousemove", setFromEvent);

  useEffect(() => {
    on();

    return () => {
      off();
    };
  }, []);

  return { mousePosition: position, on, off };
};

interface IDrawing {
  coords: [IPosition?, IPosition?];
  tool: string;
  stopPropagation?: boolean;
  id?: number;
}

const Drawing = (props: IDrawing) => {
  const render = () => {
    switch (props.tool) {
      case "line":
        return <Line {...props} key={props.id} />;
      case "box":
        return <Box {...props} key={props.id} />;
      case "text":
        return <Text {...props} key={props.id} />;
      default:
        return null;
    }
  };

  return render();
};

export const Board = () => {
  const [tool, setTool] = useState<string>("");
  const [pendingCoords, setPendingCoords] = useState<[IPosition?, IPosition?]>(
    []
  );

  const [drawings, setDrawings] = useState<Array<IDrawing>>([]);

  const [tracking, setTracking] = useState(false);

  const {
    mousePosition,
    on: trackingOn,
    off: trackingOff,
  } = useMousePosition();

  useEffect(() => {
    setTracking(pendingCoords.length === 1);
  }, [pendingCoords]);

  useEffect(() => {
    tracking ? trackingOn() : trackingOff();
  }, [tracking]);

  const resetTool = (tool: string) => {
    setPendingCoords([]);
    if (tool === "clear") {
      setDrawings([]);
      return;
    }
    setTool(tool);
  };

  useEffect(() => {
    if (pendingCoords.length === 2) {
      setDrawings((d) => [
        ...d,
        { tool, coords: pendingCoords, id: Date.now() },
      ]);
      setPendingCoords([]);
    }
  }, [pendingCoords]);

  const onBoardClick = (e: any) => {
    if (pendingCoords.length === 0) {
      return setPendingCoords([{ x: e.clientX, y: e.clientY }]);
    } else if (pendingCoords.length === 1) {
      return setPendingCoords((pendingCoords) => [
        pendingCoords[0],
        { x: e.clientX, y: e.clientY },
      ]);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#000000",
      }}
      onClick={onBoardClick}
    >
      {tool}

      {JSON.stringify(pendingCoords)}

      {drawings.map((d) => (
        <Drawing {...d} key={d.id} />
      ))}

      {tracking &&
        Drawing({
          tool,
          coords: [pendingCoords[0], mousePosition],
          stopPropagation: false,
        })}

      <ToolBar onSelect={resetTool} />
    </div>
  );
};
