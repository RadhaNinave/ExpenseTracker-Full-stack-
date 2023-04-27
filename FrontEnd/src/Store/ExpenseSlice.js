import React from 'react';


import { createSlice } from '@reduxjs/toolkit';

const InitialState={
    Expenses:[],
    totalAmount:5,
}

const ExpenseSlice = createSlice({
    name:'ExpenseSlice',
    initialState:InitialState,
    reducers:{
   
    }
});


export default ExpenseSlice.reducer;

export const ExpenseSliceActions =ExpenseSlice.actions;