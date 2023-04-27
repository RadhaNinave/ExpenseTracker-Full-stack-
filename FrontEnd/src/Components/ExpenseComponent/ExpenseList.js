import React, { Fragment, useContext } from "react";

import ExpenseContext from "../../Store/ExpneseContext";
import './ExpenseList.css';


const ExpenseList = (props) => {
  const ctx = useContext(ExpenseContext);
 



  const onDeleteHandler = () => {
    ctx.RemoveExpense(props.id);
  };

  const onEditHandler = () => {
    props.onEdit();
  };

  return (
    <Fragment>
      <tr>
        <td>{props.Category}</td>
        <td>{props.Amount}</td>
        <td>{props.Discription}</td>
        <td>
          <button onClick={onEditHandler}>Edit</button>
          <button onClick={onDeleteHandler}>X</button>
        </td>
      </tr>
    </Fragment>
  );
};

export default ExpenseList;
