import React, { useEffect, useMemo, useState } from "react";

import {Form, Input, Button, Typography} from "antd";
import { useAppContext } from "../contexts/AppContext";
import useFetchUpdateOrders from "../hooks/useFetchUpdateOrders";

const {Title, Text} = Typography;

interface EditOrderForm {
  youtubeUrl: string;
  channelName: string;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const OrderDetails: React.FC = function() {
  const {state, updateState} = useAppContext();
  const {loading, error, updateOrder, response} = useFetchUpdateOrders();
  
  const [form] = Form.useForm();

  const handleHomeClick = function() {
    updateState({actionSelected: 0});
  }

  const currentOrder = useMemo(() => {
    if(state.actionSelected === 4) {  

      const order = state.orders.find((obj) => {
        return obj.id === state.selectedOrder;
      });

      return (
        order || {
          youtubeUrl: "",
          channelName: "",
          customerEmail: "",
          id: 0,
          createdAt: ""
        }
      )
    }

  },[state.actionSelected, state.orders, state.selectedOrder]);
    
  useEffect(() => {
    if(error && error === 'Authorization_Error') {
      updateState({requiresLogin: true});
    }
  }, [error])

  useEffect(() => {

    if(currentOrder) {
      form.setFieldsValue(currentOrder);
    }

  }, [currentOrder, form])

  const onFinish = function(values: EditOrderForm) {
    const updateYoutubeUrl = (values.youtubeUrl === currentOrder?.youtubeUrl ? '': values.youtubeUrl);
    const updateChannelName = (values.channelName === currentOrder?.channelName ? '': values.channelName);
    
    if(currentOrder) {
      updateOrder(currentOrder?.id, updateYoutubeUrl, updateChannelName);
    }

    form.setFieldsValue({youtubeUrl: (updateYoutubeUrl || currentOrder?.youtubeUrl),
      channelName: (updateChannelName || currentOrder?.youtubeUrl)
    });
    
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

          <Title level={3}> View Order Details </Title>
          <Text> Orders will not be edited unless you click submit.</Text>
          <div>
            <Text> {response && response.message}</Text>
          </div>
          <div>
            <Text> {loading && "Loading..."}</Text>
          </div>
        </div>
      </div>
      <div style={{width: '100%', marginTop: '25px'}}>
        <Form
          form={form}
          onFinish={onFinish}
          {...formItemLayout}      
          layout='horizontal'
        >
          <Form.Item label="id" name="id">
            <Input disabled/>
          </Form.Item>
          <Form.Item label="YouTube URL" name="youtubeUrl">
            <Input/>
          </Form.Item>
          <Form.Item label="Channel Name" name="channelName">
            <Input/>
          </Form.Item>
          <Form.Item label="Customer Email" name="customerEmail">
            <Input disabled />
          </Form.Item>
          <Form.Item  label="Created At" name="createdAt">
            <Input disabled />
          </Form.Item>
          <Form.Item>
            <Button style={{position: 'absolute', top: 0, right: 0}} type="default" htmlType="submit">
              Update Order
            </Button>
          </Form.Item>
        </Form>
        

      </div>
    </div>
  )
}

export default OrderDetails;