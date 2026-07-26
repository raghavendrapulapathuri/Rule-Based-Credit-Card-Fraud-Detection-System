import {
  FiGrid,
  FiUsers,
  FiCreditCard,
  FiRepeat,
  FiAlertTriangle,
  FiBarChart2,
  FiHeadphones,
  FiShield,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";

function Sidebar({
  activePage,
  setActivePage,
  collapsed,
}) {
  /* =====================================================
     MAIN MENU
  ===================================================== */

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FiGrid />,
    },
    {
      id: "users",
      label: "Customers",
      icon: <FiUsers />,
    },
    {
      id: "cards",
      label: "Cards",
      icon: <FiCreditCard />,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: <FiRepeat />,
    },
    {
      id: "alerts",
      label: "Fraud Alerts",
      icon: <FiAlertTriangle />,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <FiBarChart2 />,
    },
  ];

  /* =====================================================
     SUPPORT MENU
  ===================================================== */

  const supportItems = [
    {
      id: "customer-care",
      label: "Customer Care",
      icon: <FiHeadphones />,
    },
    {
      id: "help-center",
      label: "Help Center",
      icon: <FiHelpCircle />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FiSettings />,
    },
  ];

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <aside
      className={`sidebar ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
    >
      {/* =================================================
          BRAND
      ================================================= */}

      <div className="sidebar-brand">
        <div className="brand-logo">
          <FiShield />
        </div>

        <div className="sidebar-brand-text">
          <h2>FraudShield</h2>
          <span>PROTECTION CENTER</span>
        </div>
      </div>

      {/* =================================================
          MAIN MENU
      ================================================= */}

      <div className="sidebar-section-title">
        MAIN MENU
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            title={
              collapsed
                ? item.label
                : undefined
            }
            className={`sidebar-item ${
              activePage === item.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              handlePageChange(item.id)
            }
          >
            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span className="sidebar-label">
              {item.label}
            </span>

            {item.id === "alerts" && (
              <span className="alert-badge">
                !
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* =================================================
          SUPPORT
      ================================================= */}

      <div className="sidebar-section-title sidebar-support-title">
        SUPPORT
      </div>

      <nav className="sidebar-menu">
        {supportItems.map((item) => (
          <button
            key={item.id}
            type="button"
            title={
              collapsed
                ? item.label
                : undefined
            }
            className={`sidebar-item ${
              activePage === item.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              handlePageChange(item.id)
            }
          >
            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span className="sidebar-label">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* =================================================
          SYSTEM STATUS
      ================================================= */}

      <div className="sidebar-status">
        <div className="status-indicator">
          <span className="status-dot"></span>

          <div>
            <strong>
              System Secure
            </strong>

            <p>
              All systems operational
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;