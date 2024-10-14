import React from "react";
import {Button, Typography, Row, Col, Card} from "antd";

import OrdersTable from "./OrdersTable";
import useFetchCustomerDetails from "../hooks/useFetchCustomerDetails";

import { useAppContext } from "../contexts/AppContext";

const {Title, Text} = Typography;

const CustomerDetails:React.FC = function() {
  const {state, updateState} = useAppContext();
  const {details, loading, error} = useFetchCustomerDetails(state.selectedCustomer);

  const handleBackClick = function() {
    updateState({actionSelected: 1});
  }

  const viewOrderDetails = function(id: number) {
    updateState({actionSelected: 4, selectedOrder: id, orders: details?.orders});
  }


  return (
    <div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        <div style={{ position: 'absolute', flex: '0 1 auto' }}>
          <Button onClick={handleBackClick} size="small" type="primary">
            Return to Search
          </Button>
        </div>
          <div style={{ flex: '1', textAlign: 'center'}}>
            <Title hidden={!state.permissions?.editCustomers} level={3}> Customer Details </Title>
          </div>
      </div>
        <div style={{padding: '24px'}}>
          <Row gutter={16} style={{display: 'flex', justifyContent: 'center'}}>
            <Col span={12}>
              {details && 
                <Card title="Customer Information" bordered style={{position: 'relative'}}>
                  <Button style={{position: 'absolute', right: 15, top: 15}} size="small">Edit</Button>
                  <Text strong>ID:</Text> <Text>{details.customer.id}</Text><br />
                  <Text strong>Name:</Text> <Text>{details.customer.name}</Text><br />
                  <Text strong>Email:</Text> <Text>{details.customer.email}</Text><br />
                  <Text strong>Created At:</Text> <Text>{new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  }).format(new Date(details.customer.createdAt))}</Text>
                </Card>             
              }
            </Col>
          </Row>
        </div>
        <div style={{ flex: '1', textAlign: 'center' }}>
          <div style={{marginTop: '20px', marginLeft: '15px', marginRight: '15px'}}>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {(details) && (
              <OrdersTable orders={details.orders} viewOrderDetails={viewOrderDetails}/>
            )}
          </div>
        </div>
    </div>
  )
}

export default CustomerDetails;