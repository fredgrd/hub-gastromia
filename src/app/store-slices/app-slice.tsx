import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AppState {
  toast: { isOpen: boolean; message: string };
  authModal: boolean;
}

const slice = createSlice({
  name: "app",
  initialState: {
    toast: {
      isOpen: false,
      message: "",
    },
  } as AppState,
  reducers: {
    setToastState: (
      state,
      {
        payload: { isOpen, message },
      }: PayloadAction<{ isOpen: boolean; message: string }>
    ) => {
      state.toast.isOpen = isOpen;
      state.toast.message = message;
    },
  },
});

export const { setToastState } = slice.actions;

export default slice.reducer;

export const selectToastState = (state: RootState) => state.app.toast;
