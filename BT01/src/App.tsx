import { Card, Typography } from "antd";

const { Title } = Typography;

function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#9FA2B4",
      }}
    >
      <Card style={{ width: 300, textAlign: "center" }}>
        <Title level={3}>Thông tin cá nhân</Title>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
          <Typography.Text strong>Họ và tên: Lê Chí Nghĩa</Typography.Text>
          <Typography.Text strong>MSSV: 22110187</Typography.Text>
          <Typography.Text strong>Quê quán: Quảng Trị</Typography.Text>
          <Typography.Text strong>Năm sinh: 08-01-2004</Typography.Text>     
        </div>
      </Card>
    </div>
  );
}

export default App;
