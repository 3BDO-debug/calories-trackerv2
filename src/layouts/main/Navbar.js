import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useSnackbar } from "notistack";
import { Icon } from "@iconify/react";
import closeFill from "@iconify/icons-eva/close-fill";
import { useNavigate } from "react-router-dom";
// material
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import SpaIcon from "@mui/icons-material/Spa";
import {
  Avatar,
  AppBar,
  Box,
  Tooltip,
  useTheme,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsIcon from "@mui/icons-material/Settings";
import LightModeIcon from "@mui/icons-material/LightMode";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
// apis
import { logoutRequest } from "../../apis/auth";
// atoms
import { authAtom } from "../../recoil/atoms/auth";
import { themeModeAtom } from "../../recoil/atoms/themeMode";
import { appLoaderAtom } from "../../recoil/atoms/appLoader";
import { userSettingsAtom } from "../../recoil/atoms/userSettings";
import { inviteFriendAtom } from "../../recoil/atoms/inviteFriend";
//
import { MIconButton } from "../../components/@material-extend";

export default function Navbar() {
  const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [user, setUser] = useRecoilState(authAtom);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [themeMode, setThemeMode] = useRecoilState(themeModeAtom);
  const navigate = useNavigate();
  const appIsLoading = useRecoilValue(appLoaderAtom);
  const triggerUserSettings = useRecoilState(userSettingsAtom)[1];
  const triggerInviteFriend = useRecoilState(inviteFriendAtom)[1];

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutRequest()
      .then(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        navigate("/");
        enqueueSnackbar("Logged out, we wish to see you back soon.", {
          variant: "success",
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          ),
        });
      })
      .catch((error) =>
        enqueueSnackbar(
          `Something wrong happened and we couldn't log you out ---- ${error}`,
          {
            variant: "error",
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            ),
          }
        )
      );
    setLoggingOut(false);
  };

  const handleThemeMode = () => {
    if (themeMode === "light") {
      setThemeMode("dark");
    } else {
      setThemeMode("light");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" color="transparent">
        <Toolbar sx={{ display: "flex", flex: 1, padding: 1.5 }}>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <SpaIcon
              sx={{
                mr: 1,
                width: "50px",
                height: "50px",
                color: theme.palette.primary.main,
              }}
            />
          </Box>
          <Box sx={{ display: "flex" }}>
            <Tooltip title="Invite friend">
              <IconButton onClick={() => triggerInviteFriend(true)}>
                <GroupAddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                themeMode === "dark" ? "Enable light mode" : "Enable dark mode"
              }
            >
              <IconButton onClick={handleThemeMode} sx={{ marginRight: 1 }}>
                {themeMode === "light" ? (
                  <DarkModeIcon />
                ) : (
                  <LightModeIcon sx={{ color: "#F4E99B" }} />
                )}
              </IconButton>
            </Tooltip>
            {!user?.is_superuser && (
              <Tooltip title="App settings">
                <IconButton
                  sx={{ marginRight: 1 }}
                  onClick={() => triggerUserSettings(true)}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} sx={{ marginRight: 1 }}>
                {loggingOut ? (
                  <CircularProgress />
                ) : (
                  <LogoutIcon color="inherit" />
                )}
              </IconButton>
            </Tooltip>
            {appIsLoading ? (
              <Skeleton variant="circular" width={50} height={50} />
            ) : (
              <IconButton>
                <Avatar
                  src={user?.profile_pic}
                  sx={{ width: 50, height: 50 }}
                  alt={user?.username}
                />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
