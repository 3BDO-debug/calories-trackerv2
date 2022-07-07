import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Icon } from "@iconify/react";
import { useSnackbar } from "notistack";
import closeFill from "@iconify/icons-eva/close-fill";
import moment from "moment";
import _ from "lodash";
// material
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
// recoil
import { authAtom } from "../../recoil/atoms/auth";
import { appLoaderAtom } from "../../recoil/atoms/appLoader";
// apis
import { adminFoodEntryRequestHandler } from "../../apis/foodEntry";
// atoms
import { addFoodEntryAtom } from "../../recoil/atoms/addUpdateFoodEntry";
import { adminFoodEntriesAtom } from "../../recoil/atoms/foodEntries";
// layouts
import MainLayout from "../../layouts/main";
//
import FoodEntriesChart from "../../components/admin/foodEntriesChart/FoodEntriesChart";
import { MIconButton } from "../../components/@material-extend";
import AddFoodEntry from "../../components/AddFoodEntry";
import UpdateFoodEntry from "../../components/admin/UpdateFoodEntry";

function Overview() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const user = useRecoilValue(authAtom);
  const [fetchingFoodEntries, setFetchingFoodEntries] = useState(false);
  const [adminFoodEntries, setAdminFoodEntries] =
    useRecoilState(adminFoodEntriesAtom);
  const [mappedFoodEntries, setMappedFoodEntries] = useState([]);
  const [triggeredFoodEntry, setTriggeredFoodEntry] = useState(0);
  const [deletingFoodEntry, setDeletingFoodEntry] = useState(false);
  const [addFoodEntry, triggerAddFoodEntry] = useRecoilState(addFoodEntryAtom);
  const [updateFoodEntry, triggerUpdateFoodEntry] = useState(false);
  const [usersAvgCalories, setUsersAvgCalories] = useState([]);

  const handleDeleteFoodEntry = async (foodEntryId) => {
    setDeletingFoodEntry(true);
    const data = new FormData();
    data.append("foodEntryId", foodEntryId);
    await adminFoodEntryRequestHandler("delete", data)
      .then((foodEntriesResponse) => {
        enqueueSnackbar("Food entry deleted successfully", {
          variant: "success",
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          ),
        });
        setAdminFoodEntries(foodEntriesResponse);
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
    setDeletingFoodEntry(false);
  };

  const columns = [
    { name: "foodName", label: "Food name" },
    { name: "meal", label: "Meal" },
    { name: "calories", label: "Calories" },
    { name: "timestamp", label: "Timestamp" },
    {
      name: "action",
      label: "Actions",
      options: {
        customBodyRender: (value) => (
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Button
              startIcon={<EditIcon />}
              sx={{ mr: 1 }}
              variant="outlined"
              color="warning"
              onClick={() => {
                setTriggeredFoodEntry(value);
                triggerUpdateFoodEntry(true);
              }}
            >
              Update
            </Button>
            <LoadingButton
              startIcon={<DeleteIcon />}
              disabled={deletingFoodEntry && triggeredFoodEntry === value}
              loading={deletingFoodEntry && triggeredFoodEntry === value}
              onClick={() => {
                setTriggeredFoodEntry(value);
                handleDeleteFoodEntry(value);
              }}
              color="error"
            >
              Delete
            </LoadingButton>
          </Box>
        ),
      },
    },
  ];

  useEffect(async () => {
    setFetchingFoodEntries(true);
    await adminFoodEntryRequestHandler("get")
      .then((adminFoodEntriesResponse) => {
        setAdminFoodEntries(adminFoodEntriesResponse);
      })
      .catch((error) => console.log("Error fetching food entris data", error));
    setFetchingFoodEntries(false);
  }, [setAdminFoodEntries, setFetchingFoodEntries]);

  useEffect(() => {
    const data = adminFoodEntries.map((foodEntry) => ({
      foodName: foodEntry.food_name,
      meal: foodEntry.meal_name,
      calories: foodEntry.calories,
      timestamp: moment(foodEntry.timestamp).toDate().toDateString(),
      action: foodEntry.id,
    }));
    setMappedFoodEntries(data);
  }, [adminFoodEntries]);

  useEffect(() => {
    const today = moment();
    const sevenDaysBefore = moment().subtract(7, "days");
    const foodEntriesSeventDaysBefore = adminFoodEntries.filter((foodEntry) => {
      const dateInstance = moment(foodEntry.timestamp);

      return dateInstance.isBetween(sevenDaysBefore, today);
    });
    const groupedFoodEntriesSevenDaysBefore = _.groupBy(
      foodEntriesSeventDaysBefore,
      "user"
    );

    const mappedData = _.map(
      groupedFoodEntriesSevenDaysBefore,
      (userfoodEntries) => {
        const totalCalories = userfoodEntries.reduce(
          (accumlator, foodEntry) => accumlator + foodEntry.calories,
          0
        );
        const avgCalories = totalCalories / userfoodEntries.length;

        return {
          userFullname: userfoodEntries[0].user_fullname,
          userProfilePic: userfoodEntries[0].user_profile_pic,
          avgCalories: parseInt(avgCalories, 10),
        };
      }
    );

    setUsersAvgCalories(
      mappedData.map((userAvgCalories) => ({
        user: userAvgCalories.userFullname,
        avgCalories: userAvgCalories.avgCalories,
      }))
    );
  }, [adminFoodEntries]);

  return (
    <>
      <MainLayout>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography variant="body1">
              Here's what's going on today.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            {fetchingFoodEntries ? (
              <Skeleton variant="text" />
            ) : (
              <Typography variant="h4">
                Welcome back, {user?.first_name} {user?.last_name}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={8} lg={8}>
            <Card>
              <CardHeader title="Users avg calories for last 7 days" />
              <CardContent>
                {fetchingFoodEntries ? (
                  <Skeleton sx={{ height: "400px" }} />
                ) : (
                  <MUIDataTable
                    columns={[
                      { name: "user", label: "User" },
                      { name: "avgCalories", label: "AVG calories" },
                    ]}
                    data={usersAvgCalories}
                    options={{
                      filterType: "checkbox",
                      elevation: 0,
                      selectableRows: false,
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Card>
              <CardHeader title="Food entries in last 7 days vs week before that" />
              <CardContent>
                {fetchingFoodEntries ? (
                  <Skeleton sx={{ height: "400px" }} />
                ) : (
                  <FoodEntriesChart />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Card>
              <CardHeader title="Food entries" />
              <CardContent>
                {fetchingFoodEntries ? (
                  <Skeleton sx={{ height: "500px" }} />
                ) : (
                  <MUIDataTable
                    columns={columns}
                    data={mappedFoodEntries}
                    options={{
                      filterType: "checkbox",
                      elevation: 0,
                      selectableRows: false,
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <AddFoodEntry
          isTriggered={addFoodEntry}
          closeHandler={() => triggerAddFoodEntry(false)}
        />
        <UpdateFoodEntry
          isTriggerd={updateFoodEntry}
          closeHandler={() => triggerUpdateFoodEntry(false)}
          foodEntryId={triggeredFoodEntry}
        />
      </MainLayout>
      <Fab
        variant="extended"
        sx={{
          display: "flex",
          position: "sticky",
          float: "right",
          bottom: "20px",
          right: "20px",
        }}
        onClick={() => {
          triggerAddFoodEntry(true);
        }}
      >
        <AddIcon />
        Add food entry
      </Fab>
    </>
  );
}

export default Overview;
