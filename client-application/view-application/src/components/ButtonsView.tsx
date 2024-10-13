import React from "react";
import { useAppContext } from "../contexts/AppContext";
import {Button, Typography} from 'antd';
import { SettingOutlined, AreaChartOutlined, EditOutlined, SearchOutlined, InfoCircleOutlined,
   FileDoneOutlined } from '@ant-design/icons';
const {Title} = Typography;


const clicks: {[key: string]: number} = {
  'Search_Customers': 1,
  'View_Orders': 3,
  'Search_Employees': 4,
}
const ButtonsView: React.FC =  function() {
  const AppContext = useAppContext();

  const handleButtonClick = function(clickType: string) {
    const actionSelected = clicks[clickType];

    AppContext.updateState({actionSelected})
  }

  return(
    <div>
      <Title level={3} style={{textAlign: 'center'}}> Select an Action </Title>

      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', padding: '20px' }}>
        <Button 
          type="primary"
          className="dashboard-button" 
          size="large" 
          icon={<SearchOutlined />} 
          onClick={() => handleButtonClick('Search_Customers')}
        >
          Search Customers
        </Button>
        <Button 
          type="primary"
          className="dashboard-button" 
          size="large" 
          icon={<FileDoneOutlined />} 
          onClick={() => handleButtonClick('View_Orders')}
        >
          View Orders
        </Button>
        <Button 
          type="primary"
          className="dashboard-button" 
          size="large" 
          icon={<SearchOutlined />} 
          onClick={() => handleButtonClick('Search_Employees')}
        >
          Search Employees
        </Button>
        <Button 
          type="primary"
          className="dashboard-button" 
          size="large" 
          icon={<SettingOutlined />} 
          onClick={() => handleButtonClick('Edit_Web_Content')}
        >
          Edit Web Content
        </Button>

        <Button 
          type="primary"
          className="dashboard-button" 
          size="large" 
          icon={<AreaChartOutlined />} 
          onClick={() => handleButtonClick('Analytics')}
        >
          Analytics
        </Button>
        </div>
    </div>
  )
}

export default ButtonsView;