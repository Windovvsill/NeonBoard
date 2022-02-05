import { usePrevious } from "components/hooks/usePrevious";
import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { Tools } from "../../types/enums";
import { IPosition } from "../../types/types";
import { useMousePosition } from "../hooks/useMousePosition";
import { Line, Box, Text } from "./line";
import { ToolBar } from "./toolBar";

interface IDrawing {
  coords: [IPosition?, IPosition?];
  tool: Tools;
  stopPropagation?: boolean;
  id: number;
}

const toolComponents = {
  [Tools.LINE]: Line,
  [Tools.BOX]: Box,
  [Tools.TEXT]: Text,
  [Tools.CLEAR]: null,
  [Tools.POINTER]: null,
};

const DELETE_KEYS = ["Delete", "Backspace"];

const Drawing = (
  props: IDrawing & {
    onDrawingSelect: () => void;
    selected: boolean;
    onPositionUpdate: (position: [IPosition, IPosition]) => void;

    boardRef?: HTMLDivElement | null;
  }
) => {
  const render = () => {
    const Comp = toolComponents[props.tool];
    if (!Comp) return null;
    return <Comp {...props} key={props.id} />;
  };

  return render();
};

export const Board = () => {
  const [tool, setTool] = useState<Tools>(Tools.BOX);
  const [pendingCoords, setPendingCoords] = useState<[IPosition?, IPosition?]>(
    []
  );

  const [drawings, setDrawings] = useState<Array<IDrawing>>([]);
  const [selectedDrawing, setSelectedDrawing] = useState<number>();
  const previousSelectedDrawing = usePrevious(selectedDrawing);

  const [tracking, setTracking] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (selectedDrawing) {
      setPendingCoords([]);
      setTracking(false);
    }
  }, [selectedDrawing]);

  const resetTool = (tool: Tools) => {
    setPendingCoords([]);
    if (tool === Tools.CLEAR) {
      setDrawings([]);
      return;
    }
    setTool(tool);
  };

  useEffect(() => {
    if (pendingCoords.length === 2) {
      const id = Date.now();
      setDrawings((d) => [...d, { tool, coords: pendingCoords, id }]);
      setPendingCoords([]);
      setSelectedDrawing(id);
    }
  }, [pendingCoords]);

  const onBoardClick = (e: { clientX: number; clientY: number }) => {
    console.log("BOARD CAPTURED CLICK");
    if (selectedDrawing !== undefined) {
      setSelectedDrawing(undefined);
      return;
    }
    if (pendingCoords.length === 0) {
      return setPendingCoords([{ x: e.clientX, y: e.clientY }]);
    } else if (pendingCoords.length === 1) {
      return setPendingCoords((pendingCoords) => [
        pendingCoords[0],
        { x: e.clientX, y: e.clientY },
      ]);
    }
  };

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (DELETE_KEYS.includes(ev.key)) {
        selectedDrawing && removeDrawing(selectedDrawing);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  const removeDrawing = (id: number) => {
    setDrawings((d) => d.filter((dd) => dd.id !== id));
  };

  const onDrawingSelect = useCallback((id: number) => {
    if (
      previousSelectedDrawing &&
      drawings.find((dd) => dd.id === previousSelectedDrawing)?.tool ===
        Tools.TEXT
    ) {
      removeDrawing(previousSelectedDrawing);
    }
    setSelectedDrawing(id);
  }, []);

  const updateSingleDrawingPosition = useCallback(
    (id: number, position: [IPosition, IPosition]) => {
      const t = drawings.find((d) => d.id === id);
      console.log(
        "message to update single drawing from:",
        t?.coords,
        "to",
        position
      );
      setDrawings(
        drawings.map((d) => (d.id === id ? { ...d, coords: position } : d))
      );
    },
    [drawings]
  );

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        padding: 0,
        margin: 0,
        backgroundColor: "#000000",
        backgroundImage: `radial-gradient( circle 964.7px at 10% 20%,  rgba(0,0,12,1) 0%, rgba(10,10,7,1) 44%, rgba(12,12,22,1) 100.1% )`,
      }}
      ref={boardRef}
      onClick={onBoardClick}
    >
      {drawings.map((d) => (
        <Drawing
          {...d}
          boardRef={boardRef.current}
          key={d.id}
          onDrawingSelect={() => onDrawingSelect(d.id)}
          selected={d.id === selectedDrawing}
          onPositionUpdate={(coords) =>
            updateSingleDrawingPosition(d.id, coords)
          }
        />
      ))}

      {tracking && (
        <Drawing
          tool={tool}
          coords={[pendingCoords[0], mousePosition]}
          stopPropagation={false}
          id={0}
          selected={false}
          onDrawingSelect={() => null}
          onPositionUpdate={() => null}
        />
      )}

      <ToolBar onSelect={resetTool} selected={tool} />
      {"tool: " +
        tool +
        " pending: " +
        JSON.stringify(pendingCoords) +
        " mouse " +
        mousePosition.x}
    </div>
  );
};
