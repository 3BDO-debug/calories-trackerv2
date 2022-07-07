import { atom } from "recoil";

export const addFoodEntryAtom = atom({
  key: "addsFoodEntry",
  default: false,
});

export const addFoodEntryModeAtom = atom({
  key: "addFoodEntryMode",
  default: true,
});
