import React, { useState, useEffect } from 'react';
import { Card, List, Spin, Button, Empty, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import SideNavDash from '../components/SideNavDash';
import axiosInstance from '../api/axiosInstance';

const AllMeetings = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [leads, setLeads] = useState([]);
    const navigate = useNavigate();

    const fetchMeetings = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/leads/all/meetings');
            setLeads(response.data.meetings || []);
        } catch (err) {
            setError(err?.response?.data?.message || 'An error occurred while fetching meetings');
            message.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    const handleJoinMeeting = (meetingId) => {
        navigate(`/meeting/${meetingId}`);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <SideNavDash />

            <div className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-6">All Meetings</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-lg">{error}</p>
                ) : leads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96">
                        <Empty
                            description={
                                <span className="text-gray-500 text-lg">
                                    No meetings found
                                </span>
                            }
                        />
                        <Button
                            type="primary"
                            className="mt-4 bg-blue-600 hover:bg-blue-700"
                            onClick={fetchMeetings}
                        >
                            Refresh
                        </Button>
                    </div>
                ) : (
                    <List
                        grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 3 }}
                        dataSource={leads}
                        renderItem={(lead) => (
                            <List.Item>
                                <Card
                                    className="shadow-lg hover:shadow-2xl transition-shadow rounded-xl"
                                    title={lead.name}
                                >
                                    <p className="text-gray-600">{lead.email}</p>
                                    <p className="text-gray-500 mt-1">
                                        {new Date(lead.meetingDate).toLocaleString()}
                                    </p>
                                    <Button
                                        type="primary"
                                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                                        onClick={() => handleJoinMeeting(lead._id)}
                                    >
                                        Join Meeting
                                    </Button>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default AllMeetings;
