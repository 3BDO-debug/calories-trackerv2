import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import { useRecoilState, useRecoilValue } from "recoil";
// material
import { useTheme } from "@mui/material/styles";
// atoms
import { foodEntriesAtom } from "../../../recoil/atoms/foodEntries";
import { authAtom } from "../../../recoil/atoms/auth";
import { caloriesThresholdAtom } from "../../../recoil/atoms/userConfigs";
// apis
import { dailyCaloriesThresholdFetcher } from "../../../apis/userConfigs";
//
import BaseOptionChart from "../../BaseOptionChart";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------

const CHART_DATA = [44];

export default function CaloriesChart() {
  const theme = useTheme();
  const user = useRecoilValue(authAtom);
  const foodEntries = useRecoilValue(foodEntriesAtom);
  const [caloriesThreshold, setCaloriesThreshold] = useRecoilState(
    caloriesThresholdAtom
  );
  const [caloriesTotal, setCaloriesTotal] = useState(0);

  const chartOptions = merge(BaseOptionChart(), {
    labels: ["Daily calories"],
    chart: {
      id: `basic-bar${Math.random()}`,
    },
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          [
            { offset: 0, color: theme.palette.primary.light },
            { offset: 100, color: theme.palette.primary.main },
          ],
          [
            { offset: 0, color: theme.palette.warning.light },
            { offset: 100, color: theme.palette.warning.main },
          ],
        ],
      },
    },
    legend: { horizontalAlign: "center" },
    plotOptions: {
      radialBar: {
        hollow: { size: "80%" },
        dataLabels: {
          value: { offsetY: 15 },
          total: {
            label: "Calories threshold",
            formatter() {
              return caloriesThreshold;
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    const filteredFoodEntries = foodEntries.filter(
      (foodEntry) =>
        moment(Date(foodEntry.timestamp)).isSame(Date(new Date())) &&
        foodEntry.calories
    );
    const totalCalories = filteredFoodEntries.reduce(
      (accumlator, foodEntry) => accumlator + foodEntry.calories,
      0
    );

    setCaloriesTotal(totalCalories);
  }, [foodEntries]);

  useEffect(async () => {
    await dailyCaloriesThresholdFetcher(user?.id)
      .then((dailyCaloriesThresholdResponse) =>
        setCaloriesThreshold(dailyCaloriesThresholdResponse.threshold)
      )
      .catch((error) => console.log("couldnt fetch threshold", error));
  }, [user, setCaloriesThreshold]);

  return (
    <ReactApexChart
      type="radialBar"
      series={[(caloriesTotal / caloriesThreshold) * 100]}
      options={chartOptions}
      height={250}
    />
  );
}
