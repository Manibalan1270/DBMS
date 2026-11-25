import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  // Kept in sessionStorage so a page refresh doesn't log you out.
  const [user, setUserState] = useState(() => JSON.parse(sessionStorage.getItem('user') || 'null'));

  const login = (user, token) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', token);
    setUserState(user);
  };
  const logout = () => {
    sessionStorage.clear();
    setUserState(null);
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};
