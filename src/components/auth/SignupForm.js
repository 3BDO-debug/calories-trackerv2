import React, { useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import _ from "loadsh";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import closeFill from "@iconify/icons-eva/close-fill";
// material
import {
  Paper,
  Grid,
  TextField,
  FormHelperText,
  InputAdornment,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
// apis
import { signupRequest } from "../../apis/auth";
//
import { UploadAvatar } from "../upload";
import { MIconButton } from "../@material-extend";

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      profilePic: null,
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required("Please enter your first name"),
      lastName: Yup.string().required("Please enter your last name"),
      email: Yup.string()
        .email("Please enter a valid email")
        .required("Please enter your email"),
      username: Yup.string().required("Please enter your username"),
      password: Yup.string()
        .required(
          "Please enter a password with at least 8 chars (only latin letters)"
        )
        .min(8, "Password is too short - should be 8 chars minimum.")
        .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
      profilePic: Yup.mixed().required("Please choose profile picture"),
    }),
    onSubmit: async (values) => {
      const data = new FormData();
      _.forOwn(values, (value, key) =>
        data.append(key, key === "profilePic" ? value.file : value)
      );
      await signupRequest(data)
        .then(() => {
          navigate("/auth/login");
          enqueueSnackbar("Account created", {
            variant: "success",
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            ),
          });
        })
        .catch((error) =>
          enqueueSnackbar(`Something wrong happened---${error}`, {
            variant: "error",
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            ),
          })
        );
    },
  });

  const {
    values,
    setFieldValue,
    dirty,
    errors,
    touched,
    getFieldProps,
    isSubmitting,
    handleSubmit,
  } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue("profilePic", {
          file: file,
          preview: URL.createObjectURL(file),
        });
      }
    },
    [setFieldValue]
  );

  return (
    <Paper component="form">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            label="First name"
            type="text"
            value={values.firstName}
            onChange={(event) => setFieldValue("firstName", event.target.value)}
            {...getFieldProps("firstName")}
            error={Boolean(touched.firstName && errors.firstName)}
            helperText={touched.firstName && errors.firstName}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            label="Last name"
            type="text"
            value={values.lastName}
            onChange={(event) => setFieldValue("lastName", event.target.value)}
            {...getFieldProps("lastName")}
            error={Boolean(touched.lastName && errors.lastName)}
            helperText={touched.lastName && errors.lastName}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            label="Email"
            type="email"
            value={values.email}
            onChange={(event) => setFieldValue("email", event.target.value)}
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
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
            type="password"
            value={values.password}
            onChange={(event) => setFieldValue("password", event.target.value)}
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
            {...getFieldProps("password")}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <UploadAvatar
            accept="image/*"
            file={values.profilePic}
            onDrop={handleDrop}
            error={Boolean(touched.profilePic && errors.profilePic)}
            caption={
              <Typography
                variant="caption"
                sx={{
                  mt: 2,
                  mx: "auto",
                  display: "block",
                  textAlign: "center",
                  color: "text.secondary",
                }}
              >
                Allowed *.jpeg, *.jpg, *.png, *.gif
              </Typography>
            }
          />
          <FormHelperText {...getFieldProps("profilePic")} error>
            {errors.profilePic}
          </FormHelperText>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <LoadingButton
            fullWidth
            disabled={!dirty}
            loading={isSubmitting}
            onClick={handleSubmit}
            variant="contained"
            endIcon={<SendIcon />}
          >
            Signup
          </LoadingButton>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default SignupForm;
