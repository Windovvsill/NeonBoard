import { useState } from "react";
import { colors } from ".";

const enum ColorModes {
  DARK = "dark",
  LIGHT = "light",
}

interface ITheme {
  neonTubeA: string;
  neonTubeB: string;
  neonTubeC: string;
  neonTubeD: string;
  primaryText: string;
  anchor: string;
}

type IThemeSet = {
  default: ITheme;
};

type TModedTheme = {
  [K in ColorModes]: IThemeSet;
};

const themeMap: TModedTheme = {
  [ColorModes.DARK]: {
    default: {
      neonTubeA: colors.a,
      neonTubeB: colors.b,
      neonTubeC: colors.c,
      neonTubeD: colors.d,
      primaryText: colors.white,
      anchor: colors.white,
    },
  },
  [ColorModes.LIGHT]: {
    default: {
      neonTubeA: colors.a,
      neonTubeB: colors.b,
      neonTubeC: colors.c,
      neonTubeD: colors.d,
      primaryText: colors.white,
      anchor: colors.white,
    },
  },
};

export const useTheme = () => {
  // For future use
  const [colorMode] = useState(ColorModes.DARK);
  const [theme] = useState<keyof IThemeSet>("default");

  return themeMap[colorMode][theme];
};

export const neonBorder = (color: string, glow = 1) => ({
  boxShadow: `0 0 ${glow / 5}rem #fff,
              0 0 ${glow / 5}rem #fff,
              0 0 ${glow * 2}rem ${color},
              0 0 ${glow * 0.8}rem ${color},
              0 0 ${glow * 2.8}rem ${color},
              inset 0 0 ${glow * 1.3}rem ${color}`,
  borderWidth: "2px",
  borderStyle: "solid",
  borderColor: color,
  borderRadius: 8,
});

export const selectedBorder = (selected: boolean, color: string) =>
  selected
    ? {
        borderWidth: "1px",
        borderStyle: "dotted",
        borderColor: color,
      }
    : {};
