import { createSlice } from "@reduxjs/toolkit";
// import FILES from "../../constants/files";

const initialState = {
  test : "test"
};

export const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    test: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const {test } = testSlice.actions;

export default testSlice.reducer;
