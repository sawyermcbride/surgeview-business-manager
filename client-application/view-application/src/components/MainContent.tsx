import React, {useEffect} from "react";
import { useAppContext } from "../contexts/AppContext";
import ButtonsView from "./ButtonsView";
import SearchCustomers from "./SearchCustomers";

const MainContent: React.FC =  function() {
  const AppContext = useAppContext();

  const actionSelected = AppContext.state.actionSelected;

  useEffect(() => {
    
  }, [actionSelected])

  return(
    <div>
        {(() => {
          switch (actionSelected) {
            case 0:
              return <ButtonsView />;
            case 1:
              return <SearchCustomers />;
            case 2:
              return <h2>View 2</h2>
            default:
              return <ButtonsView />;
          }
        })()}
    </div>
  )
}

export default MainContent;