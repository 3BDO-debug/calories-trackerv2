import { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import _, { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
// atoms
import { adminFoodEntriesAtom } from "../../../recoil/atoms/foodEntries";
import { addFoodEntryAtom } from "../../../recoil/atoms/addUpdateFoodEntry";
//
import BaseOptionChart from "../../BaseOptionChart";

// ----------------------------------------------------------------------

function FoodEntriesChart() {
  const foodEntries = useRecoilValue(adminFoodEntriesAtom);
  const [foodEntriesSevenDaysBefore, setFoodEntriesSevenDaysBefore] = useState(
    []
  );
  const [foodEntriesWeekBeforeThat, setFoodEntriesWeekBeforeThat] = useState(
    []
  );

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    tooltip: {
      y: {
        formatter(val) {
          return `${val} Food entry`;
        },
      },
      x: {
        formatter(val) {
          return `${val} Food entry`;
        },
      },
    },
    plotOptions: { bar: { columnWidth: "16%" } },
  });

  const validateArrayLength = (array1, array2) => {
    const weekDays = {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      7: "Sunday",
    };
    const dataSet1 = [];
    const dataSet2 = [];

    for (let index = 1; index <= 7; index++) {
      const arrObj1 = array1.find((value) => value.day === weekDays[index]);
      const arrObj2 = array2.find((value) => value.day === weekDays[index]);
      if (arrObj1) {
        dataSet1.push({ x: weekDays[index], y: arrObj1.value });
      } else {
        dataSet1.push({ x: weekDays[index], y: 0 });
      }
      if (arrObj2) {
        dataSet2.push({ x: weekDays[index], y: arrObj2.value });
      } else {
        dataSet2.push({ x: weekDays[index], y: 0 });
      }
    }

    setFoodEntriesSevenDaysBefore(dataSet1);
    setFoodEntriesWeekBeforeThat(dataSet2);
  };

  const handleChartData = useCallback(() => {
    const weekDays = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    };

    // seven days before logic
    const today = moment();
    const sevenDaysBefore = moment().subtract(7, "days");
    const foodEntriesSevenDaysBefore = foodEntries
      .filter((foodEntry) => {
        const dateInstance = moment(foodEntry.timestamp);
        const isBetween = dateInstance.isBetween(sevenDaysBefore, today);
        return isBetween;
      })
      .map((foodEntry) => {
        const dateInstance = moment(foodEntry.timestamp);
        return { ...foodEntry, day: dateInstance.format("dddd") };
      })
      .sort((a, b) => weekDays[a.day] - weekDays[b.day]);

    const groupedFoodEntriesSevenDaysBefore = _.map(
      _.groupBy(foodEntriesSevenDaysBefore, "day"),
      (value) => ({ day: value[0].day, value: value.length })
    );

    setFoodEntriesSevenDaysBefore(groupedFoodEntriesSevenDaysBefore);

    // week before that logic

    const startOfWeekBeforeThat = moment(sevenDaysBefore).subtract(7, "days");
    const foodEntriesWeekBeforeThat = foodEntries
      .filter((foodEntry) => {
        const dateInstance = moment(foodEntry.timestamp);
        const isBetween = dateInstance.isBetween(
          startOfWeekBeforeThat,
          sevenDaysBefore
        );

        return isBetween;
      })
      .map((foodEntry) => {
        const dateInstance = moment(foodEntry.timestamp);
        return { ...foodEntry, day: dateInstance.format("dddd") };
      })
      .sort((a, b) => weekDays[a.day] - weekDays[b.day]);

    const groupedFoodEntriesWeekBeforeThat = _.map(
      _.groupBy(foodEntriesWeekBeforeThat, "day"),
      (value) => ({ day: value[0].day, value: value.length })
    );
    setFoodEntriesWeekBeforeThat(groupedFoodEntriesWeekBeforeThat);

    validateArrayLength(
      groupedFoodEntriesSevenDaysBefore,
      groupedFoodEntriesWeekBeforeThat
    );
  }, [foodEntries]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      handleChartData();
      return () => {
        isMounted = false;
      };
    }
  }, [foodEntries, handleChartData]);

  return (
    <ReactApexChart
      type="bar"
      series={[
        { name: "Last 7 days", data: foodEntriesSevenDaysBefore },
        { name: "Week before that", data: foodEntriesWeekBeforeThat },
      ]}
      options={chartOptions}
      height={320}
    />
  );
}

export default FoodEntriesChart;
