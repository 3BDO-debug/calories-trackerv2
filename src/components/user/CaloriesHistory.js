import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import moment from "moment";
import _ from "lodash";
// material
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
// atoms
import { foodEntriesAtom } from "../../recoil/atoms/foodEntries";
import { caloriesThresholdAtom } from "../../recoil/atoms/userConfigs";

CaloriesHistory.propTypes = {
  isTriggered: PropTypes.bool,
  closeHandler: PropTypes.func,
};

function CaloriesHistory({ isTriggered, closeHandler }) {
  const foodEntries = useRecoilValue(foodEntriesAtom);
  const [limitExceededFoodEntries, setLimitExceededFoodEntries] = useState([]);
  const caloriesThreshold = useRecoilValue(caloriesThresholdAtom);

  useEffect(() => {
    const formattedDateFoodEntries = foodEntries.map((foodEntry) => {
      const dateInstance = moment(foodEntry.timestamp);
      return {
        ...foodEntry,
        formattedDayDate: dateInstance.toDate().toDateString(),
      };
    });
    const groupedFoodEntries = _.groupBy(
      formattedDateFoodEntries,
      "formattedDayDate"
    );

    const limitExceededFoodEntriesData = _.map(
      groupedFoodEntries,
      (foodEntries) => {
        const totalCalories = foodEntries.reduce(
          (accumlator, foodEntry) => accumlator + foodEntry.calories,
          0
        );
        return {
          date: foodEntries[0].formattedDayDate,
          calories: totalCalories,
        };
      }
    );
    setLimitExceededFoodEntries(
      limitExceededFoodEntriesData.filter(
        (foodEntry) => foodEntry.calories >= caloriesThreshold
      )
    );
  }, [foodEntries, caloriesThreshold]);

  return (
    <Dialog fullWidth open={isTriggered} onClose={closeHandler}>
      <DialogTitle>Calories history</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 3 }}>
          <MUIDataTable
            columns={[
              { name: "date", label: "Date" },
              { name: "calories", label: "Calories" },
            ]}
            data={limitExceededFoodEntries}
            options={{
              filterType: "checkbox",
              elevation: 0,
              selectableRows: false,
              print: false,
              download: false,
              search: false,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeHandler} variant="contained">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CaloriesHistory;
