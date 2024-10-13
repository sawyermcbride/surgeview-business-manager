import React, {useEffect, useState} from "react";
import {Button, Typography, Form, Input, Row, Col} from "antd";
import { useAppContext } from "../contexts/AppContext";
import OrdersTable from "./OrdersTable";
import useFetchOrders from "../hooks/useFetchOrders";

const{ Title, Text } = Typography;


const ViewOrders: React.FC = function() {
  const {state, updateState} = useAppContext();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');

  const {loading, error, orders, fetchOrders} = useFetchOrders();


  const regex = /^\d{4}-\d{2}-\d{2}$/;
  
  const handleHomeClick = function() {
    
    updateState({actionSelected: 0});
  }
  
    useEffect(() => {
      if(error === 'Authorization_Error') {
        updateState({requiresLogin: true});
      }
    }, [error, updateState])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    const isValid = regex.test(value) || value === '';
    const errorMsg = isValid ? '' : 'Invalid date format. Please use YYYY-MM-DD.';

    if (name === 'startDate') {
      setStartError(errorMsg);
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndError(errorMsg);
      setEndDate(value);
    }

  }

  const onFinish = function(values: {startDate?: string; endDate?: string}) {

    console.log(values.startDate + '  ' + values.endDate);
    console.log(startDate + '  ' + endDate);
    
    if(values.startDate && values.endDate) {
      fetchOrders(startDate, endDate);
    } else {
      fetchOrders();
    }
  }

  useEffect(() => {
    updateState({orders});
  }, [orders, updateState])

  const viewOrderDetails = function(id: number) {
    updateState({actionSelected: 4, selectedOrder: id});
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

          <Title level={3}> View Orders </Title>
          <Text> View Recent Orders or Search By Date <strong>(Optional)</strong> </Text>

        </div>
        {loading && <Text>Loading...</Text>}
      </div>
      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center'}}>
        <Form layout="vertical" onFinish={onFinish}>
          <Row justify="center">
            <Col span={10}>
              <Form.Item
                label="Date (YYYY-MM-DD)"
                validateStatus={startError ? 'error' : ''}
                help={startError}
                name="startDate"
              >
                <Input 
                  name="startDate"
                  value={startDate}
                  onChange={handleChange}
                  placeholder="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                style={{marginLeft: '15px'}}
                label="Date (YYYY-MM-DD)"
                name="endDate"
                validateStatus={endError ? 'error' : ''}
                help={endError}
              >
                <Input 
                  name="endDate"
                  value={endDate}
                  onChange={handleChange}
                  placeholder="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
          <Row justify="center">
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Search Orders
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
      {orders.length > 0 && 
        <OrdersTable orders={orders} viewOrderDetails={viewOrderDetails}/>
      }

    </div>
  )
}

export default ViewOrders;