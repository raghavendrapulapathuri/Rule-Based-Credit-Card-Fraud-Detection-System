import { useEffect, useState } from "react";
import api from "../services/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/transactions")
      .then((response) => {
        console.log("Transactions API Response:", response.data);

        if (Array.isArray(response.data)) {
          setTransactions(response.data);
        } else {
          setTransactions([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
        setLoading(false);
      });
  }, []);

  const getStatusStyle = (status) => {
    if (status === "SAFE") {
      return {
        color: "#22c55e",
        fontWeight: "bold",
      };
    }

    if (status === "SUSPICIOUS") {
      return {
        color: "#facc15",
        fontWeight: "bold",
      };
    }

    if (status === "FRAUD") {
      return {
        color: "#ef4444",
        fontWeight: "bold",
      };
    }

    return {
      color: "#ffffff",
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
        Transactions
      </h2>

      {loading ? (
        <p>Loading transactions...</p>
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
                <th style={tableHeader}>ID</th>
                <th style={tableHeader}>Amount</th>
                <th style={tableHeader}>Merchant</th>
                <th style={tableHeader}>Location</th>
                <th style={tableHeader}>Time</th>
                <th style={tableHeader}>Fraud Score</th>
                <th style={tableHeader}>Status</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td style={tableCell}>{transaction.id}</td>

                    <td style={tableCell}>
                      ₹{transaction.amount}
                    </td>

                    <td style={tableCell}>
                      {transaction.merchant || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {transaction.location || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {transaction.transactionTime
                        ? new Date(
                            transaction.transactionTime
                          ).toLocaleString()
                        : "N/A"}
                    </td>

                    <td style={tableCell}>
                      {transaction.fraudScore ?? 0}
                    </td>

                    <td
                      style={{
                        ...tableCell,
                        ...getStatusStyle(transaction.status),
                      }}
                    >
                      {transaction.status || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "25px",
                    }}
                  >
                    No transactions found.
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

export default Transactions;