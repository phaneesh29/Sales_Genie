import React, { useEffect, useState } from 'react';
import { Table, Tag, Card, Typography, Space, message, Input, Modal, Button, Statistic, Row, Col, Drawer } from 'antd';
import { MailOutlined, SearchOutlined, EyeOutlined, SendOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import SideNavDash from '../components/SideNavDash';
import axiosInstance from '../api/axiosInstance';
import Loader from '../components/Loader';

const { Title, Text } = Typography;

const AllEmails = () => {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState(null);

    const showEmailDrawer = (email) => {
        setSelectedEmail(email);
        setDrawerVisible(true);
    };

    const fetchEmails = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.post('/email/get/all');
            setEmails(response.data.emails || []);
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to fetch emails');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'sent':
                return 'green';
            case 'pending':
                return 'orange';
            case 'responded':
                return 'blue';
            default:
                return 'default';
        }
    };

    const filteredEmails = emails.filter(email =>
        email.leadEmail?.toLowerCase().includes(searchText.toLowerCase()) ||
        email.subject?.toLowerCase().includes(searchText.toLowerCase()) ||
        email.status?.toLowerCase().includes(searchText.toLowerCase())
    );

    const getStatusStats = () => {
        const sent = emails.filter(e => e.status === 'sent').length;
        const pending = emails.filter(e => e.status === 'pending').length;
        const responded = emails.filter(e => e.status === 'responded').length;
        return { sent, pending, responded };
    };

    const stats = getStatusStats();

    const columns = [
        {
            title: 'Lead Email',
            dataIndex: 'leadEmail',
            key: 'leadEmail',
            width: 250,
            fixed: 'left',
            render: (email) => (
                <Space>
                    <MailOutlined style={{ color: '#1890ff' }} />
                    <Text strong>{email}</Text>
                </Space>
            ),
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            ellipsis: true,
            width: 350,
            render: (subject) => <Text>{subject}</Text>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            filters: [
                { text: 'Sent', value: 'sent' },
                { text: 'Pending', value: 'pending' },
                { text: 'Responded', value: 'responded' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <Tag color={getStatusColor(status)} icon={
                    status === 'sent' ? <CheckCircleOutlined /> :
                    status === 'pending' ? <ClockCircleOutlined /> :
                    <SendOutlined />
                }>
                    {status?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Next Mail Date',
            dataIndex: 'nextMailDate',
            key: 'nextMailDate',
            width: 180,
            sorter: (a, b) => new Date(a.nextMailDate) - new Date(b.nextMailDate),
            render: (date) => date ? (
                <Text type="secondary">
                    {new Date(date).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>
            ) : <Text type="secondary">N/A</Text>,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (date) => (
                <Text type="secondary">
                    {new Date(date).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Button 
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => showEmailDrawer(record)}
                    size="small"
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <SideNavDash>
            {loading ? (
                <Loader />
            ) : (
                <div style={{ padding: '20px' }}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Card>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Title level={2} style={{ margin: 0 }}>
                                    <MailOutlined /> Email Management
                                </Title>
                                
                                <Row gutter={16}>
                                    <Col span={6}>
                                        <Card>
                                            <Statistic 
                                                title="Total Emails" 
                                                value={emails.length} 
                                                prefix={<MailOutlined />}
                                                valueStyle={{ color: '#1890ff' }}
                                            />
                                        </Card>
                                    </Col>
                                    <Col span={6}>
                                        <Card>
                                            <Statistic 
                                                title="Sent" 
                                                value={stats.sent} 
                                                prefix={<CheckCircleOutlined />}
                                                valueStyle={{ color: '#52c41a' }}
                                            />
                                        </Card>
                                    </Col>
                                    <Col span={6}>
                                        <Card>
                                            <Statistic 
                                                title="Pending" 
                                                value={stats.pending} 
                                                prefix={<ClockCircleOutlined />}
                                                valueStyle={{ color: '#faad14' }}
                                            />
                                        </Card>
                                    </Col>
                                    <Col span={6}>
                                        <Card>
                                            <Statistic 
                                                title="Responded" 
                                                value={stats.responded} 
                                                prefix={<SendOutlined />}
                                                valueStyle={{ color: '#1890ff' }}
                                            />
                                        </Card>
                                    </Col>
                                </Row>
                            </Space>
                        </Card>

                        <Card>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Input
                                    placeholder="Search by email, subject, or status..."
                                    prefix={<SearchOutlined />}
                                    size="large"
                                    onChange={(e) => setSearchText(e.target.value)}
                                    allowClear
                                />

                                <Table
                                    columns={columns}
                                    dataSource={filteredEmails}
                                    rowKey="_id"
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: true,
                                        showTotal: (total) => `Total ${total} emails`,
                                    }}
                                    scroll={{ x: 1200 }}
                                    rowClassName={() => 'hover-row'}
                                />
                            </Space>
                        </Card>
                    </Space>

                    <Drawer
                        title={
                            <Space direction="vertical" size="small">
                                <Title level={4} style={{ margin: 0 }}>
                                    Email Details
                                </Title>
                                {selectedEmail && (
                                    <Tag color={getStatusColor(selectedEmail.status)} icon={
                                        selectedEmail.status === 'sent' ? <CheckCircleOutlined /> :
                                        selectedEmail.status === 'pending' ? <ClockCircleOutlined /> :
                                        <SendOutlined />
                                    }>
                                        {selectedEmail.status?.toUpperCase()}
                                    </Tag>
                                )}
                            </Space>
                        }
                        placement="right"
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                        width={720}
                    >
                        {selectedEmail && (
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Card size="small" title="Basic Information">
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        <div>
                                            <Text type="secondary">To:</Text><br />
                                            <Text strong copyable>{selectedEmail.leadEmail}</Text>
                                        </div>
                                        <div>
                                            <Text type="secondary">Subject:</Text><br />
                                            <Text strong>{selectedEmail.subject}</Text>
                                        </div>
                                        <div>
                                            <Text type="secondary">Created:</Text><br />
                                            <Text>{new Date(selectedEmail.createdAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</Text>
                                        </div>
                                        {selectedEmail.nextMailDate && (
                                            <div>
                                                <Text type="secondary">Next Mail Date:</Text><br />
                                                <Text>{new Date(selectedEmail.nextMailDate).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</Text>
                                            </div>
                                        )}
                                    </Space>
                                </Card>
                                
                                <Card size="small" title="Email Content">
                                    <div 
                                        style={{ 
                                            maxHeight: '500px', 
                                            overflow: 'auto',
                                            padding: '10px',
                                            background: '#fafafa',
                                            borderRadius: '4px'
                                        }}
                                        dangerouslySetInnerHTML={{ __html: selectedEmail.body }} 
                                    />
                                </Card>
                            </Space>
                        )}
                    </Drawer>
                </div>
            )}
        </SideNavDash>
    );
};

export default AllEmails;
