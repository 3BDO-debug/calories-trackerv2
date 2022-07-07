import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRecoilState, useRecoilValue } from "recoil";
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
  Typography,
  Slider,
  Stack,
  Divider,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { LoadingButton } from "@mui/lab";
// atoms
import { authAtom } from "../../../recoil/atoms/auth";
// apis
import { mealsRequestHandler } from "../../../apis/userConfigs";
//
import Scrollbar from "../../Scrollbar";
import Meal from "./Meal";
import AddMeal from "./AddMeal";
import DailyCaloriesThreshold from "./DailyCaloriesThreshold";
import { mealsAtom } from "../../../recoil/atoms/userConfigs";

UserSettings.propTypes = {
  isTriggered: PropTypes.bool,
  closeHandler: PropTypes.func,
};

function UserSettings({ isTriggered, closeHandler }) {
  const [preDefinedMealsView, setPreDefinedMealsView] = useState("viewMeals");

  const user = useRecoilValue(authAtom);

  const [meals, setMeals] = useRecoilState(mealsAtom);

  useEffect(async () => {
    if (user) {
      await mealsRequestHandler(user?.id, "get")
        .then((mealsResponse) => setMeals(mealsResponse))
        .catch((error) => console.log("error fetching meals", error));
    }
  }, [user]);

  return (
    <Dialog fullWidth open={isTriggered} onClose={closeHandler}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box paddingTop={3}>
          <Stack direction="column" sx={{ width: "100%" }}>
            <Typography sx={{ mb: 1 }} variant="subtitle2">
              Daily calories threshold
            </Typography>
            <DailyCaloriesThreshold />
            <Box
              sx={{
                display: "flex",
                margin: "20px 0 20px 0",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Divider sx={{ width: "100%" }} />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={{ flex: 1 }} variant="subtitle2">
                Pre-defined meals
              </Typography>
              <Button
                onClick={() => {
                  if (preDefinedMealsView === "viewMeals") {
                    setPreDefinedMealsView("addMeal");
                  } else {
                    setPreDefinedMealsView("viewMeals");
                  }
                }}
                startIcon={
                  preDefinedMealsView === "viewMeals" ? (
                    <AddIcon />
                  ) : (
                    <RestaurantIcon />
                  )
                }
              >
                {preDefinedMealsView === "viewMeals"
                  ? "Add meal"
                  : "View meals"}
              </Button>
            </Box>

            {preDefinedMealsView === "viewMeals" ? (
              <Box>
                <Scrollbar
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "300px",
                    width: "100%",
                    overflowY: "scroll",
                  }}
                >
                  {meals.map((meal) => (
                    <Box mb={2} mt={2}>
                      <Meal
                        key={meal.id}
                        data={meal}
                        mealsState={[meals, setMeals]}
                      />
                    </Box>
                  ))}
                </Scrollbar>
              </Box>
            ) : (
              <AddMeal mealsState={[meals, setMeals]} />
            )}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={closeHandler}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserSettings;
