import axiosInstance from "./config";

export const foodEntryRequestHandler = async (
  userId,
  requestType,
  requestData
) =>
  axiosInstance({
    method: requestType,
    url: `/food-entries/food-entries-data/${userId}`,
    data: requestData,
  }).then((response) => response.data);

export const adminFoodEntryRequestHandler = async (requestType, requestData) =>
  axiosInstance({
    method: requestType,
    url: "/food-entries/admin-food-entries-data",
    data: requestData,
  }).then((response) => response.data);
