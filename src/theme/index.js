import PropTypes from "prop-types";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
// material
import { CssBaseline } from "@mui/material";
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
// atoms
import { themeModeAtom } from "../recoil/atoms/themeMode";
//
import shape from "./shape";
import palette from "./palette";
import typography from "./typography";
import breakpoints from "./breakpoints";
import componentsOverride from "./overrides";
import shadows, { customShadows } from "./shadows";

// ----------------------------------------------------------------------

ThemeConfig.propTypes = {
  children: PropTypes.node,
};

export default function ThemeConfig({ children }) {
  const themeMode = useRecoilValue(themeModeAtom);

  const themeOptions = useMemo(
    () => ({
      palette:
        themeMode === "light"
          ? { ...palette.light, mode: "light" }
          : { ...palette.dark, mode: "dark" },
      shape,
      typography,
      breakpoints,
      direction: "ltr",
      shadows: themeMode === "light" ? shadows.light : shadows.dark,
      customShadows:
        themeMode === "light" ? customShadows.light : customShadows.dark,
    }),
    [themeMode]
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
