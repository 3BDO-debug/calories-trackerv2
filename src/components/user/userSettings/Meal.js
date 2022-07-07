import React, { useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { useSnackbar } from "notistack";
import closeFill from "@iconify/icons-eva/close-fill";
import { useRecoilState, useRecoilValue } from "recoil";
import { useFormik } from "formik";
import * as Yup from "yup";
// material
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
// apis
import { mealsRequestHandler } from "../../../apis/userConfigs";
// atoms
import { authAtom } from "../../../recoil/atoms/auth";
//
import Label from "../../Label";
import { MIconButton } from "../../@material-extend";
import { mealsAtom } from "../../../recoil/atoms/userConfigs";

// ----------------------------------------

const mealsCategories = [
  { name: "Breakfast", icon: <FreeBreakfastIcon /> },
  { name: "Lunch", icon: <LunchDiningIcon /> },
  { name: "Dinner", icon: <DinnerDiningIcon /> },
];

// ----------------------------------------

Meal.propTypes = {
  data: PropTypes.object,
};

function Meal({ data, mealsState }) {
  const { id, name, category, food_entry_limit } = data;

  const [meals, setMeals] = useRecoilState(mealsAtom);

  const [updateMode, setUpdateMode] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const user = useRecoilValue(authAtom);

  const [deleting, setIsDeleting] = useState(false);

  const formik = useFormik({
    initialValues: {
      mealName: name,
      mealCategory: category,
      foodEntryLimit: food_entry_limit,
    },
    validationSchema: Yup.object().shape({
      mealName: Yup.string().required("Meal name is required"),
      mealCategory: Yup.string().required(
        "Please choose a category for your meal"
      ),
      foodEntryLimit: Yup.number()
        .min(1, "Food limit cannot be less than 1 per meal")
        .required("Food entry limit per meal is required"),
    }),
    onSubmit: async (values) => {
      const data = new FormData();
      data.append("mealId", id);
      data.append("mealName", values.mealName);
      data.append("mealCategory", values.mealCategory);
      data.append("foodEntryLimit", values.foodEntryLimit);
      await mealsRequestHandler(user?.id, "put", data)
        .then((mealsResponse) => {
          setMeals(mealsResponse);
          setUpdateMode(false);
          enqueueSnackbar("Meal updated successfully", {
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
    dirty,
    touched,
    errors,
    isSubmitting,
    handleSubmit,
  } = formik;

  const handleDeleteMeal = async () => {
    setIsDeleting(true);
    const data = new FormData();
    data.append("mealId", id);
    await mealsRequestHandler(user?.id, "delete", data)
      .then((mealsResponse) => {
        setMeals(mealsResponse);
        enqueueSnackbar("Meal deleted successfully", {
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
          variant: "success",
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          ),
        })
      );
    setIsDeleting(false);
  };

  return (
    <>
      {updateMode ? (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField
              label="Meal name"
              value={values.mealName}
              onChange={(event) =>
                setFieldValue("mealName", event.target.value)
              }
              {...getFieldProps("mealName")}
              error={Boolean(touched.mealName && errors.mealName)}
              helperText={touched.mealName && errors.mealName}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              label="Food limit"
              type="number"
              value={values.foodEntryLimit}
              onChange={(event) =>
                setFieldValue("foodEntryLimit", event.target.value)
              }
              {...getFieldProps("foodEntryLimit")}
              error={Boolean(touched.foodEntryLimit && errors.foodEntryLimit)}
              helperText={touched.foodEntryLimit && errors.foodEntryLimit}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              label="Meal category"
              value={values.mealCategory}
              onChange={(event) => console.log("mealCategory")}
              {...getFieldProps("mealCategory")}
              error={Boolean(touched.mealCategory && errors.mealCategory)}
              helperText={touched.mealCategory && errors.mealCategory}
              fullWidth
              select
            >
              {mealsCategories.map((meal, index) => (
                <MenuItem
                  selected={meal.name === values.mealCategory}
                  value={meal.name}
                  key={index}
                >
                  <Stack direction="row" alignItems="center">
                    <IconButton disableRipple>{meal.icon}</IconButton>
                    <Typography variant="caption2">{meal.name}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <LoadingButton
              sx={{ float: "right" }}
              variant="contained"
              disabled={!dirty}
              loading={isSubmitting}
              onClick={handleSubmit}
            >
              Save
            </LoadingButton>
            <Button
              color="error"
              sx={{ float: "right" }}
              onClick={() => setUpdateMode(false)}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 1,
          }}
        >
          <Typography variant="caption">{name}</Typography>
          <Label variant="ghost" color="info">
            {category}
          </Label>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <LoadingButton
              startIcon={<DeleteIcon />}
              sx={{ mr: 1 }}
              color="error"
              loading={deleting}
              disabled={deleting}
              onClick={handleDeleteMeal}
            >
              Delete
            </LoadingButton>
            <Button
              onClick={() => setUpdateMode(true)}
              startIcon={<EditIcon />}
              color="warning"
              variant="outlined"
            >
              Update
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}

export default Meal;
