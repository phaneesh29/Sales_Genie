import React, { useState, useEffect } from "react";
import { Tabs, Table, Spin, Checkbox, Button, Dropdown, Menu } from "antd";
import SideNavDash from "../components/SideNavDash";
import axiosInstance from "../api/axiosInstance";

const { TabPane } = Tabs;

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState({});
  const [allLeads, setAllLeads] = useState({
    newLeads: [],
    contactedLeads: [],
    followUpLeads: [],
    closedLeads: [],
    readyToMeetLeads: [],
  });
  const [statusMessage, setStatusMessage] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState("email"); // default channel
  const [selectedSocialApp, setSelectedSocialApp] = useState(null);

  // Fetch leads
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/leads/get/all");
      setAllLeads(res.data);
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to fetch leads",
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle checkbox
  const toggleCheckbox = async (leadId, checked) => {
    setBtnLoading((prev) => ({ ...prev, [leadId]: true }));
    try {
      await axiosInstance.patch(`/leads/check/${leadId}`);
      const newLeads = { ...allLeads };
      Object.keys(newLeads).forEach((key) => {
        if (Array.isArray(newLeads[key])) {
          newLeads[key] = newLeads[key].map((lead) =>
            lead._id === leadId ? { ...lead, checked: !checked } : lead
          );
        }
      });
      setAllLeads(newLeads);
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to update lead status",
      });
    } finally {
      setBtnLoading((prev) => ({ ...prev, [leadId]: false }));
    }
  };

  // Send email
  const handleSend = async () => {
    if (selectedChannel === "email") {
      setBtnLoading((prev) => ({ ...prev, email: true }));
      try {
        await axiosInstance.get(`/leads/send/email`);
        setStatusMessage({ type: "success", text: "Email sent successfully" });
      } catch (err) {
        setStatusMessage({
          type: "error",
          text: err?.response?.data?.message || "Failed to send email",
        });
      } finally {
        setBtnLoading((prev) => ({ ...prev, email: false }));
      }
    } else if (selectedChannel === "social" && selectedSocialApp) {
      // Implement your social media send API call here
      setStatusMessage({
        type: "success",
        text: `Message sent via ${selectedSocialApp}`,
      });
    } else {
      setStatusMessage({
        type: "error",
        text: "Please select a valid channel or social media app",
      });
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Helper: unique values for filters per tab
  const getUniqueValues = (leads, field) => {
    return Array.from(
      new Set(leads.map((l) => l[field]).filter((v) => v !== undefined && v !== null))
    ).map((v) => ({ text: v, value: v }));
  };

  // Generate columns for each tab
  const getColumns = (leads) => [
    {
      title: "Toggle",
      dataIndex: "checked",
      key: "checked",
      render: (checked, record) => (
        <Checkbox
          checked={checked}
          disabled={btnLoading[record._id]}
          onChange={() => toggleCheckbox(record._id, checked)}
        />
      ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      filters: getUniqueValues(leads, "age"),
      onFilter: (value, record) => record.age === value,
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      filters: getUniqueValues(leads, "experience"),
      onFilter: (value, record) => record.experience === value,
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      filters: getUniqueValues(leads, "company"),
      onFilter: (value, record) => record.company === value,
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      filters: getUniqueValues(leads, "industry"),
      onFilter: (value, record) => record.industry === value,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      filters: getUniqueValues(leads, "location"),
      onFilter: (value, record) => record.location === value,
    },
    { title: "Lead Score", dataIndex: "leadScore", key: "leadScore" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <a href={`/lead/${record._id}`} className="text-blue-500 hover:underline font-medium">
          View
        </a>
      ),
    },
  ];

  // Social media apps dropdown
  const socialMenu = (
    <Menu
      onClick={(e) => setSelectedSocialApp(e.key)}
    >
      <Menu.Item key="Instagram">Instagram</Menu.Item>
      <Menu.Item key="LinkedIn">LinkedIn</Menu.Item>
      <Menu.Item key="Twitter">Twitter</Menu.Item>
      <Menu.Item key="Facebook">Facebook</Menu.Item>
    </Menu>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavDash />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          <div className="flex gap-2">
            <Dropdown
              overlay={
                <Menu onClick={(e) => setSelectedChannel(e.key)}>
                  <Menu.Item key="email">Email</Menu.Item>
                  <Menu.Item key="whatsapp">WhatsApp</Menu.Item>
                  <Menu.Item key="sms">SMS</Menu.Item>
                  <Menu.Item key="social">Social Media</Menu.Item>
                </Menu>
              }
              placement="bottomRight"
              arrow
            >
              <Button>
                {selectedChannel === "social" ? "Social Media" : selectedChannel}
              </Button>
            </Dropdown>

            {selectedChannel === "social" && (
              <Dropdown overlay={socialMenu} placement="bottomRight" arrow>
                <Button>
                  {selectedSocialApp || "Select App"}
                </Button>
              </Dropdown>
            )}

            <Button
              type="primary"
              disabled={selectedChannel === "email" ? btnLoading.email : !selectedSocialApp}
              onClick={handleSend}
            >
              {btnLoading.email && selectedChannel === "email" ? "Sending..." : "Submit"}
            </Button>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`mb-4 p-3 rounded ${statusMessage.type === "success"
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
              }`}
          >
            {statusMessage.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <Tabs defaultActiveKey="new" type="card">
            {[
              { key: "new", label: "New Leads", data: allLeads.newLeads },
              { key: "contacted", label: "Contacted Leads", data: allLeads.contactedLeads },
              { key: "follow-up", label: "Follow-Up Leads", data: allLeads.followUpLeads },
              { key: "closed", label: "Closed Leads", data: allLeads.closedLeads },
              { key: "meeting-ready", label: "Meeting Ready", data: allLeads.readyToMeetLeads },
            ].map((tab) => (
              <TabPane tab={tab.label} key={tab.key}>
                <Table
                  rowKey="_id"
                  columns={getColumns(tab.data)}
                  dataSource={tab.data}
                  pagination={false}
                  className="shadow-lg rounded-lg"
                />
              </TabPane>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
