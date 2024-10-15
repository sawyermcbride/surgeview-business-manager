// context/AuthContext.tsx
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { RoleSettings } from '../types/apiResponses';

interface AuthState {
  requiresLogin: boolean;
  permissions: RoleSettings | null;
}

type AuthAction =
  | { type: 'SET_REQUIRES_LOGIN'; payload: boolean }
  | { type: 'SET_PERMISSIONS'; payload: RoleSettings };

const initialState: AuthState = {
  requiresLogin: false,
  permissions: null,
};



const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
