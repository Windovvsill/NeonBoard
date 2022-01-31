import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { Tools } from "../../types/enums";
import { Column, Row } from "../library/container";

interface IToolBarProps {
  onSelect: (tool: Tools) => void;
}

const tools = [
  {
    shortcut: "Digit0",
    label: Tools.CLEAR,
  },
  {
    shortcut: "Digit1",
    label: Tools.LINE,
  },
  {
    shortcut: "Digit2",
    label: Tools.BOX,
  },
  {
    shortcut: "Digit3",
    label: Tools.TEXT,
  },
  {
    shortcut: "Digit4",
    label: Tools.POINTER,
  },
];

export const ToolBar = ({ onSelect }: IToolBarProps) => {
  const onKeyDown = useCallback((ev: KeyboardEvent) => {
    const tool = tools.find((t) => t.shortcut === ev.code);
    if (tool) onSelect(tool.label);
    console.log(ev.code, typeof ev.code);
  }, []);

  useEffect(() => {
    document.addEventListener("keypress", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  return (
    <Row onClick={(e: MouseEvent) => e.stopPropagation()}>
      {tools.map((t) => (
        <Column key={t.label}>
          <ToolButton onClick={onSelect} label={t.label} />
        </Column>
      ))}
    </Row>
  );
};

interface IToolButtonProps {
  label: Tools;
  onClick: (tool: Tools) => void;
}

const ToolButton = ({ onClick, label }: IToolButtonProps) => {
  return <button onClick={() => onClick(label)}>{label}</button>;
};
