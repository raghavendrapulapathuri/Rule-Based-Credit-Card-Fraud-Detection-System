function Sidebar({ activePage, setActivePage }) {
  const menuStyle = (page) => ({
    padding: "12px",
    marginBottom: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    background: activePage === page ? "#FFD700" : "transparent",
    color: activePage === page ? "#000000" : "#FFFFFF",
    fontWeight: activePage === page ? "bold" : "normal",
  });

  return (
    <div
      style={{
        width: "250px",
        minHeight: "100vh",
        background: "#343a40",
        color: "white",
        padding: "20px",
      }}
    >
      <h3 style={{ color: "#FFD700" }}>Menu</h3>

      <hr />

      <p
        style={menuStyle("dashboard")}
        onClick={() => setActivePage("dashboard")}
      >
        📊 Dashboard
      </p>

      <p
        style={menuStyle("users")}
        onClick={() => setActivePage("users")}
      >
        👤 Users
      </p>

      <p
        style={menuStyle("cards")}
        onClick={() => setActivePage("cards")}
      >
        💳 Cards
      </p>

      <p
        style={menuStyle("transactions")}
        onClick={() => setActivePage("transactions")}
      >
        💰 Transactions
      </p>

      <p
        style={menuStyle("alerts")}
        onClick={() => setActivePage("alerts")}
      >
        🚨 Fraud Alerts
      </p>

      <p
        style={menuStyle("analytics")}
        onClick={() => setActivePage("analytics")}
      >
        📈 Analytics
      </p>
    </div>
  );
}

export default Sidebar;