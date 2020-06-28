import React from 'react';

const AuthenticationContext = React.createContext();

export const AuthenticationProvider = AuthenticationContext.Provider;
export const AuthenticationConsumer = AuthenticationContext.Consumer;

export default AuthenticationContext;
