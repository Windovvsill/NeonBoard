import { neonBorder, useTheme } from "components/ds/useTheme";
import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { Tools } from "../../types/enums";
import { Column, Row } from "../library/container";

interface IToolBarProps {
  onSelect: (tool: Tools) => void;
  selected: Tools;
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

export const ToolBar = ({ onSelect, selected }: IToolBarProps) => {
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
          <ToolButton
            onClick={onSelect}
            label={t.label}
            selected={t.label === selected}
          />
        </Column>
      ))}
    </Row>
  );
};

interface IToolButtonProps {
  label: Tools;
  onClick: (tool: Tools) => void;
  selected: boolean;
}

const ToolButton = ({ onClick, label, selected }: IToolButtonProps) => {
  const theme = useTheme();
  return (
    <button
      style={{
        ...neonBorder(selected ? theme.neonTubeD : theme.neonTubeC),
        height: 60,
        width: 60,
      }}
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  );
};
