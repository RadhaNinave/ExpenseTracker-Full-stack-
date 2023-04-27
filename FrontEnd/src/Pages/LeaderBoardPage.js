import { Fragment, useContext } from "react";
import LeaderBoardTableList from "../Components/LeaderBoardPageList/LeaderBordTableList";
import ExpenseContext from "../Store/ExpneseContext";
import "./LeaderBoardPage.css";

const LeaderBoardPage = () => {
  const ctx = useContext(ExpenseContext);
  const Premium = ctx.isUserPremium;
  const UpdatedLeaderBoard = ctx.isLeaderBoard.map((data, index) => {
    index++;
    return (
      <LeaderBoardTableList
        key={index}
        id={index}
        Rank={index}
        Name={data.name}
        Total={data.total}
      />
    );
  });

  return (
    <Fragment>
      <div className="main-leaderBoard">
        {Premium && (
          <div >
            <h1>LEADERBOARD</h1>
            <table>
              <thead>
                <tr>
                  <th>RANKING</th>
                  <th>NAME</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              {UpdatedLeaderBoard}
            </table>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default LeaderBoardPage;
