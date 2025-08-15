import React, { useEffect, useState } from 'react';
import SideNavDash from '../components/SideNavDash';
import axiosInstance from '../api/axiosInstance';
import { Table, Button, Space, Tag, Typography, Alert, Popconfirm, Spin } from 'antd';

const { Title } = Typography;

const AllAdmins = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);
  const [admins, setAdmins] = useState([]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/get/all');
      setAdmins(response.data.admins);
    } catch (error) {
      setError(error?.response?.data?.message || 'An error occurred while fetching admins');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAdmin = async (adminId, curr_active) => {
    try {
      setBtnLoading(true);
      await axiosInstance.put(`/admin/update/${adminId}`, { is_active: !curr_active });
      fetchAdmins();
    } catch (error) {
      setError(error?.response?.data?.message || 'An error occurred while updating admin');
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      setBtnLoading(true);
      await axiosInstance.delete(`/admin/delete/${adminId}`);
      fetchAdmins();
    } catch (error) {
      setError(error?.response?.data?.message || 'An error occurred while deleting admin');
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={role === 'superadmin' ? 'red' : 'blue'}>{role}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active) =>
        is_active ? <Tag color="green">Active</Tag> : <Tag color="volcano">Inactive</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type={record.is_active ? 'default' : 'primary'}
            loading={btnLoading}
            onClick={() => handleUpdateAdmin(record._id, record.is_active)}
          >
            {record.is_active ? 'Deactivate' : 'Activate'}
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this admin?"
            onConfirm={() => handleDeleteAdmin(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger loading={btnLoading}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex">
      <SideNavDash />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <Title level={2} style={{ marginBottom: 20 }}>
          All Admins
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

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={admins}
            pagination={{ pageSize: 10 }}
          />
        )}
      </div>
    </div>
  );
};

export default AllAdmins;
