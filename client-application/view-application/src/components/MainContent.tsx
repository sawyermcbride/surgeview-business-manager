import React, {useEffect} from "react";
import { useAppContext } from "../contexts/AppContext";
import ButtonsView from "./ButtonsView";
import SearchCustomers from "./SearchCustomers";
import CustomerDetails from "./CustomerDetails";
import LoadingComponent from "./tests/LoadingComponent";

const MainContent: React.FC =  function() {
  const AppContext = useAppContext();

  const actionSelected = AppContext.state.actionSelected;

  useEffect(() => {
    
  }, [])

  return(
    <div style={{position: 'relative', minHeight: '500px'}}>
        
        {(() => {
          switch (actionSelected) {
            case 0:
              return <ButtonsView />;
            case 1:
              return <SearchCustomers />;
            case 2:
              return <CustomerDetails/>;
            case 3:
              return <h3>Orders View</h3>
            default:
              return <ButtonsView />;
          }
        })()}
    </div>
  )
}

export default MainContent;