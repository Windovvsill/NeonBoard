import React, { useCallback, useEffect, useRef } from "react";
import { IPosition } from "../../types/types";

interface IDraggableProps {
  children: React.ReactElement;
  onPositionUpdate: (position: [IPosition, IPosition]) => void;
  coords: [IPosition?, IPosition?];
  listenerNode?: HTMLDivElement | null;
  bypass?: boolean;
}

export const Draggable = ({
  children,
  onPositionUpdate,
  coords,
  listenerNode,
  bypass = false,
}: IDraggableProps) => {
  const node = useRef<HTMLDivElement>();
  const listeners = useRef<(({ clientX, clientY }: MouseEvent) => void)[]>([]);
  const thisNode = listenerNode || node.current;

  const dragFrom = useRef<{
    clientX: number;
    clientY: number;
  } | null>(null);

  const accumulatedOffset = useRef<{
    clientX: number;
    clientY: number;
  } | null>(null);

  const onMouseMove = useCallback(({ clientX, clientY }: MouseEvent) => {
    if (!dragFrom.current) return;

    const offset = {
      clientX: clientX - dragFrom.current.clientX,
      clientY: clientY - dragFrom.current.clientY,
    };

    accumulatedOffset.current = {
      clientX: (accumulatedOffset.current?.clientX ?? 0) + offset.clientX,
      clientY: (accumulatedOffset.current?.clientY ?? 0) + offset.clientY,
    };

    dragFrom.current = { clientX, clientY };

    if (accumulatedOffset.current?.clientX !== 0 || accumulatedOffset.current?.clientY !== 0) {
      onPositionUpdate(applyOffset() as [IPosition, IPosition]);
    }
  }, [coords]);

  const attachListener = () => {
    listeners.current.push(onMouseMove);
    thisNode?.addEventListener("mousemove", onMouseMove);
  };

  const cleanup = useCallback(() => {
    listeners.current.forEach((listener) => {
      thisNode?.removeEventListener("mousemove", listener);
    });
    listeners.current = [];
    dragFrom.current = null;
    accumulatedOffset.current = null;
  }, [thisNode]);

  const onDragStart = ({ clientX, clientY }: MouseEvent) => {
    cleanup();
    accumulatedOffset.current = { clientX: 0, clientY: 0 };
    dragFrom.current = { clientX, clientY };
    attachListener();
  };

  const applyOffset = () => {
    if (!accumulatedOffset.current) return coords;
    return [
      {
        x: (coords[0]?.x ?? 0) + (accumulatedOffset.current?.clientX ?? 0),
        y: (coords[0]?.y ?? 0) + (accumulatedOffset.current?.clientY ?? 0),
      },
      {
        x: (coords[1]?.x ?? 0) + (accumulatedOffset.current?.clientX ?? 0),
        y: (coords[1]?.y ?? 0) + (accumulatedOffset.current?.clientY ?? 0),
      },
    ];
  };

  const onDragEnd = () => {
    // if (accumulatedOffset.current?.clientX !== 0 || accumulatedOffset.current?.clientY !== 0) {
    //   onPositionUpdate(applyOffset() as [IPosition, IPosition]);
    // }
    cleanup();
  };

  useEffect(() => {
    return cleanup;
  }, []);

  if (bypass) return React.cloneElement(React.Children.only(children), {});

  return React.cloneElement(React.Children.only(children), {
    ref: node,
    onMouseDown: onDragStart,
    onMouseUp: onDragEnd,
    // onMouseLeave: onDragEnd,
  });
};
