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

export const neonBorder = (color: string) => ({
  boxShadow: `0 0 .2rem #fff,
              0 0 .2rem #fff,
              0 0 2rem ${color},
              0 0 0.8rem ${color},
              0 0 2.8rem ${color},
              inset 0 0 1.3rem ${color}`,
  border: `2px solid ${color}`,
  borderRadius: 8,
});
