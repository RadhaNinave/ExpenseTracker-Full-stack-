import React, { Fragment } from "react";
import "./LeaderBordTableList.css";

const LeaderBoardTableList = (props) => {
  return (
    <Fragment>
      <tbody>
        <tr
          className={props.Rank === 1 ? `main-table_list2` : `main-table_list`}
        >
          <td>{props.Rank}</td>
          <td>{props.Name}</td>
          <td>{props.Total}</td>
        </tr>
      </tbody>
    </Fragment>
  );
};

export default LeaderBoardTableList;
