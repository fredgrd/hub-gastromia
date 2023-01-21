import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

import { Item } from "../../models/item";
import { fetchAllItems } from "../services/items-api";

interface ItemsState {
  items: Item[];
  isFetchingItems: boolean;
  isFetchingItem: boolean;
}

export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async (_, thunkApi) => {
    const items = await fetchAllItems();
    return items;
  }
);

const slice = createSlice({
  name: "items",
  initialState: {
    items: [],
    isFetchingItems: false,
    isFetchingItem: false,
  } as ItemsState,
  reducers: {
    updateLocalItem: (
      state,
      {
        payload: { itemID, update },
      }: PayloadAction<{ itemID: string; update: {} }>
    ) => {
      const itemIdx = state.items.findIndex((e) => e._id === itemID);

      if (itemIdx !== -1) {
        const updatedItem = { ...state.items[itemIdx], ...update };
        state.items[itemIdx] = updatedItem;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchItems.pending, (state, _) => {
      state.isFetchingItems = true;
    });
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      state.items = action.payload;
      state.isFetchingItems = false;
    });
  },
});

export const { updateLocalItem } = slice.actions;

export default slice.reducer;

export const selectItems = (state: RootState) => state.items.items;

export const selectItem = (state: RootState, id: string) => {
  const item = state.items.items.find((e) => e._id === id);

  if (item) {
    return item;
  } else {
    return null;
  }
};
