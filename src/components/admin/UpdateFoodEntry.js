import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRecoilState } from "recoil";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
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
  Grid,
  TextField,
  Box,
} from "@mui/material";
import { DateTimePicker, LoadingButton } from "@mui/lab";
// atoms
import { adminFoodEntriesAtom } from "../../recoil/atoms/foodEntries";
// apis
import { adminFoodEntryRequestHandler } from "../../apis/foodEntry";
//
import { MIconButton } from "../@material-extend";

UpdateFoodEntry.propTypes = {
  isTriggerd: PropTypes.bool,
  closeHandler: PropTypes.func,
  foodEntryId: PropTypes.number,
};

function UpdateFoodEntry({ isTriggerd, closeHandler, foodEntryId }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [adminFoodEntries, setAdminFoodEntries] =
    useRecoilState(adminFoodEntriesAtom);

  const [foodEntry, setFoodEntry] = useState(null);

  const formik = useFormik({
    initialValues: {
      foodName: foodEntry?.food_name,
      timestamp: moment(foodEntry?.timestamp),
      calories: foodEntry?.calories,
    },
    validationSchema: Yup.object().shape({
      foodName: Yup.string().required(
        "Please enter the food name for this meal"
      ),
      timestamp: Yup.date().required(
        "Please choose the date & time when you have taken this meal"
      ),
      calories: Yup.number().required(
        "Please enter the calories amount for this meal"
      ),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const data = new FormData();
      data.append("foodEntryId", foodEntryId);
      data.append("foodName", values.foodName);
      data.append("calories", values.calories);
      data.append(
        "timestamp",
        moment(values.timestamp).format("YYYY-MM-DD HH:mm")
      );

      await adminFoodEntryRequestHandler("put", data)
        .then((foodEntriesResponse) => {
          setAdminFoodEntries(foodEntriesResponse);
          enqueueSnackbar("Food entry updated successfully", {
            variant: "success",
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            ),
          });
        })
        .catch((error) => console.log(error));

      closeHandler();
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

  useEffect(() => {
    const foodEntryData = adminFoodEntries.find(
      (foodEntry) => foodEntry.id === foodEntryId
    );
    setFoodEntry(foodEntryData);
  }, [foodEntryId, adminFoodEntries]);

  return (
    <Dialog fullWidth open={isTriggerd} onClose={closeHandler}>
      <DialogTitle>Update {foodEntry?.food_name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                label="Food name"
                value={values.foodName}
                onChange={(event) =>
                  setFieldValue("foodName", event.target.value)
                }
                {...getFieldProps("foodName")}
                error={Boolean(touched.foodName && errors.foodName)}
                helperText={touched.foodName && errors.foodName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <DateTimePicker
                label="When you took the food ?"
                value={values.timestamp}
                onChange={(newValue) => setFieldValue("timestamp", newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Boolean(
                      touched.foodDateTimeIntake && errors.foodDateTimeIntake
                    )}
                    helperText={
                      touched.foodDateTimeIntake && errors.foodDateTimeIntake
                    }
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                label="Calories"
                type="number"
                value={values.calories}
                onChange={(event) =>
                  setFieldValue("calories", event.target.value)
                }
                {...getFieldProps("calories")}
                error={Boolean(touched.calories && errors.calories)}
                helperText={touched.calories && errors.calories}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error">Cancel</Button>
        <LoadingButton
          variant="contained"
          disabled={!dirty}
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateFoodEntry;
