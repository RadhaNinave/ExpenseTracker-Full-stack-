import { useRef } from "react";

import "./ForgotPassword.css";

const ForgotPassword = (props) => {
  const UserEnteredEmailRef = useRef();

  const GoLoginPage = () => {
    props.onLoginPageBack();
  };

  const onPasswordForgotHandler = (e) => {
    e.preventDefault();
    const email = UserEnteredEmailRef.current.value;
    props.onPasswordForgot(email);
  };

  return (
    <div className="main-form">
      <h2 className="main-form__title">FORGOT PASSWORD</h2>
      <form onSubmit={onPasswordForgotHandler} className="main-form__data">
        <label className="main-form__data_label">Enter Email: </label>
        <input ref={UserEnteredEmailRef} type="email" required />
        <input type="submit" value="Get Password Reset Link" className="main-form__data_button"/>
      </form>
      <button onClick={GoLoginPage}>Go Back To Login</button>
    </div>
  );
};

export default ForgotPassword;
