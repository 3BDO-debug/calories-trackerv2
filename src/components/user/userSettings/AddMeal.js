import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react";
import { useSnackbar } from "notistack";
import closeFill from "@iconify/icons-eva/close-fill";
import { useRecoilValue, useRecoilState } from "recoil";
// material
import {
  Card,
  Grid,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
// apis
import { mealsRequestHandler } from "../../../apis/userConfigs";
// atoms
import { authAtom } from "../../../recoil/atoms/auth";
//
import { MIconButton } from "../../@material-extend";
import { mealsAtom } from "../../../recoil/atoms/userConfigs";

// ----------------------------------------

const mealsCategories = [
  { name: "Breakfast", icon: <FreeBreakfastIcon /> },
  { name: "Lunch", icon: <LunchDiningIcon /> },
  { name: "Dinner", icon: <DinnerDiningIcon /> },
];

// ----------------------------------------

function AddMeal({ mealsState }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const user = useRecoilValue(authAtom);
  const [meals, setMeals] = useRecoilState(mealsAtom);

  const formik = useFormik({
    initialValues: {
      mealName: "",
      mealCategory: "",
      foodEntryLimit: 1,
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
    onSubmit: async (values, { resetForm }) => {
      const data = new FormData();
      data.append("mealName", values.mealName);
      data.append("mealCategory", values.mealCategory);
      data.append("foodEntryLimit", values.foodEntryLimit);
      await mealsRequestHandler(user?.id, "post", data)
        .then((mealResponse) => {
          setMeals([...meals, mealResponse]);
          enqueueSnackbar("Meal added successfully", {
            variant: "success",
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            ),
          });
        })
        .catch((error) =>
          enqueueSnackbar("Something wrong happened", {
            variant: "error",
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            ),
          })
        );
      resetForm();
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

  return (
    <Card>
      <Grid container spacing={3} padding={1}>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <TextField
            label="Meal name"
            value={values.mealName}
            onChange={(event) => setFieldValue("mealName", event.target.value)}
            {...getFieldProps("mealName")}
            error={Boolean(touched.mealName && errors.mealName)}
            helperText={touched.mealName && errors.mealName}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            label="Meal category e,g (Dinner, lunch)"
            value={values.mealCategory}
            onChange={(event) =>
              setFieldValue("mealCategory", event.target.value)
            }
            {...getFieldProps("mealCategory")}
            error={Boolean(touched.mealCategory && errors.mealCategory)}
            helperText={touched.mealCategory && errors.mealCategory}
            fullWidth
            select
          >
            {mealsCategories.map((meal, index) => (
              <MenuItem value={meal.name} key={index}>
                <Stack direction="row" alignItems="center">
                  <IconButton disableRipple>{meal.icon}</IconButton>
                  <Typography variant="caption2">{meal.name}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3}>
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
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <LoadingButton
            disabled={!dirty}
            loading={isSubmitting}
            onClick={handleSubmit}
            sx={{ float: "right" }}
          >
            Save
          </LoadingButton>
        </Grid>
      </Grid>
    </Card>
  );
}

export default AddMeal;
