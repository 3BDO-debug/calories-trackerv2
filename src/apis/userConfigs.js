import axiosInstance from "./config";

export const dailyCaloriesThresholdFetcher = async (userId) =>
  axiosInstance
    .get(`/user-configurations/daily-calories-threshold/${userId}`)
    .then((response) => response.data);

export const dailyCaloriesThresholdUpdater = async (userId, requestData) =>
  axiosInstance({
    method: "put",
    url: `/user-configurations/daily-calories-threshold/${userId}`,
    data: requestData,
  }).then((response) => response.data);

export const mealsRequestHandler = async (userId, requestType, requestData) =>
  axiosInstance({
    method: requestType,
    data: requestData,
    url: `/user-configurations/meals/${userId}`,
  }).then((response) => response.data);
