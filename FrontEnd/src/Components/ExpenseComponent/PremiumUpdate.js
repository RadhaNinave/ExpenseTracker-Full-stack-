import React, { useContext } from "react";
import ExpenseContext from "../../Store/ExpneseContext";



import './PremiumUpdate.css';


const PremiumUpdater = () => {
  const ctx = useContext(ExpenseContext);


  const ongetPremiumHandler = (e) => {
    e.preventDefault();
    ctx.isPremiumUpdater();

  };

  return (
    <form onSubmit={ongetPremiumHandler} className="main-offer">
      <h3 className="main-offer-title">Here Some Excitment For You</h3>
      <h3>Premium Pack</h3>
      <h4>Premium Plan Features</h4>
      <ul>
        <li>ACCESS TO LEADERBOARD</li>
        <li>ACCESS TO EXPENSE DOWNLOAD</li>
        <li>ATTRACTIVE APP PERFORMANCE</li>
      </ul>
      <input type="submit" value="UPGRADE NOW" />
    </form>
  );
};

export default PremiumUpdater;