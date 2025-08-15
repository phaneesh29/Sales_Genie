import React, { useState, useEffect } from "react";
import { Spin, Button, message, Card } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const MeetingReadyPage = () => {
    const { id } = useParams(); // get lead ID from URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [lead, setLead] = useState(null);
    const [error, setError] = useState(null);

    const markReady = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/leads/meeting/ready/${id}`);
            setLead(response.data.lead);
            message.success(response.data.message);
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to mark ready");
            message.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) {
            setError("Lead ID is missing in URL");
            return;
        }
        markReady();
    }, [id]);

    return (
        <div className="flex min-h-screen bg-gray-100">

            <div className="flex-1 p-6 flex justify-center items-center">
                {loading ? (
                    <Spin size="large" />
                ) : error ? (
                    <Card className="p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold text-red-600">Error</h2>
                        <p className="text-gray-600 mt-2">{error}</p>
                        <Button className="mt-4" onClick={() => navigate(-1)}>
                            Go Back
                        </Button>
                    </Card>
                ) : lead ? (
                    <Card className="p-6 rounded-xl shadow-lg text-center">
                        <h2 className="text-2xl font-bold text-green-600">
                            Lead Marked Ready!
                        </h2>
                        <p className="text-gray-700 mt-2">Name: {lead.name}</p>
                        <p className="text-gray-700 mt-1">Email: {lead.email}</p>
                        <p className="text-gray-700 mt-1">Status: {lead.status}</p>
                    </Card>
                ) : (
                    <Card className="p-6 rounded-xl shadow-lg text-center">
                        <p className="text-gray-600">No lead information available.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default MeetingReadyPage;
