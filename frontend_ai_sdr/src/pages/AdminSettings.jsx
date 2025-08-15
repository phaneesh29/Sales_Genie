import React, { useEffect, useState } from 'react';
import SideNavDash from '../components/SideNavDash';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { Input, Button, Typography, Divider } from 'antd';

const { Title, Text } = Typography;

const AdminSettings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [updatedAdmin, setUpdatedAdmin] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setServerError("");
      const response = await axiosInstance('/admin/profile');
      setProfile(response.data.admin);
      setUpdatedAdmin({
        name: response.data.admin.name || "",
        password: ""
      });
    } catch (error) {
      setServerError(error?.response?.data?.message || "An error occurred");
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  }

  const updateProfile = async () => {
    try {
      setLoading(true);
      setBtnLoading(true);
      setServerError("");
      const response = await axiosInstance.put(`/admin/update/${profile._id}`, updatedAdmin);
      navigate('/admin/dashboard');
    } catch (error) {
      setServerError(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
      setBtnLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="flex">
      <SideNavDash />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <Title level={3} className="mb-6">Admin Settings</Title>

        {serverError && <p className="text-red-500">{serverError}</p>}

        {/* Editable fields */}
        <div className="mb-6 space-y-4">
          <div>
            <Text strong>Name</Text>
            <Input
              value={updatedAdmin.name}
              onChange={(e) => setUpdatedAdmin({ ...updatedAdmin, name: e.target.value })}
              placeholder="Enter name"
            />
          </div>
          <div>
            <Text strong>New Password</Text>
            <Input.Password
              value={updatedAdmin.password}
              onChange={(e) => setUpdatedAdmin({ ...updatedAdmin, password: e.target.value })}
              placeholder="Enter new password"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow-sm mb-6">
          <p><Text strong>Email:</Text> {profile.email}</p>
          <p><Text strong>Role:</Text> {profile.role}</p>
          <p><Text strong>Active:</Text> {profile.is_active ? "Yes" : "No"}</p>
          <p><Text strong>Created At:</Text> {new Date(profile.createdAt).toLocaleString()}</p>
        </div>


        <Divider />

        {/* Update Button */}
        <Button
          type="primary"
          loading={btnLoading}
          disabled={btnLoading}
          onClick={updateProfile}
        >
          {btnLoading ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
