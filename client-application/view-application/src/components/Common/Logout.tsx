import React from "react";
import { Button, Modal, Typography } from "antd";
import axios from "axios";
import { useAppContext } from "../../contexts/AppContext";

const {Text} = Typography;


const Logout: React.FC = function() {
  const {updateState} = useAppContext();
  const [modal, contextHolder] = Modal.useModal();

  const handleLogout = async function() {
    try {
      const confirmed = await modal.confirm({content: (<Text>Are you sure you want to logout?</Text>)});
      console.log(confirmed);
      if(!confirmed)
        return;

      const response = await axios.post(
        'http://localhost:3000/business-manager/logout',
        {}, 
        {
          withCredentials: true 
        }
      );

      

      updateState({isLoggedIn: false, requiresLogin: true});
      console.log(response);
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <>
    <Button onClick={handleLogout} style={{position: 'absolute', right: 50}} type="default">
      Logout
    </Button>
    {contextHolder}
    </>
  )
}

export default Logout;