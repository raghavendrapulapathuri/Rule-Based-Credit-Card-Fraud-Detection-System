import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Cards from "./pages/Cards";
import Transactions from "./pages/Transactions";
import FraudAlerts from "./pages/FraudAlerts";
import Analytics from "./pages/Analytics";
import CustomerCare from "./pages/CustomerCare";
import HelpCenter from "./pages/HelpCenter";
import Settings from "./pages/Settings";
import AdminProfile from "./pages/AdminProfile";
import CustomerRegister from "./pages/CustomerRegister";

import "./App.css";

function App() {
  /* =====================================================
     ADMIN AUTHENTICATION
  ===================================================== */

  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem(
      "fraudshield_admin"
    );

    if (!savedAdmin) {
      return null;
    }

    try {
      return JSON.parse(savedAdmin);
    } catch (error) {
      console.error(
        "Unable to read saved admin:",
        error
      );

      localStorage.removeItem(
        "fraudshield_admin"
      );

      return null;
    }
  });

  /* =====================================================
     CURRENT PAGE
  ===================================================== */

  const [activePage, setActivePage] =
    useState("dashboard");

  /* =====================================================
     SIDEBAR
  ===================================================== */

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(
      (previous) => !previous
    );
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleLogin = (adminData) => {
    setAdmin(adminData);

    setActivePage("dashboard");
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem(
      "fraudshield_admin"
    );

    setAdmin(null);

    setActivePage("dashboard");
  };

  /* =====================================================
     PAGE RENDERING
  ===================================================== */

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

      case "help-center":
        return <HelpCenter />;

      case "settings":
        return <Settings admin={admin} />;
      case "admin-profile":
        return <AdminProfile admin={admin} />;

      default:
        return <Dashboard />;
    }
  };

  /* =====================================================
     NOT LOGGED IN
  ===================================================== */

if (!admin) {
  return (
    <CustomerRegister />
  );
}

  /* =====================================================
     LOGGED IN APPLICATION
  ===================================================== */

  return (
    <div className="app-shell">

      {/* SIDEBAR */}

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={sidebarCollapsed}
      />

      {/* MAIN */}

      <div className="app-main">

        {/* NAVBAR */}

        <Navbar
          toggleSidebar={toggleSidebar}
          setActivePage={setActivePage}
          admin={admin}
          onLogout={handleLogout}
        />

        {/* PAGE */}

        <main className="page-content">
          {renderPage()}
        </main>

      </div>

    </div>
  );
}

export default App;