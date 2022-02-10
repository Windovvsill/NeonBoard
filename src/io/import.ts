import { Tools } from "types/enums";
import type { Id, IDrawing } from "types/types";

type ExcalibdrawElement = {
  x: number;
  y: number;
  height: number;
  width: number;
  type: string;
  id: Id;
  text?: string;
};

const neonAdaptor = (fileContent: string) => JSON.parse(fileContent);

const excalidrawAdaptor = (fileContent: string) => {
  const data: { elements: ExcalibdrawElement[] } = JSON.parse(fileContent);

  const exToolToNeon = (type: string) => {
    switch (type) {
      case "rectangle":
        return Tools.BOX;
      case "text":
        return Tools.TEXT;
      case "line":
        return Tools.LINE;
      case "arrow":
        return Tools.ARROW;
      default:
        return null;
    }
  };

  const neonDrawings: IDrawing[] = data.elements
    .filter((e: { type: string }) => exToolToNeon(e.type))
    .map((e: ExcalibdrawElement) => ({
      coords: [
        { x: e.x, y: e.y },
        { x: e.x + e.width, y: e.y + e.height },
      ],
      tool: exToolToNeon(e.type),
      id: e.id,
      text: e.text,
    }));

  return neonDrawings;
};

const supportedFileTypes: {
  [k: string]: typeof excalidrawAdaptor | undefined;
} = {
  excalidraw: excalidrawAdaptor,
  neonboard: neonAdaptor,
};

export const importData = (fileType: string, fileContent: string) => {
  const adaptor = supportedFileTypes[fileType];

  if (!adaptor) return [];

  return adaptor(fileContent);
};
