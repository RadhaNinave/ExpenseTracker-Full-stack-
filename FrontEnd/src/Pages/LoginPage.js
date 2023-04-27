import React, { Fragment, useContext } from "react";
import Login from "../Components/LoginComponent/Login";
import { Outlet } from "react-router-dom";

import AuthContext from "../Store/UserAuthContext";
import MainNavigationPage from "./MainNavigationPage";
import "./LoginPage.css";

const LoginPage = () => {
  const ctx = useContext(AuthContext);
  const login = ctx.isAuthenticated;
  let Cheacker;
  if (login || localStorage.getItem("email")) {
    Cheacker = true;
  } else {
    Cheacker = false;
  }

  return (
    <Fragment>
      {!Cheacker && <Login />}
      {Cheacker && <MainNavigationPage />}
      {Cheacker && 
        <div className="correction">
          <Outlet />
        </div>
      }
    </Fragment>
  );
};

export default LoginPage;
