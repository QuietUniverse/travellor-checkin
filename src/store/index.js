import { configureStore } from "@reduxjs/toolkit";
import searchSlice from "./slices/searchSlice";

const store = configureStore({
  reducer: { search: searchSlice.reducer },
});

export default store;
