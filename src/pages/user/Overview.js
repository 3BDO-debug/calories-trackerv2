import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import moment from "moment";
// material
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  Skeleton,
  Box,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import AddIcon from "@mui/icons-material/Add";
import RestoreIcon from "@mui/icons-material/Restore";
// atoms
import { userSettingsAtom } from "../../recoil/atoms/userSettings";
import { foodEntriesAtom } from "../../recoil/atoms/foodEntries";
import { authAtom } from "../../recoil/atoms/auth";
import {
  caloriesThresholdAtom,
  mealsAtom,
} from "../../recoil/atoms/userConfigs";
import { addFoodEntryAtom } from "../../recoil/atoms/addUpdateFoodEntry";
// apis
import { foodEntryRequestHandler } from "../../apis/foodEntry";
// layouts
import MainLayout from "../../layouts/main";
//
import WelcomeCard from "../../components/WelcomeCard";
import CaloriesChart from "../../components/user/caloriesChart/CaloriesChart";
import AddFoodEntry from "../../components/AddFoodEntry";
import UserSettings from "../../components/user/userSettings/UserSettings";
import CaloriesHistory from "../../components/user/CaloriesHistory";

// --------------------------------------------------------------------------

const columns = [
  { name: "foodName", label: "Food name" },
  { name: "meal", label: "Meal" },
  { name: "calories", label: "Calories" },
  { name: "timestamp", label: "Timestamp" },
];

// --------------------------------------------------------------------------

function Overview() {
  const user = useRecoilValue(authAtom);
  const [addFoodEntry, triggerAddFoodEntry] = useRecoilState(addFoodEntryAtom);
  const [userSettings, triggerUserSettings] = useRecoilState(userSettingsAtom);
  const [foodEntriesIsFetching, setFoodEntriesIsFetching] = useState(false);
  const [foodEntries, setFoodEntries] = useRecoilState(foodEntriesAtom);
  const [mappedFoodEntries, setMappedFoodEntries] = useState([]);
  const caloriesThreshold = useRecoilState(caloriesThresholdAtom)[0];
  const [caloriesHistory, triggerCaloriesHistory] = useState(false);
  const meals = useRecoilValue(mealsAtom);

  const isCaloriesThresholdExceeded = () => {
    let exceeded = false;
    const filteredFoodEntries = foodEntries.filter(
      (foodEntry) =>
        moment(Date(foodEntry.timestamp)).isSame(Date(new Date())) &&
        foodEntry.calories
    );
    const totalCalories = filteredFoodEntries.reduce(
      (accumlator, foodEntry) => accumlator + foodEntry.calories,
      0
    );
    if (totalCalories >= caloriesThreshold) {
      exceeded = true;
    }
    return exceeded;
  };

  useEffect(async () => {
    if (user) {
      setFoodEntriesIsFetching(true);
      await foodEntryRequestHandler(user?.id, "get")
        .then((foodEntriesResponse) => setFoodEntries(foodEntriesResponse))
        .catch((error) => console.log("error fetching food entries", error));
      setFoodEntriesIsFetching(false);
    }
  }, [user, meals, setFoodEntriesIsFetching]);

  useEffect(() => {
    const mappedFoodEntries = foodEntries.map((foodEntry) => ({
      foodName: foodEntry.food_name,
      meal: foodEntry.meal_name,
      calories: foodEntry.calories,
      timestamp: Date(foodEntry.timestamp),
    }));
    setMappedFoodEntries(mappedFoodEntries);
  }, [foodEntries]);

  return (
    <>
      <MainLayout>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={8} lg={8}>
            <WelcomeCard />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Card>
              <CardHeader
                title="Daily calories in take"
                action={
                  <Button
                    onClick={() => triggerCaloriesHistory(true)}
                    startIcon={<RestoreIcon />}
                    variant="contained"
                  >
                    Calories history
                  </Button>
                }
              />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {isCaloriesThresholdExceeded() && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      You have exceeded your daily calories limit
                    </Alert>
                  )}
                  <CaloriesChart />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Card>
              {foodEntriesIsFetching ? (
                <Skeleton width="100%" height={400} />
              ) : (
                <MUIDataTable
                  title={"Food entries"}
                  data={mappedFoodEntries}
                  columns={columns}
                  options={{
                    filterType: "checkbox",
                    elevation: 0,
                    selectableRows: false,
                  }}
                />
              )}
            </Card>
          </Grid>
        </Grid>
        <AddFoodEntry
          isTriggered={addFoodEntry}
          closeHandler={() => triggerAddFoodEntry(false)}
        />
        <UserSettings
          isTriggered={userSettings}
          closeHandler={() => triggerUserSettings(false)}
        />
        <CaloriesHistory
          isTriggered={caloriesHistory}
          closeHandler={() => triggerCaloriesHistory(false)}
        />
      </MainLayout>
      <Fab
        variant="extended"
        onClick={() => {
          triggerAddFoodEntry(true);
        }}
        sx={{
          display: "flex",
          position: "sticky",
          float: "right",
          bottom: "20px",
          right: "20px",
        }}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add food entry
      </Fab>
    </>
  );
}

export default Overview;
