import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react";
import { useSnackbar } from "notistack";
import closeFill from "@iconify/icons-eva/close-fill";
// material
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// atoms
import { inviteFriendAtom } from "../recoil/atoms/inviteFriend";
// apis
import { inviteFriendRequest } from "../apis/auth";
import { MIconButton } from "./@material-extend";
//

function InviteFriend() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [inviteFriend, triggerInviteFriend] = useRecoilState(inviteFriendAtom);

  const [credientialsGenerated, setCredientialsGenerated] = useState(false);
  const [generatedUsername, setGeneratedUsername] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required("Please enter your friend first name"),
      lastName: Yup.string().required("Please enter your friend last name"),
      email: Yup.string()
        .email("Please enter a valid email")
        .required("Please enter your friend email"),
    }),
    onSubmit: async (values) => {
      setCredientialsGenerated(false);
      const data = new FormData();
      data.append("firstName", values.firstName);
      data.append("lastName", values.lastName);
      data.append("email", values.email);
      await inviteFriendRequest(data)
        .then((credientials) => {
          setGeneratedUsername(credientials.username);
          setGeneratedPassword(credientials.password);
          setCredientialsGenerated(true);
          enqueueSnackbar("Successully invited a friend", {
            variant: "success",
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            ),
          });
        })
        .catch(() =>
          enqueueSnackbar("Something wrong happened", {
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
    getFieldProps,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleSubmit,
  } = formik;

  return (
    <Dialog
      fullWidth
      open={inviteFriend}
      onClose={() => {
        setGeneratedUsername("");
        setGeneratedPassword("");
        setCredientialsGenerated(false);
        triggerInviteFriend(false);
      }}
    >
      <DialogTitle>Invite friend</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                label="First name"
                value={values.firstName}
                onChange={(event) =>
                  setFieldValue("firstName", event.target.value)
                }
                {...getFieldProps("firstName")}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                label="Last name"
                value={values.lastName}
                onChange={(event) =>
                  setFieldValue("lastName", event.target.value)
                }
                {...getFieldProps("lastName")}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                label="Email"
                value={values.email}
                onChange={(event) => setFieldValue("email", event.target.value)}
                {...getFieldProps("email")}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                fullWidth
              />
            </Grid>
            {credientialsGenerated && (
              <>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Typography variant="subtitle2">Credientials</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextField
                    label="Username"
                    value={generatedUsername}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Copy to clipboard">
                            <MIconButton
                              edge="end"
                              onClick={() =>
                                navigator.clipboard.writeText(generatedUsername)
                              }
                            >
                              <ContentCopyIcon />
                            </MIconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextField
                    label="Password"
                    value={generatedPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Copy to clipboard">
                            <MIconButton
                              edge="end"
                              onClick={() =>
                                navigator.clipboard.writeText(generatedPassword)
                              }
                            >
                              <ContentCopyIcon />
                            </MIconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          onClick={() => {
            setGeneratedUsername("");
            setGeneratedPassword("");
            setCredientialsGenerated(false);
            triggerInviteFriend(false);
          }}
        >
          cancel
        </Button>
        <LoadingButton
          variant="contained"
          disabled={!dirty}
          onClick={handleSubmit}
          loading={isSubmitting}
          endIcon={<SendIcon />}
        >
          Invite
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default InviteFriend;
