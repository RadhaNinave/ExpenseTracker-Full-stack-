import React from "react";

const ExpenseContext = React.createContext({
  ExpenseList: [],
  isAuthenticated: false,
  TotalAmount:0,
  AddExpense: () => {},
  RemoveExpense: () => {},
});

export default ExpenseContext;
