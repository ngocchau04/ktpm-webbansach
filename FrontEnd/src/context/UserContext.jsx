import React, { createContext, useState, useContext, useEffect } from 'react';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (user) => {
    setUser(user);
    if (user !== null && user !== undefined && user !== "undefined") {
      localStorage.setItem('user', JSON.stringify(user));
    } 
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser !== null && storedUser !== undefined && storedUser !== "undefined") {
      setUser(JSON.stringify(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
