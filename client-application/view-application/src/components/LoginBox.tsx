import React, {useState} from 'react';
import {Modal, Form, Input, Button, Typography} from "antd";
import axios from 'axios';

const {Text} = Typography;

interface LoginBoxProps {
  visible: boolean;
  onClose: () => void;
}
const LoginBox: React.FC<LoginBoxProps> = function({visible, onClose}) {
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async function(values: {username: string; password: string}) {
    setLoading(true);

    try {
      await axios.post('http://localhost:3000/employee/login', {
        username: values.username,
        password: values.password
      }, {
        withCredentials: true,
      });

      onClose();

    } catch(err) {
      setLoading(false);
      console.error(err);
    }

  }
  return (
    <Modal
      title="Login"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Text>Login with your details from SurgeView Marketing to continue</Text>
      <Form onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default LoginBox;