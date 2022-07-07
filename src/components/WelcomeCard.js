import React from "react";
import { useRecoilValue } from "recoil";
// material
import { Box, Button, Paper, Skeleton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// atoms
import { authAtom } from "../recoil/atoms/auth";
import { appLoaderAtom } from "../recoil/atoms/appLoader";
// assets
import WelcomeIcon from "../assets/WelcomeIcon";

function WelcomeCard() {
  const theme = useTheme();
  const user = useRecoilValue(authAtom);
  const appIsLoading = useRecoilValue(appLoaderAtom);

  return (
    <Paper
      sx={{
        display: "flex",
        padding: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.primary.light,
        alignItems: "center",
        justifyContent: "space-between",
        height: "350px",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        width="50%"
        padding={2}
        justifyContent="center"
      >
        <Typography
          sx={{
            mb: 2,
            color:
              theme.palette.mode === "dark" ? "rgb(33, 43, 54)" : "default",
          }}
          variant="h4"
        >
          Welcome back,<br></br>{" "}
          {appIsLoading ? (
            <Skeleton
              variant="text"
              sx={{ background: theme.palette.primary.light }}
            />
          ) : (
            `${user?.first_name} ${user?.last_name}`
          )}
        </Typography>
        <Typography
          sx={{
            color:
              theme.palette.mode === "dark" ? "rgb(33, 43, 54)" : "default",
          }}
          variant="body2"
        >
          Attitude is a choice. Happiness is a choice. Optimism is a choice.
          Kindness is a choice. Giving is a choice. Respect is a choice.
          Whatever choice you make makes you. Choose wisely
        </Typography>
        <Button
          onClick={() => window.open("https://codehustle.live", "__blank")}
          sx={{ width: "130px", mt: 5 }}
          variant="contained"
        >
          Get started
        </Button>
      </Box>
      <Box width={250} height={250} display="flex">
        <WelcomeIcon />
      </Box>
    </Paper>
  );
}

export default WelcomeCard;
