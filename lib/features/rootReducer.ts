import { combineReducers } from "@reduxjs/toolkit";
import settingReducer from "./settings/settingSlice";

const rootReducer = combineReducers({
  setting: settingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
