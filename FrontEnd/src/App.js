import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "./Pages/LoginPage";
import ExpenseForm from "./Components/ExpenseComponent/ExpenseForm";
import HomePage from "./Pages/HomePage";
import LeaderBoardPage from "./Pages/LeaderBoardPage";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "expense-tracker",
        element: <ExpenseForm />,
      },
      {
        path: "/leaderboard",
        element: <LeaderBoardPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={Routes}></RouterProvider>;
}

export default App;
