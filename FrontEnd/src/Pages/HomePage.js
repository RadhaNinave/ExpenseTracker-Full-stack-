import React, { Fragment, useContext, useEffect, useState } from "react";

import "./HomePage.css";

import ImageProfile from "../Images/UserProfile.png";
import ImageCrown  from '../Images/crown.png';

import AuthContext from "../Store/UserAuthContext";
import axios from "axios";
import ExpenseContext from "../Store/ExpneseContext";

const HomePage = () => {
  const AuthCtx = useContext(AuthContext);
  const ctx =useContext(ExpenseContext);
  const Premium = ctx.isUserPremium;

  let UpdatedName = "User Name";
  if (AuthCtx.isUsername === " ") {
    if (localStorage.getItem("name")) {
      UpdatedName = localStorage.getItem("name");
    }
  } else {
    UpdatedName = AuthCtx.isUsername;
  }

  const onPasswordForgotHandler = async () => {
    const obj = {
      email: localStorage.getItem("email"),
    };
    try {
      const data = await axios.post("http://localhost:5000/auth/forgot", obj);
      alert("Cheack Your Email");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="main-header">
      <h1 className="main-header__title">WELCOME TO EXPENSE TRACKER</h1>
      {Premium && <img src={ImageCrown} className="main-header__title_crown" />}
      <div className="main-header__profile">
        <h1>PROFILE</h1>
        <img src={ImageProfile}></img>
        <h2>{UpdatedName.toLocaleUpperCase()}</h2>
        <button onClick={onPasswordForgotHandler}>CHANGE PASSWORD</button>
      </div>
    </div>
  );
};

export default HomePage;
