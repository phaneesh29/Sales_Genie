import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import SideNavDash from '../components/SideNavDash';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const { Title } = Typography;

const AddLead = () => {
  const navigate = useNavigate();
  const [btnLoading, setBtnLoading] = useState(false);

  const onFinish = async (values) => {
    const strValues = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, v == null ? '' : String(v)])
    );

    const interests = (strValues.interestedIn || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const dedupedSorted = Array.from(new Set(interests))
      .sort((a, b) => a.localeCompare(b));

    const payload = { ...strValues, interestedIn: dedupedSorted };

    try {
      setBtnLoading(true);
      await axiosInstance.post('/leads/import/single', payload);
      message.success('Lead added successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      message.error(error?.response?.data?.message || 'An error occurred');
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="flex">
      <SideNavDash />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Card className="max-w-2xl mx-auto shadow-md">
          <Title level={3}>Add New Lead</Title>

          <Form layout="vertical" onFinish={onFinish} requiredMark>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Enter the name' }]}>
              <Input placeholder="John Doe" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Enter the email' },
                { type: 'email', message: 'Enter a valid email' }
              ]}
            >
              <Input placeholder="john@example.com" />
            </Form.Item>

            <Form.Item
              name="age"
              label="Age"
              rules={[
                { required: true, message: 'Enter the age' },
                {
                  type: 'number',
                  min: 0,
                  message: 'Age must be a positive number',
                  transform: (value) => Number(value),
                },
              ]}
            >
              <Input placeholder="30" />
            </Form.Item>

            <Form.Item name="phone" label="Phone">
              <Input placeholder="+1 234 567 890" />
            </Form.Item>

            <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Enter the role' }]}>
              <Input placeholder="Manager" />
            </Form.Item>

            <Form.Item name="company" label="Company" rules={[{ required: true, message: 'Enter the company' }]}>
              <Input placeholder="ABC Corp" />
            </Form.Item>

            <Form.Item name="experience" label="Experience (years)">
              <Input placeholder="5" />
            </Form.Item>

            <Form.Item name="industry" label="Industry">
              <Input placeholder="Technology" />
            </Form.Item>

            <Form.Item name="location" label="Location">
              <Input placeholder="New York, USA" />
            </Form.Item>

            <Form.Item name="linkedIn" label="LinkedIn URL">
              <Input placeholder="https://linkedin.com/in/username" />
            </Form.Item>

            <Form.Item name="leadSource" label="Lead Source">
              <Input placeholder="Conference, Referral, etc." />
            </Form.Item>

            <Form.Item
              name="interestedIn"
              label="Interested In (comma-separated)"
              tooltip="Example: html, js, css → stored as ['css','html','js']"
              rules={[{ required: true, message: 'Enter at least one interest (comma-separated)' }]}
            >
              <Input placeholder="html, js, css" />
            </Form.Item>

            <Form.Item
              name="preferredChannel"
              label="Preferred Channel"
              rules={[{ required: true, message: 'Enter preferred channel' }]}
            >
              <Input placeholder="Email / Phone / WhatsApp" />
            </Form.Item>

            <Form.Item name="category" label="Category">
              <Input placeholder="B2B or B2C" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={btnLoading}>
                {btnLoading ? 'Saving...' : 'Add Lead'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddLead;
