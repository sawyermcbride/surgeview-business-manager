import React, {useState, useEffect} from "react";
import {Button, Typography, Input} from "antd";
import { useAppContext } from "../contexts/AppContext";
import CustomersTable from "./CustomersTable";

import axios from "axios";

import useFetchSearchCustomers from "../hooks/useFetchSearchCustomers";
import LoginBox from "./LoginBox";

const {Search}  = Input;
const {Text, Title} = Typography;

const SearchCustomers: React.FC = function() {
  const {updateState, state} = useAppContext();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(true);

  const {customers, loading, error} = useFetchSearchCustomers(searchTerm);

  useEffect(() => {
    setShowError(true);    
    console.log('SearchCustomers error value, ', error);
    if(error && error === 'Authorization_Error') {
      setShowLogin(true);
      setShowError(false);
      console.log('Authorization Error');
      updateState({requiresLogin: true});
    }

  }, [error])

  useEffect( () => {
    
    updateState({loading: loading});
    console.log('New loadings state ', loading);

  }, [loading])

  useEffect(() => {
    setShowError(state.requiresLogin);
    setSearchTerm("");
  }, [state.requiresLogin])
  
  const viewCustomerDetails = function(id: number) {
    
    updateState({actionSelected: 2, selectedCustomer: id});
  }

  const handleHomeClick = function() {
    updateState({actionSelected: 0});
  }
  const handleSearch = function(value: string) {
    setSearchTerm(value);
  }
  return (
    <div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        <div style={{ position: 'absolute', flex: '0 1 auto' }}>
          <Button onClick={handleHomeClick} size="small" type="primary">
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
        <div style={{marginTop: '20px', marginLeft: '15px', marginRight: '15px'}}>
          { (error && showError) && <p>Error: {error}</p>}
          {loading && <p>Loading...</p>}
          {(customers.length > 0) && (
            <CustomersTable customers={customers} viewCustomerDetails={viewCustomerDetails} />
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchCustomers;