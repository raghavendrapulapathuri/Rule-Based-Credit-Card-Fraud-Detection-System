import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Cards from "./pages/Cards";
import Transactions from "./pages/Transactions";
import FraudAlerts from "./pages/FraudAlerts";
import Analytics from "./pages/Analytics";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    if (activePage === "users") {
      return <Users />;
    }

    if (activePage === "cards") {
      return <Cards />;
    }

    if (activePage === "transactions") {
      return <Transactions />;
    }

    if (activePage === "alerts") {
      return <FraudAlerts />;
    }

    if (activePage === "analytics") {
      return <Analytics />;
    }

    return <Dashboard />;
  };

  return (
    <>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
        />

        {renderPage()}
      </div>
    </>
  );
}

export default App;