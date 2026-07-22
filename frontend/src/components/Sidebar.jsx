function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        background: "#343a40",
        color: "white",
        padding: "20px",
      }}
    >
      <h3>Menu</h3>
      <hr />

      <p>📊 Dashboard</p>
      <p>👤 Users</p>
      <p>💳 Cards</p>
      <p>💰 Transactions</p>
      <p>🚨 Fraud Alerts</p>
      <p>📈 Analytics</p>
    </div>
  );
}

export default Sidebar;