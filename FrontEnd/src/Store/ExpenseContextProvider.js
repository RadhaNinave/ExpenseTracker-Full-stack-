import React, { useEffect, useState } from "react";
import axios from "axios";
import useRazorpay from "react-razorpay";

import ExpenseContext from "./ExpneseContext";

const ExpenseContextProvider = (props) => {
  const Razorpay = useRazorpay();

  const [ExpenseList, SetExpenseList] = useState([]);
  const [TotalAmount, SetTotalAmount] = useState(0);
  const [Premium, setPremium] = useState(false);
  const [LeaderBoard, setLeaderBoard] = useState([]);
  const [isButton, setIsButton] = useState([]);
  const [currentPage, SetCurrentPage] = useState(1);
  const [Expenseno, setExpenseno] = useState();

  const TotalAmountCalculator = (data) => {
    let calculatedAmount = 0;
    data.map((data) => {
      return (calculatedAmount += +data.amount);
    });
    SetTotalAmount(calculatedAmount);
  };

  // const UpdateExpenseHandler = (expense) =>{
  // axios .patch('http://localhost:5000/user/users',{
  //   headers: { auth: localStorage.getItem("token") },
  // },expense)
  // };

  const onPageSwitchHandler = async (page, Pageno) => {
    await axios
      .get(
        `http://localhost:5000/user/users?page=${currentPage}&expenseno=${Pageno}`,
        {
          headers: { auth: localStorage.getItem("token") },
        }
      )
      .then(() => {
        SetCurrentPage(page);
        setExpenseno(Pageno);
        GetUpdatedExpense();
      });
  };

  const GetUpdatedExpense = async () => {
    // for expense update
    await axios
      .get(
        `http://localhost:5000/user/users?page=${currentPage}&expenseno=${Expenseno}`,
        {
          headers: { auth: localStorage.getItem("token") },
        }
      )
      .then((res) => {
        setIsButton(res.data);
        SetExpenseList(res.data.allExpenses);
        TotalAmountCalculator(res.data.allExpenses);
      })
      .catch((err) => {});

    // for cheacking user is premium
    await axios
      .get(`http://localhost:5000/purchase/recive`, {
        headers: { auth: localStorage.getItem("token") },
      })
      .then((res) => {
        if (res.data.status === true) {
          setPremium(true);
        }
      })
      .catch((err) => {
        setPremium(false);
      });

    // for leader board update
    await axios
      .get(`http://localhost:5000/purchase/leaderboard/`, {
        headers: { auth: localStorage.getItem("token") },
      })
      .then((res) => {
        setLeaderBoard(res.data);
      })
      .catch((err) => {
        console.log(err);
        setPremium(false);
      });
  };

  const AddExpenseHandler = async (Expense) => {
    await axios
      .post(`http://localhost:5000/user/users/`, Expense, {
        headers: { auth: localStorage.getItem("token") },
      })
      .then((res) => {
        GetUpdatedExpense();
      })
      .catch((err) => console.log(err));
  };

  const RemoveExpenseHandler = async (id) => {
    await axios
      .delete(`http://localhost:5000/user/users/${id}`, {
        headers: { auth: localStorage.getItem("token") },
      })
      .then((res) => {
        GetUpdatedExpense();
      })
      .catch((err) => console.log(err));
  };

  const isPremiumUpdater = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:5000/purchase/premiummembership`,
      {
        headers: { auth: localStorage.getItem("token") },
      }
    );
    var options = {
      key: response.data.key_id, // Enter the Key ID generated from the Dashboard
      order_id: response.data.order.id, // For one time payment
      // This handler function will handle the success payment
      handler: async function (response) {
        const res = await axios
          .post(
            "http://localhost:5000/purchase/updatetransactionstatus",
            {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id,
            },
            { headers: { auth: token } }
          )
          .then((res) => {
            GetUpdatedExpense();
            // console.log(err);
          });
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();

    rzp1.on("payment.failed", function (response) {
      console.log(response);
      alert("Something went wrong");
    });
  };

  useEffect(() => {
    GetUpdatedExpense();
  }, []);

  const InitialContext = {
    ExpenseList: ExpenseList,
    ExpenseButton: isButton,
    PageSwitcher: onPageSwitchHandler,
    TotalAmount: TotalAmount,
    isUserPremium: Premium,
    isPremiumUpdater: isPremiumUpdater,
    isLeaderBoard: LeaderBoard,
    AddExpense: AddExpenseHandler,
    RemoveExpense: RemoveExpenseHandler,
  };

  return (
    <ExpenseContext.Provider value={InitialContext}>
      {props.children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContextProvider;
