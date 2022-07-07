import React, { useEffect, useState } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRecoilValue, useRecoilState } from "recoil";
import { Icon } from "@iconify/react";
import { useSnackbar } from "notistack";
import closeFill from "@iconify/icons-eva/close-fill";
// material
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Button,
  Grid,
  TextField,
  Stack,
  Typography,
  IconButton,
  Autocomplete,
  Box,
  FormHelperText,
} from "@mui/material";
import { LoadingButton, DateTimePicker } from "@mui/lab";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
// apis
import { mealsRequestHandler } from "../apis/userConfigs";
import {
  adminFoodEntryRequestHandler,
  foodEntryRequestHandler,
} from "../apis/foodEntry";
// atoms
import { authAtom } from "../recoil/atoms/auth";
import {
  adminFoodEntriesAtom,
  foodEntriesAtom,
} from "../recoil/atoms/foodEntries";
import { addFoodEntryModeAtom } from "../recoil/atoms/addUpdateFoodEntry";
import { mealsAtom } from "../recoil/atoms/userConfigs";
//
import Label from "./Label";
import { MIconButton } from "./@material-extend";
import MealLimitWarning from "./user/MealLimitWarning";

AddFoodEntry.propTypes = {
  isTriggered: PropTypes.bool,
  closeHandler: PropTypes.func,
};

function AddFoodEntry({ isTriggered, closeHandler }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [isFetchingMeals, setIsFetchingMeals] = useState(false);
  const [meals, setMeals] = useRecoilState(mealsAtom);
  const user = useRecoilValue(authAtom);
  const [foodEntries, setFoodEntries] = useRecoilState(foodEntriesAtom);
  const [mealLimitWarning, triggerMealLimitWarning] = useState(false);
  const [adminFoodEntries, setAdminFoodEntries] =
    useRecoilState(adminFoodEntriesAtom);

  const [disableAddFoodEntries, setDisableAddFoodEntries] = useState(false);

  const formik = useFormik({
    initialValues: {
      meal: 0,
      foodDateTimeIntake: new Date(),
      foodName: "",
      calories: 100,
    },
    validationSchema: Yup.object().shape({
      meal: Yup.number()
        .min(0, "Please choose a meal")
        .required("Please choose the meal."),
      foodDateTimeIntake: Yup.date().required(
        "Please choose the date & time when you have taken this meal"
      ),
      foodName: Yup.string().required(
        "Please enter the food name for this meal"
      ),
      calories: Yup.number().required(
        "Please enter the calories amount for this meal"
      ),
    }),
    onSubmit: async (values, { resetForm }) => {
      const data = new FormData();
      data.append("mealId", values.meal);
      data.append(
        "foodDateTimeIntake",
        moment(values.foodDateTimeIntake).format("YYYY-MM-DD HH:mm")
      );
      data.append("foodName", values.foodName);
      data.append("calories", values.calories);

      if (user?.is_superuser) {
        await adminFoodEntryRequestHandler("post", data)
          .then((foodEntryResponse) => {
            setAdminFoodEntries([...adminFoodEntries, foodEntryResponse]);
            enqueueSnackbar("Food entry added successfully", {
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
      } else {
        await foodEntryRequestHandler(user?.id, "post", data)
          .then((foodEntryResponse) => {
            setFoodEntries([...foodEntries, foodEntryResponse]);
            enqueueSnackbar("Food entry added successfully", {
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
      }

      closeHandler();
      resetForm();
    },
  });

  const {
    values,
    dirty,
    setFieldValue,
    getFieldProps,
    errors,
    touched,
    handleSubmit,
    isSubmitting,
  } = formik;

  useEffect(async () => {
    if (user) {
      setIsFetchingMeals(true);
      await mealsRequestHandler(user?.id, "get")
        .then((mealsResponse) => setMeals(mealsResponse))
        .catch((error) => console.log("error fetching meals", error));
      setIsFetchingMeals(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.is_superuser) {
      const meal = meals.find((meal) => meal.id === parseInt(values.meal, 10));
      const mealFoodEntriesNumber = foodEntries.filter(
        (foodEntry) => foodEntry?.meal === meal?.id
      ).length;
      if (mealFoodEntriesNumber === meal?.food_entry_limit) {
        console.log(dirty);
        setDisableAddFoodEntries(true);
        triggerMealLimitWarning(true);
      } else {
        setDisableAddFoodEntries(false);
      }
    }
  }, [values.meal, foodEntries]);

  return (
    <>
      <Dialog open={isTriggered} onClose={closeHandler} maxWidth="sm">
        <DialogTitle>Add food entry</DialogTitle>
        <Paper component="form">
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Autocomplete
                  options={meals}
                  onChange={(event, newValue) =>
                    setFieldValue("meal", newValue.id)
                  }
                  loading={isFetchingMeals}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option) => (
                    <Box {...props}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyItems="space-between"
                      >
                        {option.category === "Breakfast" && (
                          <IconButton disableRipple>
                            <FreeBreakfastIcon />
                          </IconButton>
                        )}
                        {option.category === "Lunch" && (
                          <IconButton disableRipple>
                            <LunchDiningIcon />
                          </IconButton>
                        )}
                        {option.category === "Dinner" && (
                          <IconButton disableRipple>
                            <DinnerDiningIcon />
                          </IconButton>
                        )}
                        <Typography variant="subtitle2">
                          {option.name}
                        </Typography>
                        <Label variant="ghost" color="info">
                          {option.category}
                        </Label>
                      </Stack>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Please choose pre-defined meal"
                      fullWidth
                    />
                  )}
                />
                <FormHelperText {...getFieldProps("meal")} error>
                  {touched.meal && errors.meal}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <DateTimePicker
                  label="When you took the food ?"
                  value={values.foodDateTimeIntake}
                  onChange={(newValue) =>
                    setFieldValue("foodDateTimeIntake", newValue)
                  }
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
                  value={values.foodName}
                  onChange={(event) => setFieldValue(event.target.value)}
                  {...getFieldProps("foodName")}
                  error={Boolean(touched.foodName && errors.foodName)}
                  helperText={touched.foodName && errors.foodName}
                  label="Food name"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  placeholder={values.calories}
                  value={values.calories}
                  onChange={(event) => setFieldValue(event.target.value)}
                  {...getFieldProps("calories")}
                  error={Boolean(touched.calories && errors.calories)}
                  helperText={touched.calories && errors.calories}
                  label="Calories per food"
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeHandler} color="error">
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              disabled={disableAddFoodEntries || !dirty}
              loading={isSubmitting}
              onClick={handleSubmit}
              variant="contained"
            >
              Save
            </LoadingButton>
          </DialogActions>
        </Paper>
      </Dialog>
      <MealLimitWarning
        isTriggered={mealLimitWarning}
        closeHandler={() => triggerMealLimitWarning(false)}
      />
    </>
  );
}

export default AddFoodEntry;
