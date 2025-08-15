import React, { useEffect, useState } from "react";
import SideNavDash from "../components/SideNavDash";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import {
    Spin,
    Card,
    Descriptions,
    Tag,
    Button,
    message,
    Form,
    Input,
    DatePicker,
    Select,
} from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const LeadDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [status, setStatus] = useState("new");
    const [meetingLink, setMeetingLink] = useState("");
    const [meetingDate, setMeetingDate] = useState(null);
    const [email, setEmail] = useState({ subject: "", body: "" });
    const [lead, setLead] = useState({});
    const [error, setError] = useState("");

    const fetchLeadDetails = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/leads/get/${id}`);
            setLead(res.data.lead);
            setStatus(res.data.lead?.status || "new");
        } catch (err) {
            const errMsg = err?.response?.data?.message || "Failed to fetch lead details";
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLead = async () => {
        try {
            setBtnLoading(true);
            await axiosInstance.delete(`/leads/delete/${id}`);
            message.success("Lead deleted successfully");
            navigate("/admin/dashboard");
        } catch (err) {
            const errMsg = err?.response?.data?.message || "Failed to delete lead";
            setError(errMsg);
            message.error(errMsg);
        } finally {
            setBtnLoading(false);
        }
    };

    const handleUpdateLead = async () => {
        try {
            setBtnLoading(true);
            await axiosInstance.patch(`/leads/update/${id}`, { status });
            message.success("Lead status updated successfully");
            navigate("/admin/dashboard");
        } catch (err) {
            const errMsg = err?.response?.data?.message || "Failed to update lead";
            setError(errMsg);
            message.error(errMsg);
        } finally {
            setBtnLoading(false);
        }
    };

    const handleUpdateMeetingLinkAndDate = async () => {
        try {
            setBtnLoading(true);
            await axiosInstance.post(`/leads/send/meeting-link/${id}`, {
                meetingDate,
                meetingLink,
            });
            message.success("Meeting details updated successfully");
            navigate("/admin/dashboard");
        } catch (err) {
            const errMsg = err?.response?.data?.message || "Failed to update meeting details";
            setError(errMsg);
            message.error(errMsg);
        } finally {
            setBtnLoading(false);
        }
    };

    const sendCustomEmail = async () => {
        try {
            setBtnLoading(true);
            await axiosInstance.post(`/email/send/${id}`, email);
            message.success("Email sent successfully");
            navigate("/admin/dashboard");
        } catch (err) {
            const errMsg = err?.response?.data?.message || "Failed to send email";
            setError(errMsg);
            message.error(errMsg);
        } finally {
            setBtnLoading(false);
        }
    };

    useEffect(() => {
        fetchLeadDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <SideNavDash />
            <div className="flex-1 p-6">

                <Card title="Lead Details" bordered={false} className="shadow-lg">
                    <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="Name">{lead?.name}</Descriptions.Item>
                        <Descriptions.Item label="Email"><a href={`mailto:${lead?.email}`}>{lead?.email}</a></Descriptions.Item>
                        <Descriptions.Item label="Age">{lead?.age} Years</Descriptions.Item>
                        <Descriptions.Item label="Phone"><a href={`tel:${lead?.phone}`}>{lead?.phone}</a></Descriptions.Item>
                        <Descriptions.Item label="Role">{lead?.role}</Descriptions.Item>
                        <Descriptions.Item label="Experience">
                            {lead?.experience} Years
                        </Descriptions.Item>
                        <Descriptions.Item label="Company">{lead?.company}</Descriptions.Item>
                        <Descriptions.Item label="Industry">{lead?.industry}</Descriptions.Item>
                        <Descriptions.Item label="Location">{lead?.location}</Descriptions.Item>
                        <Descriptions.Item label="LinkedIn"><a href={lead?.linkedIn} target="_blank" rel="noopener noreferrer">{lead?.linkedIn}</a></Descriptions.Item>
                        <Descriptions.Item label="Lead Source">
                            {lead?.leadSource}
                        </Descriptions.Item>
                        <Descriptions.Item label="Category">{lead?.category}</Descriptions.Item>
                        <Descriptions.Item label="Status">
                            <Tag color="blue">{lead?.status}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Insight">{lead?.insight}</Descriptions.Item>
                        <Descriptions.Item label="Lead Score">{lead?.leadScore}</Descriptions.Item>
                    </Descriptions>


                    {error && (
                        <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}


                    {/* Status Update */}
                    <div className="mt-6 flex items-center gap-4">
                        <Select
                            value={status}
                            onChange={(value) => setStatus(value)}
                            style={{ width: 200 }}
                        >
                            <Option value="new">New</Option>
                            <Option value="contacted">Contacted</Option>
                            <Option value="follow-up">Follow-Up</Option>
                            <Option value="meeting" disabled>Meeting</Option>
                            <Option value="closed">Closed</Option>
                        </Select>
                        <Button
                            type="primary"
                            onClick={handleUpdateLead}
                            loading={btnLoading}
                        >
                            Update Status
                        </Button>
                    </div>

                    {/* Meeting Details Form */}
                    {lead?.readyToMeet && (
                        <div className="mt-10">
                            <h3 className="text-lg font-semibold mb-4">Add Meeting Details</h3>
                            <Form layout="vertical" onFinish={handleUpdateMeetingLinkAndDate}>

                                {/* Generate Button */}
                                <Button
                                    type="default"
                                    style={{ marginBottom: "1rem" }}
                                    onClick={() => {
                                        if (!lead?._id) {
                                            message.error("Lead ID is missing!");
                                            return;
                                        }
                                        const link = `https://meet.jit.si/${lead._id}-${Date.now()}`;
                                        setMeetingLink(link);
                                        message.success("Jitsi meeting link generated!");
                                    }}
                                >
                                    Generate Jitsi Link
                                </Button>

                                <Form.Item label="Meeting Link" required>
                                    <Input
                                        placeholder="Enter meeting link"
                                        value={meetingLink}
                                        onChange={(e) => setMeetingLink(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Meeting Date" required>
                                    <DatePicker
                                        style={{ width: "100%" }}
                                        value={meetingDate ? dayjs(meetingDate) : null}
                                        onChange={(date) =>
                                            setMeetingDate(date ? date.toISOString() : null)
                                        }
                                        showTime
                                        disabledDate={(current) => {
                                            // Disable dates before today
                                            return current && current < dayjs().startOf('day');
                                        }}
                                    />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" loading={btnLoading}>
                                    Save Meeting Details
                                </Button>
                            </Form>
                        </div>
                    )}


                    {/* Email Form */}
                    <div className="mt-10">
                        <h3 className="text-lg font-semibold mb-4">Send Custom Email</h3>
                        <Form layout="vertical" onFinish={sendCustomEmail}>
                            <Form.Item label="Subject" required>
                                <Input
                                    value={email.subject}
                                    onChange={(e) =>
                                        setEmail({ ...email, subject: e.target.value })
                                    }
                                />
                            </Form.Item>
                            <Form.Item label="Body" required>
                                <TextArea
                                    rows={4}
                                    value={email.body}
                                    onChange={(e) =>
                                        setEmail({ ...email, body: e.target.value })
                                    }
                                />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" loading={btnLoading}>
                                Send Email
                            </Button>
                        </Form>
                    </div>

                    {/* Delete Lead */}
                    <div className="mt-10">
                        <Button
                            danger
                            onClick={handleDeleteLead}
                            loading={btnLoading}
                            type="primary"
                        >
                            Delete Lead
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default LeadDetails;
