import React from "react";
import {Button, Typography, Input} from "antd";
import { useAppContext } from "../contexts/AppContext";

const {Search}  = Input;
const {Text, Title} = Typography;

const SearchCustomers: React.FC = function() {
  const {updateState} = useAppContext();

  const handleHomeClick = function() {
    updateState({actionSelected: 0})
  }
  const handleSearch = function() {

  }
  return (
    <div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        <div style={{ position: 'absolute', flex: '0 1 auto' }}>
          <Button onClick={handleHomeClick} size="medium" type="primary">
            Return Home
          </Button>
        </div>
        <div style={{ flex: '1', textAlign: 'center' }}>

          <Title level={3}> Search Customers </Title>
          <Text> Search by Email or Name </Text>

        </div>
      </div>
      <div style={{ marginTop: 16, width: '100%', textAlign: 'center' }}>
        <Search
          placeholder="Search for customers"
          onSearch={handleSearch}
          style={{maxWidth: 400}}
        />
      </div>
    </div>
  )
}

export default SearchCustomers;