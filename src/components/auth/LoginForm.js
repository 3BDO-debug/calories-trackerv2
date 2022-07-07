import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import { useSnackbar } from "notistack";
import closeFill from "@iconify/icons-eva/close-fill";
import { useNavigate } from "react-router-dom";
// material
import { Paper, Grid, TextField, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
// atoms
import { authAtom } from "../../recoil/atoms/auth";
// apis
import { loginRequest, userInfoRequest } from "../../apis/auth";
//
import { MIconButton } from "../@material-extend";

function LoginForm() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const setUser = useRecoilState(authAtom)[1];

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Username can't be empty"),
      password: Yup.string().required("Password can't be empty"),
    }),
    onSubmit: async (values) => {
      const data = new FormData();
      data.append("username", values.username);
      data.append("password", values.password);
      await loginRequest(data)
        .then(async () => {
          await userInfoRequest()
            .then((userInfoResponse) => {
              setUser(userInfoResponse);
              enqueueSnackbar("Login success", {
                variant: "success",
                action: (key) => (
                  <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                    <Icon icon={closeFill} />
                  </MIconButton>
                ),
              });
              navigate("/");
            })
            .catch((error) =>
              enqueueSnackbar(
                `Something wrong happened but user logged in successfully----${error}`,
                {
                  variant: "errpr",
                  action: (key) => (
                    <MIconButton
                      size="small"
                      onClick={() => closeSnackbar(key)}
                    >
                      <Icon icon={closeFill} />
                    </MIconButton>
                  ),
                }
              )
            );
        })
        .catch((error) =>
          enqueueSnackbar(
            error.response.status === 401
              ? "Wrong username or password"
              : `Something wrong happened and we couldn't log you in ---- ${error}`,
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
    },
  });

  const {
    values,
    setFieldValue,
    getFieldProps,
    dirty,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
  } = formik;

  return (
    <Paper component="form">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TextField
            label="Username"
            type="text"
            value={values.username}
            onChange={(event) => setFieldValue("username", event.target.value)}
            {...getFieldProps("username")}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={values.password}
            onChange={(event) => setFieldValue("password", event.target.value)}
            {...getFieldProps("password")}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MIconButton
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </MIconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <LoadingButton
            fullWidth
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={!dirty}
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Login
          </LoadingButton>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default LoginForm;
