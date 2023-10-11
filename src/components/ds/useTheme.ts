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
      neonTubeA: colors.maximumRed,
      neonTubeB: colors.spanishOrange,
      neonTubeC: colors.maximumYellowRed,
      neonTubeD: colors.shockingPink,
      primaryText: colors.snow,
      anchor: colors.snow,
    },
  },
  [ColorModes.LIGHT]: {
    default: {
      neonTubeA: colors.seaGreen,
      neonTubeB: colors.maximumYellowRed,
      neonTubeC: colors.spanishOrange,
      neonTubeD: colors.shockingPink,
      primaryText: colors.snow,
      anchor: colors.snow,
    },
  },
};

export const useTheme = () => {
  // For future use
  const [colorMode] = useState(ColorModes.DARK);
  const [theme] = useState<keyof IThemeSet>("default");

  return themeMap[colorMode][theme];
};

const glowBase = 4;

export const neonBorder = (color: string, glowLevel = 0.25) => {
  const glow = glowBase * glowLevel;
  return {
    boxShadow: `0 0 ${glow / 5}px #fff,
              0 0 ${glow / 5}px #fff,
              0 0 ${glow * 2}px ${color},
              0 0 ${glow * 0.8}px ${color},
              0 0 ${glow * 2.8}px ${color},
              inset 0 0 ${glow * 1.3}px ${color}`,
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: color,
    borderRadius: 8,
  };
};

export const selectedBorder = (selected: boolean, color: string) =>
  selected
    ? {
      borderWidth: "2px",
      borderStyle: "dotted",
      borderColor: color,
    }
    : {};
