import React, { useState, useEffect } from "react";
import { Tabs, Table, Spin, Checkbox, Button, Dropdown, Card, Statistic, Row, Col, Badge } from "antd";
import SideNavDash from "../components/SideNavDash";
import axiosInstance from "../api/axiosInstance";
import { ReloadOutlined, UserAddOutlined, MailOutlined, PhoneOutlined, CheckCircleOutlined, TeamOutlined, DownloadOutlined, PrinterOutlined, FilePdfOutlined, FileExcelOutlined } from "@ant-design/icons";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

  // Social media apps dropdown menu items
  const socialMenuItems = [
    { key: "Instagram", label: "Instagram" },
    { key: "LinkedIn", label: "LinkedIn" },
    { key: "Twitter", label: "Twitter" },
    { key: "Facebook", label: "Facebook" },
  ];

  // Channel dropdown menu items
  const channelMenuItems = [
    { key: "email", label: "Email" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "sms", label: "SMS" },
    { key: "social", label: "Social Media" },
  ];

  const getTotalLeads = () => {
    return (
      allLeads.newLeads.length +
      allLeads.contactedLeads.length +
      allLeads.followUpLeads.length +
      allLeads.closedLeads.length +
      allLeads.readyToMeetLeads.length
    );
  };

  // Export to CSV
  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      setStatusMessage({ type: "error", text: "No data to export" });
      return;
    }

    const headers = ["Name", "Email", "Age", "Phone", "Role", "Experience", "Company", "Industry", "Location", "Lead Score", "Status"];
    const csvContent = [
      headers.join(","),
      ...data.map(lead => [
        lead.name,
        lead.email,
        lead.age,
        lead.phone,
        lead.role,
        lead.experience,
        lead.company,
        lead.industry,
        lead.location,
        lead.leadScore,
        lead.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF
  const exportToPDF = (data, filename) => {
    if (data.length === 0) {
      setStatusMessage({ type: "error", text: "No data to export" });
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${filename}`, 14, 20);
    
    const tableData = data.map(lead => [
      lead.name,
      lead.email,
      lead.age,
      lead.role,
      lead.company,
      lead.leadScore,
      lead.status
    ]);

    doc.autoTable({
      head: [["Name", "Email", "Age", "Role", "Company", "Lead Score", "Status"]],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [24, 144, 255] }
    });

    doc.save(`${filename}.pdf`);
  };

  // Print table
  const printTable = (data, title) => {
    if (data.length === 0) {
      setStatusMessage({ type: "error", text: "No data to print" });
      return;
    }

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>' + title + '</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }');
    printWindow.document.write('th { background-color: #1890ff; color: white; }');
    printWindow.document.write('h1 { color: #333; }');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h1>' + title + '</h1>');
    printWindow.document.write('<table>');
    printWindow.document.write('<thead><tr><th>Name</th><th>Email</th><th>Age</th><th>Role</th><th>Company</th><th>Lead Score</th><th>Status</th></tr></thead>');
    printWindow.document.write('<tbody>');
    
    data.forEach(lead => {
      printWindow.document.write('<tr>');
      printWindow.document.write('<td>' + lead.name + '</td>');
      printWindow.document.write('<td>' + lead.email + '</td>');
      printWindow.document.write('<td>' + lead.age + '</td>');
      printWindow.document.write('<td>' + lead.role + '</td>');
      printWindow.document.write('<td>' + lead.company + '</td>');
      printWindow.document.write('<td>' + lead.leadScore + '</td>');
      printWindow.document.write('<td>' + lead.status + '</td>');
      printWindow.document.write('</tr>');
    });
    
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <SideNavDash>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <Button type="primary" icon={<ReloadOutlined />} onClick={fetchLeads} size="large">
              Refresh
            </Button>
          </div>

          <div className="flex gap-2">
            <Dropdown
              menu={{
                items: channelMenuItems,
                onClick: (e) => setSelectedChannel(e.key)
              }}
              placement="bottomRight"
            >
              <Button size="large">
                {selectedChannel === "social" ? "Social Media" : selectedChannel}
              </Button>
            </Dropdown>

            {selectedChannel === "social" && (
              <Dropdown 
                menu={{
                  items: socialMenuItems,
                  onClick: (e) => setSelectedSocialApp(e.key)
                }}
                placement="bottomRight"
              >
                <Button size="large">
                  {selectedSocialApp || "Select App"}
                </Button>
              </Dropdown>
            )}

            <Button
              type="primary"
              size="large"
              disabled={selectedChannel === "email" ? btnLoading.email : !selectedSocialApp}
              onClick={handleSend}
            >
              {btnLoading.email && selectedChannel === "email" ? "Sending..." : "Submit"}
            </Button>
          </div>
        </div>

        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Total Leads"
                value={getTotalLeads()}
                prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="New Leads"
                value={allLeads.newLeads.length}
                prefix={<UserAddOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Contacted"
                value={allLeads.contactedLeads.length}
                prefix={<MailOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Follow-Up"
                value={allLeads.followUpLeads.length}
                prefix={<PhoneOutlined style={{ color: '#fa8c16' }} />}
                valueStyle={{ color: '#fa8c16', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Meeting Ready"
                value={allLeads.readyToMeetLeads.length}
                prefix={<CheckCircleOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Closed"
                value={allLeads.closedLeads.length}
                prefix={<CheckCircleOutlined style={{ color: '#eb2f96' }} />}
                valueStyle={{ color: '#eb2f96', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        </Row>

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

        <Card className="shadow-lg">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <Tabs 
              defaultActiveKey="new" 
              type="card" 
              size="large"
              items={[
                { 
                  key: "new", 
                  label: (
                    <span>
                      <Badge count={allLeads.newLeads.length} offset={[10, 0]} style={{ backgroundColor: '#52c41a' }}>
                        <span style={{ marginRight: 8 }}>New Leads</span>
                      </Badge>
                    </span>
                  ),
                  children: (
                    <div>
                      <div style={{ marginBottom: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: "csv",
                                icon: <FileExcelOutlined />,
                                label: "Export to CSV",
                                onClick: () => exportToCSV(allLeads.newLeads, "New Leads")
                              },
                              {
                                key: "pdf",
                                icon: <FilePdfOutlined />,
                                label: "Export to PDF",
                                onClick: () => exportToPDF(allLeads.newLeads, "New Leads")
                              }
                            ]
                          }}
                          placement="bottomRight"
                        >
                          <Button icon={<DownloadOutlined />}>
                            Export
                          </Button>
                        </Dropdown>
                        <Button 
                          icon={<PrinterOutlined />}
                          onClick={() => printTable(allLeads.newLeads, "New Leads")}
                        >
                          Print
                        </Button>
                      </div>
                      <Table
                        rowKey="_id"
                        columns={getColumns(allLeads.newLeads)}
                        dataSource={allLeads.newLeads}
                        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} leads` }}
                        className="shadow-sm"
                        scroll={{ x: 1200 }}
                      />
                    </div>
                  )
                },
                { 
                  key: "contacted", 
                  label: (
                    <span>
                      <Badge count={allLeads.contactedLeads.length} offset={[10, 0]} style={{ backgroundColor: '#faad14' }}>
                        <span style={{ marginRight: 8 }}>Contacted</span>
                      </Badge>
                    </span>
                  ),
                  children: (
                    <div>
                      <div style={{ marginBottom: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: "csv",
                                icon: <FileExcelOutlined />,
                                label: "Export to CSV",
                                onClick: () => exportToCSV(allLeads.contactedLeads, "Contacted Leads")
                              },
                              {
                                key: "pdf",
                                icon: <FilePdfOutlined />,
                                label: "Export to PDF",
                                onClick: () => exportToPDF(allLeads.contactedLeads, "Contacted Leads")
                              }
                            ]
                          }}
                          placement="bottomRight"
                        >
                          <Button icon={<DownloadOutlined />}>
                            Export
                          </Button>
                        </Dropdown>
                        <Button 
                          icon={<PrinterOutlined />}
                          onClick={() => printTable(allLeads.contactedLeads, "Contacted Leads")}
                        >
                          Print
                        </Button>
                      </div>
                      <Table
                        rowKey="_id"
                        columns={getColumns(allLeads.contactedLeads)}
                        dataSource={allLeads.contactedLeads}
                        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} leads` }}
                        className="shadow-sm"
                        scroll={{ x: 1200 }}
                      />
                    </div>
                  )
                },
                { 
                  key: "follow-up", 
                  label: (
                    <span>
                      <Badge count={allLeads.followUpLeads.length} offset={[10, 0]} style={{ backgroundColor: '#fa8c16' }}>
                        <span style={{ marginRight: 8 }}>Follow-Up</span>
                      </Badge>
                    </span>
                  ),
                  children: (
                    <div>
                      <div style={{ marginBottom: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: "csv",
                                icon: <FileExcelOutlined />,
                                label: "Export to CSV",
                                onClick: () => exportToCSV(allLeads.followUpLeads, "Follow-Up Leads")
                              },
                              {
                                key: "pdf",
                                icon: <FilePdfOutlined />,
                                label: "Export to PDF",
                                onClick: () => exportToPDF(allLeads.followUpLeads, "Follow-Up Leads")
                              }
                            ]
                          }}
                          placement="bottomRight"
                        >
                          <Button icon={<DownloadOutlined />}>
                            Export
                          </Button>
                        </Dropdown>
                        <Button 
                          icon={<PrinterOutlined />}
                          onClick={() => printTable(allLeads.followUpLeads, "Follow-Up Leads")}
                        >
                          Print
                        </Button>
                      </div>
                      <Table
                        rowKey="_id"
                        columns={getColumns(allLeads.followUpLeads)}
                        dataSource={allLeads.followUpLeads}
                        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} leads` }}
                        className="shadow-sm"
                        scroll={{ x: 1200 }}
                      />
                    </div>
                  )
                },
                { 
                  key: "meeting-ready", 
                  label: (
                    <span>
                      <Badge count={allLeads.readyToMeetLeads.length} offset={[10, 0]} style={{ backgroundColor: '#722ed1' }}>
                        <span style={{ marginRight: 8 }}>Meeting Ready</span>
                      </Badge>
                    </span>
                  ),
                  children: (
                    <div>
                      <div style={{ marginBottom: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: "csv",
                                icon: <FileExcelOutlined />,
                                label: "Export to CSV",
                                onClick: () => exportToCSV(allLeads.readyToMeetLeads, "Meeting Ready Leads")
                              },
                              {
                                key: "pdf",
                                icon: <FilePdfOutlined />,
                                label: "Export to PDF",
                                onClick: () => exportToPDF(allLeads.readyToMeetLeads, "Meeting Ready Leads")
                              }
                            ]
                          }}
                          placement="bottomRight"
                        >
                          <Button icon={<DownloadOutlined />}>
                            Export
                          </Button>
                        </Dropdown>
                        <Button 
                          icon={<PrinterOutlined />}
                          onClick={() => printTable(allLeads.readyToMeetLeads, "Meeting Ready Leads")}
                        >
                          Print
                        </Button>
                      </div>
                      <Table
                        rowKey="_id"
                        columns={getColumns(allLeads.readyToMeetLeads)}
                        dataSource={allLeads.readyToMeetLeads}
                        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} leads` }}
                        className="shadow-sm"
                        scroll={{ x: 1200 }}
                      />
                    </div>
                  )
                },
                { 
                  key: "closed", 
                  label: (
                    <span>
                      <Badge count={allLeads.closedLeads.length} offset={[10, 0]} style={{ backgroundColor: '#eb2f96' }}>
                        <span style={{ marginRight: 8 }}>Closed</span>
                      </Badge>
                    </span>
                  ),
                  children: (
                    <div>
                      <div style={{ marginBottom: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: "csv",
                                icon: <FileExcelOutlined />,
                                label: "Export to CSV",
                                onClick: () => exportToCSV(allLeads.closedLeads, "Closed Leads")
                              },
                              {
                                key: "pdf",
                                icon: <FilePdfOutlined />,
                                label: "Export to PDF",
                                onClick: () => exportToPDF(allLeads.closedLeads, "Closed Leads")
                              }
                            ]
                          }}
                          placement="bottomRight"
                        >
                          <Button icon={<DownloadOutlined />}>
                            Export
                          </Button>
                        </Dropdown>
                        <Button 
                          icon={<PrinterOutlined />}
                          onClick={() => printTable(allLeads.closedLeads, "Closed Leads")}
                        >
                          Print
                        </Button>
                      </div>
                      <Table
                        rowKey="_id"
                        columns={getColumns(allLeads.closedLeads)}
                        dataSource={allLeads.closedLeads}
                        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} leads` }}
                        className="shadow-sm"
                        scroll={{ x: 1200 }}
                      />
                    </div>
                  )
                }
              ]}
            />
          )}
        </Card>
      </div>
    </SideNavDash>
  );
}
