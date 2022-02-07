import { neonBorder, useTheme } from "components/ds/useTheme";
import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { Tools } from "../../types/enums";
import { Column, Row } from "../library/container";

interface IToolBarProps {
  onSelect: (tool: Tools) => void;
  selected: Tools;
  onImport: (
    content: string | null | undefined | ArrayBuffer,
    filetype: string | undefined
  ) => void;
}

const tools = [
  {
    shortcut: ["Digit0"],
    label: Tools.CLEAR,
  },
  {
    shortcut: ["Digit1", "KeyL"],
    label: Tools.LINE,
  },
  {
    shortcut: ["Digit2", "KeyA"],
    label: Tools.ARROW,
  },
  {
    shortcut: ["Digit3", "KeyB"],
    label: Tools.BOX,
  },
  {
    shortcut: ["Digit4", "KeyT"],
    label: Tools.TEXT,
  },
  {
    shortcut: ["Digit5", "KeyC"],
    label: Tools.POINTER,
  },
];

export const ToolBar = ({ onSelect, selected, onImport }: IToolBarProps) => {
  const onKeyDown = useCallback((ev: KeyboardEvent) => {
    const tool = tools.find((t) => t.shortcut.includes(ev.code));
    if (tool) onSelect(tool.label);
    console.log(ev.code, typeof ev.code);
  }, []);

  useEffect(() => {
    document.addEventListener("keypress", onKeyDown);
    return () => document.removeEventListener("keypress", onKeyDown);
  });

  return (
    <Row onClick={(e) => e.stopPropagation()}>
      {tools.map((t) => (
        <Column key={t.label}>
          <ToolButton
            onClick={onSelect}
            label={t.label}
            selected={t.label === selected}
          />
        </Column>
      ))}
      <Column key={"import"}>
        <button
          onClick={async () => {
            const selectFile = async (
              contentType: string
            ): Promise<FileList | null> => {
              return new Promise((resolve) => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = false;
                input.accept = contentType;

                input.onchange = () => {
                  resolve(input.files);
                };

                input.click();
              });
            };

            const files = await selectFile(".json,.excalidraw,.neonboard");
            if (!files?.[0]) return;
            console.log(files);
            const fileType = files[0].name.split(".").pop();
            const reader = new FileReader();

            reader.addEventListener("load", function (e) {
              onImport(e?.target?.result, fileType);
            });

            reader.readAsBinaryString(files[0]);
          }}
        >
          {"import"}
        </button>
      </Column>
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
        ...neonBorder(
          selected ? theme.neonTubeB : theme.neonTubeC,
          selected ? 2 : 0.5
        ),
        height: 60,
        width: 60,
        backgroundColor: "#000000",
        color: theme.primaryText,
      }}
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  );
};
