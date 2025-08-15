import React from 'react';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState("");

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setServerError("");
      await axiosInstance.post('/admin/login', values);
      navigate('/admin/dashboard');
    } catch (error) {
      setServerError(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Card */}
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
        <Title level={2} className="text-black text-center mb-6">Admin Login</Title>

        <div className='h-12'>
          {serverError && (
            <div className="bg-red-100 border border-red-500 text-red-600 rounded-lg px-2 py-2 text-center text-sm font-semibold mb-4">
              {serverError}
            </div>
          )}
        </div>

        <Form
          name="admin_login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="space-y-6"
        >
          {/* Email */}
          <Form.Item
            label={<span className="text-black font-medium">Email</span>}
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input
              placeholder="Enter your email"
              className="bg-gray-900 text-white border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label={<span className="text-black font-medium">Password</span>}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder="Enter your password"
              className="bg-gray-900 text-white border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            />
          </Form.Item>


          {/* Submit */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AdminLogin;
