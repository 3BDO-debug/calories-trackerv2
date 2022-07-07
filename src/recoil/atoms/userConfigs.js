import { atom } from "recoil";

export const caloriesThresholdAtom = atom({
  key: "caloriesThreshold",
  default: 2100,
});

export const mealsAtom = atom({
  key: "meal",
  default: [],
});
