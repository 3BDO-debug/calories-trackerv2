import React from "react";
import { RecoilRoot } from "recoil";
// material
import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
// theme
import ThemeConfig from "./theme";
import GlobalStyles from "./theme/globalStyles";
//
import AppView from "./pages";
import { Box } from "@mui/material";
import NotistackProvider from "./components/NotistackProvider";

function App() {
  return (
    <Box>
      <RecoilRoot>
        <ThemeConfig>
          <GlobalStyles />
          <LocalizationProvider dateAdapter={DateAdapter}>
            <NotistackProvider>
              <AppView />
            </NotistackProvider>
          </LocalizationProvider>
        </ThemeConfig>
      </RecoilRoot>
    </Box>
  );
}

export default App;
