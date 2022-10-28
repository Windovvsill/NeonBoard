import { colors } from "components/ds";
import { useTheme } from "components/ds/useTheme";
import { Delim } from "components/library/sugar";
import React, { useState } from "react";
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
  sessionIsOpen: boolean;
  sessionConnect: () => void;
  sessionDisconnect: () => void;
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

export const ToolBar = ({
  onSelect,
  selected,
  onImport,
  sessionIsOpen,
  sessionConnect,
  sessionDisconnect,
}: IToolBarProps) => {
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
    <div
      style={{
        zIndex: 7,

        borderWidth: "1px",
        borderColor: colors.maximumYellowRed,
        borderRadius: 4,
        borderStyle: "solid",

        // Prevents text in the tool bar from being highlighted while the user is
        // dragging the cursor, eg when resizing a box
        userSelect: "none",
      }}
    >
      <Row paddingScale={0} onClick={(e) => e.stopPropagation()}>
        <Delim label="::" />
        {tools.map((t) => (
          <Column key={t.label} paddingScale={0}>
            <ToolButton
              onClick={onSelect}
              label={t.label}
              selected={t.label === selected}
            />
          </Column>
        ))}
        <Column key={"import"}>
          <button
            style={{
              display: "none",
            }}
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

        <Delim label="///" />
        <Column key={"sessionConnect"} paddingScale={0}>
          <ToolButton
            onClick={sessionIsOpen ? sessionDisconnect : sessionConnect}
            label={sessionIsOpen ? "disconnect" : "connect"}
            selected={false}
          />
        </Column>
        <Delim label="-" />
      </Row>
    </div>
  );
};

interface IToolButtonProps<T extends string> {
  label: T;
  onClick: (tool: T) => void;
  selected: boolean;
}

const ToolButton = <T extends string>({
  onClick,
  label,
  selected,
}: IToolButtonProps<T>) => {
  const theme = useTheme();
  const [bgColour, setBgColour] = useState(false);

  return (
    <div
      style={{
        borderColor: bgColour
          ? colors.maximumRed
          : selected
          ? colors.maximumYellowRed
          : "transparent",
        borderRadius: 4,
        borderWidth: "2px",
        borderStyle: "solid",

        borderTopWidth: 0,
        borderBottomWidth: 0,
      }}
    >
      <button
        style={{
          margin: "2px",
          borderColor: selected ? colors.maximumYellowRed : "transparent",
          borderRadius: 4,
          borderWidth: "2px",

          height: 60,
          width: 60,
          backgroundColor: "transparent",
          color: theme.primaryText,
        }}
        onMouseEnter={() => setBgColour(true)}
        onMouseLeave={() => setBgColour(false)}
        onClick={() => onClick(label)}
      >
        {label}
      </button>
    </div>
  );
};
