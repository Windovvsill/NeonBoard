import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { Column, Row } from "../library/container";

interface IToolBarProps {
  onSelect: (tool: string) => void;
}

const tools = [
  {
    shortcut: "Digit0",
    label: "clear",
  },
  {
    shortcut: "Digit1",
    label: "line",
  },
  {
    shortcut: "Digit2",
    label: "box",
  },
  {
    shortcut: "Digit3",
    label: "text",
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
  label: string;
  onClick: (tool: string) => void;
}

const ToolButton = ({ onClick, label }: IToolButtonProps) => {
  return <button onClick={() => onClick(label)}>{label}</button>;
};
