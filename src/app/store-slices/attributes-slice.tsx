import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ItemAttribute } from "../../models/item";
import { fetchAllAttributes } from "../services/items-api";

interface AttributesState {
  attributes: ItemAttribute[];
  isFetchingAttributes: boolean;
  isFetchingAttribute: boolean;
}

export const fetchAttributes = createAsyncThunk(
  "items/fetchAttributes",
  async (_, thunkApi) => {
    const items = await fetchAllAttributes();
    return items;
  }
);

const slice = createSlice({
  name: "attributes",
  initialState: {
    attributes: [],
    isFetchingAttributes: false,
    isFetchingAttribute: false,
  } as AttributesState,
  reducers: {
    updateLocalAttribute: (
      state,
      {
        payload: { attributeID, update },
      }: PayloadAction<{ attributeID: string; update: {} }>
    ) => {
      const attributeIdx = state.attributes.findIndex(
        (e) => e._id === attributeID
      );
      if (attributeIdx !== -1) {
        const updatedAttribute = {
          ...state.attributes[attributeIdx],
          ...update,
        };
        state.attributes[attributeIdx] = updatedAttribute;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAttributes.pending, (state, _) => {
      state.isFetchingAttributes = true;
    });
    builder.addCase(fetchAttributes.fulfilled, (state, action) => {
      state.attributes = action.payload;
      state.isFetchingAttributes = false;
    });
  },
});

export const { updateLocalAttribute } = slice.actions;

export default slice.reducer;

export const selectAttributes = (state: RootState) =>
  state.attributes.attributes;

export const selectAttribute = (state: RootState, id: string) => {
  const attribute = state.attributes.attributes.find((e) => e._id === id);

  if (attribute) {
    return attribute;
  } else {
    return null;
  }
};
