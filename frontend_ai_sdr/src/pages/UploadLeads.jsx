import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Upload, Button, message, Spin, Typography, Card, Space } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import SideNavDash from '../components/SideNavDash';

const { Title, Text } = Typography;

const UploadLeads = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    const beforeUpload = (file) => {
        const allowedTypes = ['text/csv', 'application/json'];
        if (!allowedTypes.includes(file.type)) {
            message.error('Only CSV or JSON files are allowed!');
            return Upload.LIST_IGNORE;
        }
        setFile(file);
        return false; // Prevent auto-upload
    };

    const fileUpload = async () => {
        if (!file) {
            message.error('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            await axiosInstance.post('/leads/import/file', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            message.success('File uploaded successfully!');
            navigate('/admin/dashboard');
        } catch (error) {
            message.error(error?.response?.data?.message || 'File Upload Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <SideNavDash />
            <div className="flex-1 flex items-center justify-center p-6">
                <Card
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        borderRadius: 12,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                >
                    <Title level={3} style={{ textAlign: 'center', marginBottom: 8 }}>
                        Upload Leads
                    </Title>
                    <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 20 }}>
                        Upload your leads file in CSV or JSON format
                    </Text>

                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Upload.Dragger
                            beforeUpload={beforeUpload}
                            maxCount={1}
                            accept=".csv,.json"
                            style={{ borderRadius: 8 }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined style={{ color: '#1890ff' }} />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area</p>
                            <p className="ant-upload-hint">
                                Only CSV or JSON files are supported.
                            </p>
                        </Upload.Dragger>

                        <Button
                            type="primary"
                            size="large"
                            block
                            onClick={fileUpload}
                            disabled={!file || loading}
                        >
                            {loading ? <Spin size="small" /> : 'Upload File'}
                        </Button>
                    </Space>
                </Card>
            </div>
        </div>
    );
};

export default UploadLeads;
