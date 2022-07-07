import React, { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Icon } from "@iconify/react";
import closeFill from "@iconify/icons-eva/close-fill";
// atoms
import { authAtom } from "../recoil/atoms/auth";
import { appLoaderAtom } from "../recoil/atoms/appLoader";
// pages
import AdminView from "./admin";
import AuthView from "./auth";
import UserView from "./user";
import { userInfoRequest } from "../apis/auth";
//
import { MIconButton } from "../components/@material-extend";
import LoadingScreen from "../components/LoadingScreen";

function AppView() {
  const [user, setUser] = useRecoilState(authAtom);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [appIsLoading, setIsAppLoading] = useRecoilState(appLoaderAtom);
  const location = useLocation();
  const navigate = useNavigate();

  const handleComponentRender = useCallback(() => {
    let componentToBeRendered;

    if (localStorage.getItem("access_token") && user?.is_superuser) {
      componentToBeRendered = <AdminView />;
    } else if (localStorage.getItem("access_token") && !user?.is_superuser) {
      componentToBeRendered = <UserView />;
    } else {
      componentToBeRendered = <AuthView />;
    }
    return (componentToBeRendered = <UserView />);
  }, [user, localStorage.getItem("access_token")]);

  useEffect(async () => {
    if (localStorage.getItem("access_token")) {
      setIsAppLoading(true);
      await userInfoRequest()
        .then((userInfoResponse) => {
          setUser(userInfoResponse);
          navigate("/");
          setIsAppLoading(false);
        })
        .catch((error) => {
          navigate("/auth/login");
          setIsAppLoading(false);
          localStorage.removeItem("access_token");
          console.log("error fetching user info");
        });
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/auth/login");
      if (location.pathname !== "/auth/login") {
        enqueueSnackbar(`Session expired, please login `, {
          variant: "error",
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          ),
        });
      }
    }
  }, [
    location.pathname,
    closeSnackbar,
    enqueueSnackbar,
    navigate,
    setIsAppLoading,
    setUser,
  ]);

  return <>{appIsLoading ? <LoadingScreen /> : handleComponentRender()}</>;
}

export default AppView;
