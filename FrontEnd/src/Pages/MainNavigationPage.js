import { NavLink } from "react-router-dom";

import AuthContext from "../Store/UserAuthContext";
import "./MainNavigationPage.css";
import { useContext } from "react";
import ExpenseContext from "../Store/ExpneseContext";

const MainNavigationPage = () => {
  const AuthCtx = useContext(AuthContext);
  const ctx = useContext(ExpenseContext);
  const Premium=ctx.isUserPremium;

  const onLogoutHandler = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    AuthCtx.isAuthenticatedUpdater();
  };

  return (
    <header className="header">
      <nav className="header-navigation">
        <ul className="header-navigation__list">
          <li>
            <NavLink className={"header-navigation__list__title-home"} to="/home">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              className={"header-navigation__list__title-ExpenseTracker"}
              to="/expense-tracker"
            >
              Expense Tracker
            </NavLink>
          </li>
          {Premium && <li>
            <NavLink
              className={"header-navigation__list__title-LeaderBoard"}
              to="/leaderboard"
            >
              LeaderBoard
            </NavLink>
          </li>}
        </ul>
        <input onClick={onLogoutHandler} type="button" value="LOGOUT" />
      </nav>
    </header>
  );
};

export default MainNavigationPage;
