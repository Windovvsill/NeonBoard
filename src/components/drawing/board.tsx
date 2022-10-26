import { colors } from "components/ds";
import { usePrevious } from "components/hooks/usePrevious";
import { Row } from "components/library/container";
import { Delim } from "components/library/sugar";
import { usePanicContext } from "contexts/PanicContext";
import { importData } from "io/import";
import React, { useCallback, useId, useRef, useState } from "react";
import { useEffect } from "react";
import { Tools } from "../../types/enums";
import type { Id, IDrawing, IPosition } from "../../types/types";
import { useMousePosition } from "../hooks/useMousePosition";
import { Line, Box, Text, ArrowLine } from "./line";
import { ToolBar } from "./toolBar";

const toolComponents = {
  [Tools.LINE]: Line,
  [Tools.BOX]: Box,
  [Tools.TEXT]: Text,
  [Tools.CLEAR]: null,
  [Tools.POINTER]: null,
  [Tools.ARROW]: ArrowLine,
};

const DELETE_KEYS = ["Delete", "Backspace"];

const colorList = Object.values(colors);

const reconcileColor = (n: number) => {
  return colorList[n % colorList.length];
};

const Drawing = (
  props: IDrawing & {
    onDrawingSelect: () => void;
    selected: boolean;
    onPositionUpdate: (position: [IPosition, IPosition]) => void;
    boardRef?: HTMLDivElement | null;
  }
) => {
  const render = () => {
    const Comp = toolComponents[props.tool as Tools];
    if (!Comp) return null;
    return <Comp {...props} key={props.id} />;
  };

  return render();
};

type EventType = string;

interface Event {
  joinOrder: number;
  type: EventType;
  boardId: string;
  eventId: string;
  mousePosition: { x: number; y: number };
}

export const Board = () => {
  const boardId = useId();

  const { panicMessages, panic, history } = usePanicContext();

  const [tool, setTool] = useState<Tools>(Tools.BOX);
  const [pendingCoords, setPendingCoords] = useState<[IPosition?, IPosition?]>(
    []
  );

  const [drawings, setDrawings] = useState<Array<IDrawing>>([]);
  const [selectedDrawing, setSelectedDrawing] = useState<Id>();
  const previousSelectedDrawing = usePrevious(selectedDrawing);

  const [tracking, setTracking] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);

  const [collabIds, setCollabIds] = useState<{
    [k: string]: { joinOrder: number };
  }>({});

  const [collabMice, setCollabMice] = useState<{
    [k: string]: { x: number; y: number };
  }>({});

  const { send, close, open, isOpen } = useConnection({
    collabChange: (action: Event) => {
      setCollabIds((ids) => ({
        ...ids,
        [action.boardId]: { joinOrder: action.joinOrder },
      }));
    },
    rtMousePosition: (action: Event) => {
      setCollabMice((ids) => ({
        ...ids,
        [action.boardId]: action.mousePosition,
      }));
    },
  });

  const {
    mousePosition,
    on: trackingOn,
    off: trackingOff,
  } = useMousePosition();

  useEffect(() => {
    if (isOpen) sendEvent("rtMousePosition", { mousePosition });
  }, [isOpen, mousePosition]);

  const sendEvent = (type: EventType, payload: object) => {
    const event = JSON.stringify({
      boardId,
      eventId: String(Math.random()), // TODO: ????
      ...payload,
      type,
    });
    send(event);
  };

  useEffect(() => {
    isOpen ? trackingOn() : trackingOff();
    sendEvent("collabChange", {});
  }, [isOpen]);

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
      panic(`WARNING irrevocable loss of data`);
      return;
    }
    setTool(tool);
  };

  useEffect(() => {
    setTracking(pendingCoords.length === 1);

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

  const removeDrawing = (id: Id) => {
    setDrawings((d) => d.filter((dd) => dd.id !== id));
  };

  const onDrawingSelect = useCallback((id: Id) => {
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
    (id: Id, position: [IPosition, IPosition]) => {
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
      <PanicBox messages={panicMessages} history={history} />
      {drawings.map((d) => (
        <Drawing
          {...d}
          boardRef={boardRef.current}
          key={d.id}
          onDrawingSelect={() => onDrawingSelect(d.id)}
          selected={d.id === selectedDrawing}
          onPositionUpdate={(coords) => {
            console.log(typeof d.id, d.id, coords);
            sendEvent("updateSingleDrawingPosition", {
              drawingId: d.id,
              coords,
            });
            updateSingleDrawingPosition(d.id, coords);
          }}
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

      <ToolBar
        sessionConnect={open}
        sessionDisconnect={close}
        sessionIsOpen={isOpen}
        onSelect={resetTool}
        selected={tool}
        onImport={(content, filetype) => {
          console.log(filetype);
          if (!content || !filetype) return;
          setDrawings(importData(filetype, content.toString()));
        }}
      />

      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {Object.entries(collabMice).map(([id, c]) => {
          const color = reconcileColor(collabIds[id].joinOrder ?? 0);
          return (
            <div
              style={{
                position: "absolute",
                top: c.y,
                left: c.x,
                width: "28px",
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PanicBox = ({
  messages,
  history,
}: {
  messages: unknown[];
  history: unknown[];
}) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 8,
        top: 0,
        left: 0,

        minWidth: "4px",
        minHeight: "4px",

        margin: "24px",

        borderColor: colors.e,
        borderRadius: 4,
        borderWidth: "2px",
        borderStyle: "solid",

        color: colors.e,

        backgroundColor: "inherit",
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {isHover &&
        messages.length === 0 &&
        history.map((message) => {
          return (
            <Row paddingScale={1}>
              <label>{`${message}`}</label>
            </Row>
          );
        })}
      {messages.length > 0 && <Delim label="PANIC" />}
      {messages.map((message) => {
        return (
          <Row paddingScale={1}>
            <label>{`${message}`}</label>
          </Row>
        );
      })}
      {messages.length > 0 && <Delim label="- --" />}
      {messages.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: -12,
            rotate: "270deg",
          }}
        >
          <Delim
            color={colors.b}
            label={`SC-${Math.random().toString().slice(2, 6)}`}
            scale={0.33}
          />
        </div>
      )}
    </div>
  );
};

const useConnection = (subscriptions: Record<string, (s: string) => void>) => {
  const { panic } = usePanicContext();
  const socket = useRef<WebSocket>();

  // const ready = () => socket.current?.OPEN === 1;
  const [ready, setReady] = useState(false);

  const close = () => {
    socket.current?.close();
    setReady(false);
  };

  const open = () => {
    console.log("creating localhost:5000");

    socket.current = new WebSocket("ws://localhost:5000/ws");

    // Connection opened
    socket.current.addEventListener("open", () => {
      setReady(true);
      console.log("socket opened");
    });

    socket.current.addEventListener("close", (event) => {
      console.log("closing connection");
      setReady(false);
      panic(event.code);
    });

    // Listen for messages
    socket.current.addEventListener("message", (event) => {
      const p = JSON.parse(event.data);
      console.log("Got message from server ", event.data, p);
      if (!p) return;
      subscriptions[p?.type]?.(p);
    });

    socket.current.addEventListener("error", (event) => {
      console.log(event.toString());
      panic(`websocket error`);
    });
  };

  const send = (event: string) => {
    if (!ready) return;
    console.log("Sending payload:", event);
    socket.current?.send(event);
  };

  return { send, close, open, isOpen: ready };
};
