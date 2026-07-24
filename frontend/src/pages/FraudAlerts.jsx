import { useEffect, useState } from "react";
import api from "../services/api";

function FraudAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/alerts")
      .then((response) => {
        console.log("Fraud Alerts API Response:", response.data);

        if (Array.isArray(response.data)) {
          setAlerts(response.data);
        } else {
          setAlerts([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching fraud alerts:", error);
        setAlerts([]);
        setLoading(false);
      });
  }, []);

  const getStatusStyle = (status) => {
    if (status === "OPEN") {
      return {
        color: "#ef4444",
        fontWeight: "bold",
      };
    }

    if (status === "RESOLVED") {
      return {
        color: "#22c55e",
        fontWeight: "bold",
      };
    }

    return {
      color: "#FFD700",
      fontWeight: "bold",
    };
  };

  return (
    <div
      style={{
        flex: 1,
        padding: "30px",
        background: "#0A192F",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h2
        style={{
          color: "#FFD700",
          marginBottom: "30px",
        }}
      >
        Fraud Alerts
      </h2>

      {loading ? (
        <p>Loading fraud alerts...</p>
      ) : (
        <div
          style={{
            background: "#111827",
            border: "1px solid #FFD700",
            borderRadius: "10px",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#000000",
                  color: "#FFD700",
                }}
              >
                <th style={tableHeader}>Alert ID</th>
                <th style={tableHeader}>Message</th>
                <th style={tableHeader}>Transaction ID</th>
                <th style={tableHeader}>Amount</th>
                <th style={tableHeader}>Merchant</th>
                <th style={tableHeader}>Fraud Score</th>
                <th style={tableHeader}>Status</th>
                <th style={tableHeader}>Alert Time</th>
              </tr>
            </thead>

            <tbody>
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <tr key={alert.id}>
                    <td style={tableCell}>{alert.id}</td>

                    <td style={tableCell}>
                      {alert.message || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {alert.transaction?.id || "N/A"}
                    </td>

                    <td style={tableCell}>
                      ₹{alert.transaction?.amount ?? 0}
                    </td>

                    <td style={tableCell}>
                      {alert.transaction?.merchant || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {alert.transaction?.fraudScore ?? 0}
                    </td>

                    <td
                      style={{
                        ...tableCell,
                        ...getStatusStyle(alert.status),
                      }}
                    >
                      {alert.status || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {alert.alertTime
                        ? new Date(alert.alertTime).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "25px",
                    }}
                  >
                    No fraud alerts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const tableHeader = {
  padding: "15px",
  textAlign: "left",
  borderBottom: "1px solid #FFD700",
  whiteSpace: "nowrap",
};

const tableCell = {
  padding: "15px",
  borderBottom: "1px solid #334155",
  whiteSpace: "nowrap",
};

export default FraudAlerts;