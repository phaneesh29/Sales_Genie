import React, { useEffect, useState } from 'react';
import { Layout, Menu, Avatar, Button, Typography, Divider } from 'antd';
import {
    UserOutlined,
    HomeOutlined,
    SettingOutlined,
    LogoutOutlined,
    UserAddOutlined,
    UploadOutlined,
    SearchOutlined,
    PlusOutlined,
    ContactsOutlined,
    NodeIndexOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Loader from './Loader';

const { Sider } = Layout;
const { Text } = Typography;

const menuItems = [
    { key: '/admin/dashboard', label: 'Dashboard', icon: <HomeOutlined /> },
    { key: '/admin/settings', label: 'Settings', icon: <SettingOutlined /> },
    { key: '/admin/all', label: 'All Admins', icon: <UserOutlined /> },
    { key: '/admin/register', label: 'Add Admin', icon: <UserAddOutlined /> },
    { key: '/lead/upload', label: 'Upload Lead', icon: <UploadOutlined /> },
    { key: '/lead/add', label: 'Add Lead', icon: <PlusOutlined /> },
    { key: '/lead/search', label: 'Search Lead', icon: <SearchOutlined /> },
    { key: '/lead/meeting/all', label: 'All Meetings', icon: <ContactsOutlined /> },
    { key: '/edit/workflow', label: 'Edit Workflow', icon: <NodeIndexOutlined /> },
];

const SideNavDash = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/admin/profile');
            setProfile(response.data.admin);
        } catch (error) {
            navigate('/admin/login');
        } finally {
            setLoading(false);
        }
    };

    const logoutAdmin = async () => {
        try {
            await axiosInstance.get('/admin/logout');
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) return <Loader />;

    return (
        <>
            <Sider
                width={250}
                style={{
                    height: '100vh',
                    position: 'fixed', // fix the sidebar
                    left: 0,
                    top: 0,
                    background: '#fff',
                    padding: '20px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '2px 0px 8px rgba(0,0,0,0.1)',
                    overflow: 'auto', // scroll only inside sidebar if content exceeds
                }}
            >
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    onClick={({ key }) => navigate(key)}
                    style={{ border: 'none', flexGrow: 1 }}
                    items={menuItems.map(item => ({
                        key: item.key,
                        icon: item.icon,
                        label: item.label,
                    }))}
                />

                <div style={{ textAlign: 'center' }}>
                    <Divider style={{ margin: '20px 0' }} />
                    <Avatar size={50} icon={<UserOutlined />} />
                    <div style={{ marginTop: 10 }}>
                        <Text strong>{profile?.name || 'Admin Name'}</Text>
                        <br />
                        <Text type="secondary">{profile?.email || 'admin@example.com'}</Text>
                    </div>
                    <Button
                        type="primary"
                        danger
                        icon={<LogoutOutlined />}
                        style={{ marginTop: 15, width: '100%' }}
                        onClick={logoutAdmin}
                    >
                        Logout
                    </Button>
                </div>
            </Sider>

            {/* Main content wrapper */}
            <div style={{ marginLeft: 250, padding: '20px', minHeight: '100vh', background: '#f0f2f5' }}>
                {/* Dashboard content goes here */}
            </div>
        </>
    );
};

export default SideNavDash;
