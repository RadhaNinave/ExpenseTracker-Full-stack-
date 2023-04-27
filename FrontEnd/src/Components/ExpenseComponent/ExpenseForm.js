import React, { Fragment, useContext, useRef, useState } from "react";

import ExpenseList from "./ExpenseList";
import ExpenseContext from "../../Store/ExpneseContext";
import PremiumUpdater from "./PremiumUpdate";
import "./ExpenseForm.css";
import axios from "axios";
const ExpenseForm = () => {
  const [isDownLoadExpense, SetIsDownloadExpense] = useState();
  const [LoadingData, SetisLoadingData] = useState(false);

  let showmore = false;

  const ctx = useContext(ExpenseContext);

  const ButtonState = ctx.ExpenseButton;
  console.log(ButtonState);
  const PrevButton = ButtonState.hasPreviousPage;
  const NextButton = ButtonState.hasNextPage;
  let currentpage = 0;
  if (NextButton == 1 && ButtonState.currentPage === 1) {
    showmore = true;
  }

  currentpage = ButtonState.currentPage;

  const Premium = ctx.isUserPremium;

  // button show

  let Pageno;

  const onPageNextSwitcher = async () => {
    const ButtonState = await ctx.ExpenseButton;
    const NextButton = await ButtonState.hasNextPage;
    const NextPage = await ButtonState.nextPage;
    if (NextButton) {
      Pageno = NextPage;
    } else {
      Pageno = 2;
    }
    await ctx.PageSwitcher(Pageno);
    Pageno = await ctx.ExpenseButton.currentPage; // update Pageno value
  };

  const onPagePrevSwitcher = async () => {
    const ButtonState = await ctx.ExpenseButton;
    const PrevButton = await ButtonState.hasPreviousPage;
    const previousPage = await ButtonState.previousPage;

    if (PrevButton) {
      Pageno = previousPage;
    } else {
      Pageno = 0;
    }
    await ctx.PageSwitcher(Pageno);
    Pageno = await ctx.ExpenseButton.currentPage; // update Pageno value
  };

  const OnEditHandler = (data) => {
    EnteredAmount.current.value = data.amount;
    EnteredDiscription.current.value = data.discription;
    ctx.RemoveExpense(data.id);
  };

  const onGoDownload = () => {
    SetIsDownloadExpense(!isDownLoadExpense);
  };

  let UpdatedExpense = ctx.ExpenseList.map((data) => {
    return (
      <ExpenseList
        id={data.id}
        key={data.id}
        Category={data.category}
        Amount={data.amount}
        Discription={data.discription}
        onEdit={OnEditHandler.bind(this, data)}
      />
    );
  });

  const SelectedCategory = useRef();
  const EnteredAmount = useRef();
  const EnteredDiscription = useRef();

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const category = SelectedCategory.current.value;
    const amount = EnteredAmount.current.value;
    const discription = EnteredDiscription.current.value;

    const ExpenseDetail = {
      category,
      amount,
      discription,
    };
    ctx.AddExpense(ExpenseDetail);
    EnteredAmount.current.value = " ";
    EnteredDiscription.current.value = " ";
  };
  const onDownloadExpenseHandler = async () => {
    const token = localStorage.getItem("token");
    await axios
      .get(`http://localhost:5000/purchase/downloadexpense`, {
        headers: { auth: localStorage.getItem("token") },
      })
      .then((res) => {
        SetIsDownloadExpense(res.data.fileURL);
        SetisLoadingData(!LoadingData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDynamicPageExpense = () => {
    const value = 10;

    ctx.PageSwitcher(currentpage, value);
  };

  return (
    <Fragment>
      <div className="main-tracker">
        <h1 className="main-tracker__title">Expense Tracker</h1>
        <form className="main-tracker_form" onSubmit={onSubmitHandler}>
          <label>Select Your Category: </label>
          <select ref={SelectedCategory} required>
            <option value="Shopping"> Shopping </option>
            <option value="Shopping"> Petrol </option>
            <option value="Shopping"> College</option>
            <option value="Shopping"> Food </option>
            <option value="Shopping"> LightBill </option>
            <option value="Shopping"> Others </option>
          </select>
          <label>Enter Your Amount: </label>
          <input ref={EnteredAmount} type="text" placeholder="200" required />
          <label>Explain More About Product:</label>
          <input
            ref={EnteredDiscription}
            type="text"
            placeholder="description"
            required
          />
          <input type="submit" value="ADD EXPENSE" />
        </form>
        {!isDownLoadExpense && Premium && (
          <div>
            <button
              className="Expense_Download"
              onClick={onDownloadExpenseHandler}
            >
              Download Expense
            </button>
          </div>
        )}
        {isDownLoadExpense && (
          <div>
            <a
              className="DownLoad_Link"
              href={isDownLoadExpense}
              onClick={onGoDownload}
            >
              Click Here To Download Expense
            </a>
          </div>
        )}
        {Premium && <h5>YOU ARE PREMIUM</h5>}
        {!Premium && <PremiumUpdater />}
        <div className={Premium ? `main-tracker_list` : `main-tracker_list1`}>
          <h2>List Of Expenses</h2>
          <table>
            <tbody>
              <tr className="main-tracker_list_heading">
                <th>Category</th>
                <th>Amount</th>
                <th>Product</th>
                <th>Actions</th>
              </tr>
              {UpdatedExpense}
            </tbody>
          </table>
          <div className="prev_button">
            {PrevButton && <button onClick={onPagePrevSwitcher}>PREV</button>}
            {<span>{currentpage}</span>}
            {showmore && (
              <button onClick={onDynamicPageExpense}>SHOW MORE</button>
            )}
            {NextButton && <button onClick={onPageNextSwitcher}>NEXT</button>}
          </div>
          <h2>
            Total Amount : <span>{ctx.TotalAmount}</span>
          </h2>
        </div>
      </div>
    </Fragment>
  );
};

export default ExpenseForm;
