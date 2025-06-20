import { configureStore } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk"; 
import testReducer from "./slices/test";

export const store = configureStore({
  reducer: {
    test: testReducer,

  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),

});
