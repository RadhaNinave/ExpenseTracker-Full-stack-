import React, { useState } from "react";

const AuthContext = React.createContext({
  isAuthenticated: false,
  isUsername: " ",
  isAuthenticatedUpdater: () => {},
});

export default AuthContext;

export const AuthContextProvider = (props) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isUserName, setUserName] = useState(" ");

  const AuthenticationUpdater = (name) => {
    setAuthenticated(!isAuthenticated);
    setUserName(name);
  };

  const AuthContextInitial = {
    isUserAuthenticated: isAuthenticated,
    isUsername: isUserName,
    isAuthenticatedUpdater: AuthenticationUpdater,
  };

  return (
    <AuthContext.Provider value={AuthContextInitial}>
      {props.children}
    </AuthContext.Provider>
  );
};
