import React, {useEffect, useRef} from "react";
import { useAppContext } from "../contexts/AppContext";
import ButtonsView from "./ButtonsView";
import SearchCustomers from "./SearchCustomers";
import CustomerDetails from "./CustomerDetails";
import LoginBox from "./LoginBox";
import ViewOrders from "./ViewOrders";
import OrderDetails from "./OrderDetails";

const MainContent: React.FC =  function() {
  const {updateState, state} = useAppContext();


  const actionSelected = state.actionSelected;


  const loginClosed = function(loggedIn: boolean) {
    updateState({requiresLogin: false, isLoggedIn: loggedIn});
  }

  return(
    <div style={{position: 'relative', minHeight: '500px'}}>
      {state.requiresLogin && 
        <LoginBox visible={state.requiresLogin} onClose={loginClosed}/>
      }
        {(() => {
          switch (actionSelected) {
            case 0:
              return <ButtonsView />;
            case 1:
              return <SearchCustomers />;
            case 2:
              return <CustomerDetails/>;
            case 3:
              return <ViewOrders/>
            case 4: 
              return <OrderDetails/>
            default:
              return <ButtonsView />;
          }
        })()}
    </div>
  )
}

export default MainContent;