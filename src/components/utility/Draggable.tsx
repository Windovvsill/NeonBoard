import React, {
  FC,
  PureComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { findDOMNode } from "react-dom";
import { IPosition } from "../../types/types";

interface IDraggableProps {
  children: any;
  onPositionUpdate: (position: [IPosition, IPosition]) => void;
  coords: [IPosition?, IPosition?];
  listenerNode?: HTMLDivElement | null;
}

export const Draggable = ({
  children,
  onPositionUpdate,
  coords,
  listenerNode,
}: IDraggableProps) => {
  const node = useRef<HTMLDivElement>();

  const [dragFrom, setDragFrom] = useState<{
    clientX: number;
    clientY: number;
  } | null>(null);

  const onDragStart = ({ clientX, clientY }: MouseEvent) => {
    console.log("ON DRAG START", clientX, clientY);
    setDragFrom({ clientX, clientY });
  };

  useEffect(() => {
    console.log("box position:", coords);
  }, [coords]);

  useEffect(() => {
    const onDrag = ({ clientX, clientY }: MouseEvent) => {
      console.log(
        "&ondrag, dragfrom:",
        dragFrom,
        "mouse position",
        clientX,
        clientY
      );
      updateOffset({ clientX, clientY });
    };

    // const n = findDOMNode(this);
    const thisNode = listenerNode || node.current;

    if (dragFrom) thisNode?.addEventListener("mousemove", onDrag);
    else thisNode?.removeEventListener("mousemove", onDrag);
    return () => thisNode?.removeEventListener("mousemove", onDrag);
  }, [dragFrom]);

  const updateOffset = ({
    clientX,
    clientY,
  }: {
    clientX: number;
    clientY: number;
  }) => {
    const offset = {
      clientX: clientX - (dragFrom?.clientX ?? 0),
      clientY: clientY - (dragFrom?.clientY ?? 0),
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

      console.log("updating position", "dragfrom:", dragFrom);

      if (dragFrom) setDragFrom({ clientX, clientY });
    }
  };

  const onDragEnd = (e: MouseEvent) => {
    setDragFrom(null);
  };

  return React.cloneElement(React.Children.only(children), {
    ref: node,
    // Note: mouseMove handler is attached to document so it will still function
    // when the user drags quickly and leaves the bounds of the element.
    onMouseDown: onDragStart,
    onMouseUp: onDragEnd,
  });
};
