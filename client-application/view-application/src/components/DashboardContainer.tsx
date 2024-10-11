
import React from "react";
import Dashboard from "./Dashboard";
import { AppContextProvider } from "../contexts/AppContext";

const DashboardContainer: React.FC = function() {
  return (
    <AppContextProvider>
      <Dashboard/>
    </AppContextProvider>    
  )
}

export default DashboardContainer;