import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardCard from "../components/DashboardCard";

import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaBell,
} from "react-icons/fa";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalTransactions: 0,
    safeTransactions: 0,
    suspiciousTransactions: 0,
    fraudTransactions: 0,
    totalAlerts: 0,
  });

  useEffect(() => {
    api
      .get("/dashboard/summary")
      .then((response) => {
        setDashboard(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div
      style={{
        flex: 1,
        padding: "25px",
        background: "#0A192F",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          color: "#FFD700",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Dashboard
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,250px)",
          gap: "30px",
          justifyContent: "center",
        }}
      >
        <DashboardCard
          icon={<FaMoneyBillWave color="#FFD700" size={45} />}
          title="Transactions"
          value={dashboard.totalTransactions}
        />

        <DashboardCard
          icon={<FaCheckCircle color="#FFD700" size={45} />}
          title="Safe"
          value={dashboard.safeTransactions}
        />

        <DashboardCard
          icon={<FaExclamationTriangle color="#FFD700" size={45} />}
          title="Suspicious"
          value={dashboard.suspiciousTransactions}
        />

        <DashboardCard
          icon={<FaTimesCircle color="#FFD700" size={45} />}
          title="Fraud"
          value={dashboard.fraudTransactions}
        />

        <DashboardCard
          icon={<FaBell color="#FFD700" size={45} />}
          title="Alerts"
          value={dashboard.totalAlerts}
        />
      </div>
    </div>
  );
}

export default Dashboard;