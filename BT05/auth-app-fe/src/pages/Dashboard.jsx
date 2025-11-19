import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Space,
  Spin,
  message,
  Descriptions,
} from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import authService from "../services/authService";

const { Title, Text } = Typography;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authService.getMe();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      message.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      message.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      message.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Card
          style={{
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            borderRadius: "16px",
            border: "none",
          }}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  color: "white",
                }}
              >
                <UserOutlined />
              </div>
              <Title level={3} style={{ margin: 0 }}>
                User Dashboard
              </Title>
            </div>
          }
          extra={
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              size="large"
              style={{ borderRadius: "8px" }}
            >
              Logout
            </Button>
          }
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Title level={4}>Welcome back!</Title>
              <Text type="secondary">You are successfully logged in.</Text>
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="User ID">{user?.id}</Descriptions.Item>
              <Descriptions.Item label="Name">
                {user?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
              <Descriptions.Item label="Account Created">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleString()
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {user?.updatedAt
                  ? new Date(user.updatedAt).toLocaleString()
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>

            <div
              style={{
                padding: "24px",
                background:
                  "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                borderRadius: "12px",
                textAlign: "center",
                border: "1px solid #e8e8e8",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
              <Title level={4} style={{ marginBottom: 8 }}>
                Authentication Successful!
              </Title>
              <Text style={{ fontSize: "15px" }}>
                This is a protected page. Only authenticated users can access
                this dashboard.
              </Text>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
