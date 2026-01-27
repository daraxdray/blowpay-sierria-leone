import React, {createContext, useContext} from 'react';

const UserContext = createContext();

export const UserProvider = ({userData, children}) => {
  const country = userData?.user?.country || '';
  return (
    <UserContext.Provider value={{userData, country}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
