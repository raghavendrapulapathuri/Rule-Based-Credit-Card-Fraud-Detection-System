import { useEffect, useState } from "react";
import api from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalTransactions: 0,
    safeTransactions: 0,
    suspiciousTransactions: 0,
    fraudTransactions: 0,
    fraudPercentage: 0,
    fraudAmount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/analytics/fraud-percentage"),
      api.get("/analytics/fraud-amount"),
      api.get("/dashboard/summary"),
    ])
      .then(
        ([
          percentageResponse,
          amountResponse,
          dashboardResponse,
        ]) => {
          console.log(
            "Fraud Percentage:",
            percentageResponse.data
          );

          console.log(
            "Fraud Amount:",
            amountResponse.data
          );

          console.log(
            "Dashboard Summary:",
            dashboardResponse.data
          );

          setAnalytics({
            totalTransactions:
              dashboardResponse.data.totalTransactions ?? 0,

            safeTransactions:
              dashboardResponse.data.safeTransactions ?? 0,

            suspiciousTransactions:
              dashboardResponse.data.suspiciousTransactions ?? 0,

            fraudTransactions:
              dashboardResponse.data.fraudTransactions ?? 0,

            fraudPercentage:
              percentageResponse.data.fraudPercentage ?? 0,

            fraudAmount:
              amountResponse.data ?? 0,
          });

          setLoading(false);
        }
      )
      .catch((error) => {
        console.error(
          "Error fetching analytics:",
          error
        );

        setLoading(false);
      });
  }, []);

  const chartData = [
    {
      name: "SAFE",
      value: analytics.safeTransactions,
    },
    {
      name: "SUSPICIOUS",
      value: analytics.suspiciousTransactions,
    },
    {
      name: "FRAUD",
      value: analytics.fraudTransactions,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#facc15",
    "#ef4444",
  ];

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
          textAlign: "center",
          marginBottom: "35px",
        }}
      >
        Fraud Analytics
      </h2>

      {loading ? (
        <p
          style={{
            textAlign: "center",
          }}
        >
          Loading analytics...
        </p>
      ) : (
        <>
          {/* Analytics Cards */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, 280px)",
              gap: "30px",
              justifyContent: "center",
              marginBottom: "50px",
            }}
          >
            <AnalyticsCard
              icon="💰"
              title="Total Transactions"
              value={analytics.totalTransactions}
            />

            <AnalyticsCard
              icon="🚨"
              title="Fraud Transactions"
              value={analytics.fraudTransactions}
            />

            <AnalyticsCard
              icon="📊"
              title="Fraud Percentage"
              value={`${Number(
                analytics.fraudPercentage
              ).toFixed(2)}%`}
            />

            <AnalyticsCard
              icon="💸"
              title="Total Fraud Amount"
              value={`₹${Number(
                analytics.fraudAmount
              ).toLocaleString("en-IN")}`}
            />
          </div>

          {/* Pie Chart */}

          <div
            style={{
              maxWidth: "750px",
              margin: "0 auto",
              background: "#111827",
              border: "1px solid #FFD700",
              borderRadius: "15px",
              padding: "25px",
            }}
          >
            <h3
              style={{
                color: "#FFD700",
                textAlign: "center",
                marginTop: 0,
                marginBottom: "20px",
              }}
            >
              Transaction Risk Distribution
            </h3>

            <div
              style={{
                width: "100%",
                height: "350px",
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    outerRadius={110}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) =>
                      `${name}: ${value}`
                    }
                  >
                    {chartData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AnalyticsCard({
  icon,
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "#1c1c1c",
        border: "2px solid #FFD700",
        borderRadius: "15px",
        padding: "30px",
        textAlign: "center",
        minHeight: "160px",
      }}
    >
      <div
        style={{
          fontSize: "40px",
          marginBottom: "15px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          color: "#FFD700",
          marginBottom: "15px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color: "#FFD700",
          margin: 0,
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default Analytics;