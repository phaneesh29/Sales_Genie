import React, { useState } from 'react';
import SideNavDash from '../components/SideNavDash';
import axiosInstance from '../api/axiosInstance';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const AdminRegister = () => {
  const navigate = useNavigate();
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      setBtnLoading(true);
      setError('');
      const payload = { ...values, role: 'admin' };
      await axiosInstance.post('/admin/register', payload);
      form.resetFields();
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error?.response?.data?.message || 'An error occurred');
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <SideNavDash />
      <div className="flex-1 flex justify-center items-center bg-gray-50 p-8">
        <Card
          style={{
            width: '100%',
            maxWidth: 600,
            padding: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Title level={2} style={{ marginBottom: 20, textAlign: 'center' }}>
            Add Admin
          </Title>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 16 }}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input placeholder="Enter name" size="large" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Invalid email format' },
              ]}
            >
              <Input placeholder="Enter email" size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter password' }]}
            >
              <Input.Password placeholder="Enter password" size="large" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={btnLoading}
                size="large"
                block
              >
                Register Admin
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AdminRegister;
