// App Context

import React, {createContext, useState, useContext} from "react";
import { OrdersObject } from "../types/apiResponses";

interface AppState {
  page: number;
  actionSelected: number;
  selectedCustomer: number | null;
  selectedOrder: number | null;
  orders: OrdersObject[];
  loading: boolean;
  requiresLogin: boolean;
  lastActionSelected: number;
}

interface AppContextProps {
  state: AppState;
  updateState: (newData: Partial<AppState>) => void;
}

interface AppContextComponent {
  children: React.ReactNode;
}

const initialState: AppState = {
  page: 1,
  actionSelected: 0, //means none
  orders: [],
  selectedCustomer: null,
  selectedOrder: null,
  loading: false,
  lastActionSelected: 0,
  requiresLogin: false
};

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppContextProvider: React.FC<AppContextComponent> = ({ children }) => {
  const [state, setAppState] = useState<AppState>(initialState);

  const updateState = (newData: Partial<AppState>) => {
    setAppState(prev => ({
      ...prev,
      ...newData,
    }));
  };


  return (
    <AppContext.Provider value={{ state, updateState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};