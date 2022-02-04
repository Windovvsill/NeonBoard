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
  const [colorMode, setColorMode] = useState(ColorModes.DARK);
  const [theme, setTheme] = useState<keyof IThemeSet>("default");

  return themeMap[colorMode][theme];
};
