import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { Operator } from "../../models/operator";
import { fetchOperator } from "../services/auth-api";
import { RootState } from "../store";

interface AuthState {
  operator: Operator | null | undefined;
  isFetchingOperator: boolean;
}

export const fetchRemoteOperator = createAsyncThunk(
  "auth/fetchOperator",
  async (_, thunkApi) => {
    const operator = await fetchOperator();
    return operator;
  }
);

const slice = createSlice({
  name: "auth",
  initialState: {
    operator: undefined,
    isFetchingOperator: false,
  } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { operator } }: PayloadAction<{ operator: Operator | null }>
    ) => {
      state.operator = operator;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRemoteOperator.pending, (state, _) => {
      state.isFetchingOperator = true;
    });
    builder.addCase(fetchRemoteOperator.fulfilled, (state, action) => {
      state.operator = action.payload;
      state.isFetchingOperator = false;
    });
  },
});

export const { setCredentials } = slice.actions;

export default slice.reducer;

export const selectCurrentOperator = (state: RootState) => state.auth.operator;
