import { configureStore } from "@reduxjs/toolkit";

import ExpenseSlice from "./ExpenseSlice";

const Store = configureStore({
  reducer: {
    Expense:ExpenseSlice
  },
});

export default Store;
