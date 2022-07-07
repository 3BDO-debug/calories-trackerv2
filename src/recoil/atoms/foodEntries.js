import { atom } from "recoil";

export const foodEntriesAtom = atom({
  key: "foodEntries",
  default: [],
});

export const adminFoodEntriesAtom = atom({
  key: "adminFoodEntries",
  default: [],
});
