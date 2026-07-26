import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Cards from "./pages/Cards";
import Transactions from "./pages/Transactions";
import FraudAlerts from "./pages/FraudAlerts";
import Analytics from "./pages/Analytics";
import CustomerCare from "./pages/CustomerCare";

import "./App.css";

function App() {
  /* =========================
     CURRENT PAGE
  ========================= */

  const [activePage, setActivePage] =
    useState("dashboard");

  /* =========================
     SIDEBAR STATE
  ========================= */

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  /* =========================
     TOGGLE SIDEBAR
  ========================= */

  const toggleSidebar = () => {
    setSidebarCollapsed(
      (previous) => !previous
    );
  };

  /* =========================
     PAGE RENDERING
  ========================= */

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;

      case "users":
        return <Users />;

      case "cards":
        return <Cards />;

      case "transactions":
        return <Transactions />;

      case "alerts":
        return <FraudAlerts />;

      case "analytics":
        return <Analytics />;
      case "customer-care":
        return <CustomerCare />;

      default:
        return <Dashboard />;
        
    }
  };

  /* =========================
     APP
  ========================= */

  return (
    <div className="app-shell">

      {/* SIDEBAR */}

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={sidebarCollapsed}
      />

      {/* MAIN AREA */}

      <div className="app-main">

        {/* NAVBAR */}

        <Navbar
          toggleSidebar={toggleSidebar}
        />

        {/* PAGE CONTENT */}

        <main className="page-content">
          {renderPage()}
        </main>

      </div>
    </div>
  );
}

export default App;