import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const thisNode = listenerNode || node.current;

  const dragFrom = useRef<{
    clientX: number;
    clientY: number;
  } | null>(null);

  const onDrag = useCallback(({ clientX, clientY }: MouseEvent) => {
    console.log(
      "&ondrag, dragfrom:",
      dragFrom.current,
      "mouse position",
      clientX,
      clientY
    );
    updateOffset({ clientX, clientY });
  }, []);

  const onDragStart = ({ clientX, clientY }: MouseEvent) => {
    console.log("ON DRAG START", clientX, clientY);
    dragFrom.current = { clientX, clientY };

    thisNode?.addEventListener("mousemove", onDrag);
  };

  const onDragEnd = () => {
    dragFrom.current = null;

    thisNode?.removeEventListener("mousemove", onDrag);
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragFrom.current) {
      e.stopPropagation();
    }
  };

  useEffect(() => {
    console.log("box position:", coords);
  }, [coords]);

  useEffect(() => {
    return () => thisNode?.removeEventListener("mousemove", onDrag);
  }, []);

  const updateOffset = ({
    clientX,
    clientY,
  }: {
    clientX: number;
    clientY: number;
  }) => {
    if (!dragFrom.current) {
      console.log("no drag from, cannot update position");
      return;
    }

    const offset = {
      clientX: clientX - (dragFrom.current?.clientX ?? 0),
      clientY: clientY - (dragFrom.current?.clientY ?? 0),
    };

    console.log("offset", offset);

    if (offset.clientX !== 0 || offset.clientY !== 0) {
      onPositionUpdate([
        {
          x: (coords[0]?.x ?? 0) + offset.clientX,
          y: (coords[0]?.y ?? 0) + offset.clientY,
        },
        {
          x: (coords[1]?.x ?? 0) + offset.clientX,
          y: (coords[1]?.y ?? 0) + offset.clientY,
        },
      ]);

      console.log("updating position", "dragfrom:", dragFrom.current);

      // if (dragFrom) setDragFrom({ clientX, clientY });
    }
  };

  if (bypass) return React.cloneElement(React.Children.only(children), {});

  return React.cloneElement(React.Children.only(children), {
    ref: node,
    // Note: mouseMove handler is attached to document so it will still function
    // when the user drags quickly and leaves the bounds of the element.
    onMouseDown: onDragStart,
    onMouseUp: onDragEnd,
    onMouseLeave: onDragEnd,
    onClick,
  });
};
