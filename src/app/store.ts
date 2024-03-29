import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import authReducer from "./store-slices/auth-slice";
import appReducer from "./store-slices/app-slice";
import itemsReducer from "./store-slices/items-slice";
import attributesReducer from "./store-slices/attributes-slice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    items: itemsReducer,
    attributes: attributesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
