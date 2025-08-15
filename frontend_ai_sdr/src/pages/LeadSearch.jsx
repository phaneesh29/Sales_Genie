import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideNavDash from "../components/SideNavDash";
import axiosInstance from "../api/axiosInstance";
import { Input, List, Spin, message, Card, Button, Space } from "antd";
import debounce from "lodash/debounce";

const LeadSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryParam = queryParams.get("query") || "";

  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (searchQuery) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/leads/search?query=${searchQuery}`);
      setResults(response.data.leads);
    } catch (err) {
      message.error(err?.response?.data?.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      navigate(`/lead/search?query=${encodeURIComponent(value)}`);
      fetchResults(value);
    }, 500),
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value) debouncedSearch(value);
    else setResults([]); // clear results if input is empty
  };

  // Manual search triggered by button
  const handleSearchClick = () => {
    if (!query) return;
    navigate(`/lead/search?query=${encodeURIComponent(query)}`);
    fetchResults(query);
  };

  // Initial fetch if query exists in URL
  useEffect(() => {
    if (queryParam) fetchResults(queryParam);
  }, [queryParam]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SideNavDash />
      <div className="flex-1 p-6">
        <Card title="Lead Search" className="shadow-lg">
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="Search by role, name, company..."
              value={query}
              onChange={handleChange}
              onPressEnter={handleSearchClick}
            />
            <Button type="primary"  onClick={handleSearchClick}>
              Search
            </Button>
          </Space.Compact>

          <div className="mt-6">
            {loading ? (
              <Spin size="large" />
            ) : (
              <List
                bordered
                dataSource={results}
                locale={{ emptyText: "No leads found" }}
                renderItem={(item) => (
                  <List.Item className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-bold">{item.name}</span>
                      <span>{item.email}</span>
                      <span>
                        {item.role} @ {item.company}
                      </span>
                    </div>
                    <Button
                      type="primary"
                      onClick={() => navigate(`/lead/${item._id}`)}
                    >
                      View Details
                    </Button>
                  </List.Item>
                )}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LeadSearch;
