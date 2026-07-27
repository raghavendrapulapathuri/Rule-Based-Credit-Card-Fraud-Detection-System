import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FiSearch,
  FiBell,
  FiMoon,
  FiSun,
  FiMaximize,
  FiMinimize,
  FiChevronDown,
  FiMenu,
  FiUser,
  FiSettings,
  FiLogOut,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";

import api from "../services/api";

function Navbar({
  toggleSidebar,
  setActivePage,
  admin,
  onLogout,
}) {
  /* =====================================================
     STATES
  ===================================================== */

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false);

  const [adminOpen, setAdminOpen] =
    useState(false);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const [lightMode, setLightMode] =
    useState(false);

  const [alerts, setAlerts] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [searchError, setSearchError] =
    useState("");

  const searchInputRef = useRef(null);

  /* =====================================================
     FETCH ALERTS
  ===================================================== */

  useEffect(() => {
    api
      .get("/alerts")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setAlerts(response.data);
        }
      })
      .catch((error) => {
        console.error(
          "Navbar alerts error:",
          error
        );
      });
  }, []);

  /* =====================================================
     ACTIVE ALERTS
  ===================================================== */

  const activeAlerts = alerts.filter(
    (alert) =>
      alert.status?.toUpperCase() !==
      "RESOLVED"
  );

  /* =====================================================
     RECENT ALERTS
  ===================================================== */

  const recentAlerts = [...alerts]
    .sort(
      (a, b) =>
        new Date(b.alertTime || 0) -
        new Date(a.alertTime || 0)
    )
    .slice(0, 3);

  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearch = () => {
      const search = searchTerm
    .trim()
    .toLowerCase();

  console.log("Searching for:", search);

  if (!search) {
    return;
  }

  let page = null;

  if (
    search === "dashboard" ||
    search === "home" ||
    search === "overview"
  ) {
    page = "dashboard";
  } else if (
    search === "customer" ||
    search === "customers" ||
    search === "user" ||
    search === "users"
  ) {
    page = "users";
  } else if (
    search === "card" ||
    search === "cards" ||
    search === "credit card" ||
    search === "credit cards"
  ) {
    page = "cards";
  } else if (
    search === "transaction" ||
    search === "transactions"
  ) {
    page = "transactions";
  } else if (
    search === "fraud" ||
    search === "alert" ||
    search === "alerts" ||
    search === "fraud alert" ||
    search === "fraud alerts"
  ) {
    page = "alerts";
  } else if (
    search === "analytics" ||
    search === "analysis" ||
    search === "reports"
  ) {
    page = "analytics";
  } else if (
    search === "support" ||
    search === "customer care" ||
    search === "complaints"
  ) {
    page = "customer-care";
  } else if (
    search === "help" ||
    search === "help center" ||
    search === "faq"
  ) {
    page = "help-center";
  } else if (
    search === "settings" ||
    search === "setting"
  ) {
    page = "settings";
  }

  console.log("Page found:", page);
  console.log(
    "setActivePage:",
    typeof setActivePage
  );

  if (page) {
    setActivePage(page);

    setSearchTerm("");
    setSearchError("");

    setNotificationsOpen(false);
    setAdminOpen(false);
  } else {
    setSearchError(
      `No section found for "${searchTerm}"`
    );
  }
}

  /* =====================================================
     CTRL + K SEARCH SHORTCUT
  ===================================================== */

  useEffect(() => {
    const handleKeyboardShortcut = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        searchInputRef.current?.focus();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboardShortcut
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboardShortcut
      );
    };
  }, []);

  /* =====================================================
     FULLSCREEN
  ===================================================== */

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error(
        "Fullscreen error:",
        error
      );
    }
  };

  useEffect(() => {
    const fullscreenChange = () => {
      setIsFullscreen(
        Boolean(document.fullscreenElement)
      );
    };

    document.addEventListener(
      "fullscreenchange",
      fullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        fullscreenChange
      );
    };
  }, []);

  /* =====================================================
     THEME
  ===================================================== */

  const handleTheme = () => {
    setLightMode((previous) => {
      const nextMode = !previous;

      document.body.classList.toggle(
        "light-mode",
        nextMode
      );

      return nextMode;
    });
  };

  /* =====================================================
     ADMIN PROFILE
  ===================================================== */

  const handleProfile = () => {
  setAdminOpen(false);
  setNotificationsOpen(false);

  if (setActivePage) {
    setActivePage("admin-profile");
  }
};

  /* =====================================================
     ACCOUNT SETTINGS
  ===================================================== */

  const handleAccountSettings = () => {
    setAdminOpen(false);

    if (setActivePage) {
      setActivePage("settings");
    }
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
  setAdminOpen(false);
  setNotificationsOpen(false);

  if (onLogout) {
    onLogout();
  }
};

  /* =====================================================
     UI
  ===================================================== */

  return (
    <header className="top-navbar">

      {/* =================================================
          LEFT
      ================================================= */}

      <div className="navbar-left">

        <button
          type="button"
          className="navbar-menu-btn"
          title="Toggle sidebar"
          onClick={toggleSidebar}
        >
          <FiMenu />
        </button>

        <div className="navbar-title">

          <h2>Dashboard</h2>

          <span>
            Fraud Detection Control Center
          </span>

        </div>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="navbar-search">

        <FiSearch
          className="search-icon"
          onClick={handleSearch}
          style={{
            cursor: "pointer",
          }}
        />

        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search transactions, cards, users..."
          value={searchTerm}
          onChange={(event) => {
            console.log("Typing:", event.target.value);
            setSearchTerm(
              event.target.value
            );

            setSearchError("");
          }}
          onKeyDown={(event) => {
            console.log("Key pressed:", event.key);
            if (event.key === "Enter") {
              console.log("ENTER PRESSED");
              handleSearch();
            }

            if (event.key === "Escape") {
              setSearchTerm("");
              setSearchError("");

              event.currentTarget.blur();
            }
          }}
        />

        <span
          className="search-shortcut"
          onClick={() =>
            searchInputRef.current?.focus()
          }
          style={{
            cursor: "pointer",
          }}
        >
          Ctrl K
        </span>

        {/* SEARCH ERROR */}

        {searchError && (
          <div className="navbar-search-error">
            {searchError}
          </div>
        )}

      </div>

      {/* =================================================
          RIGHT
      ================================================= */}

      <div className="navbar-actions">

        {/* THEME */}

        <button
          type="button"
          className="navbar-icon-btn"
          title={
            lightMode
              ? "Dark mode"
              : "Light mode"
          }
          onClick={handleTheme}
        >
          {lightMode ? (
            <FiSun />
          ) : (
            <FiMoon />
          )}
        </button>

        {/* FULLSCREEN */}

        <button
          type="button"
          className="navbar-icon-btn"
          title={
            isFullscreen
              ? "Exit fullscreen"
              : "Fullscreen"
          }
          onClick={handleFullscreen}
        >
          {isFullscreen ? (
            <FiMinimize />
          ) : (
            <FiMaximize />
          )}
        </button>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <div className="notification-wrapper">

          <button
            type="button"
            className="navbar-icon-btn notification-btn"
            title="Notifications"
            onClick={() => {
              setNotificationsOpen(
                (previous) => !previous
              );

              setAdminOpen(false);
            }}
          >
            <FiBell />

            {activeAlerts.length > 0 && (
              <span className="notification-count">
                {activeAlerts.length > 9
                  ? "9+"
                  : activeAlerts.length}
              </span>
            )}

          </button>

          {notificationsOpen && (

            <div className="notification-dropdown">

              {/* HEADER */}

              <div className="notification-header">

                <div>

                  <strong>
                    Notifications
                  </strong>

                  <p>
                    Recent fraud activity
                  </p>

                </div>

                <span>
                  {activeAlerts.length} Active
                </span>

              </div>

              {/* ALERTS */}

              {recentAlerts.length > 0 ? (

                recentAlerts.map((alert) => {

                  const resolved =
                    alert.status?.toUpperCase() ===
                    "RESOLVED";

                  return (

                    <div
                      className="notification-item"
                      key={alert.id}
                    >

                      <div
                        className={`notification-symbol ${
                          resolved
                            ? "success"
                            : "danger"
                        }`}
                      >

                        {resolved ? (
                          <FiCheckCircle />
                        ) : (
                          <FiAlertTriangle />
                        )}

                      </div>

                      <div>

                        <strong>
                          {alert.message ||
                            "Fraud Alert"}
                        </strong>

                        <p>
                          {alert.transaction
                            ?.merchant ||
                            "Transaction"}

                          {" • Fraud Score: "}

                          {alert.transaction
                            ?.fraudScore ?? 0}
                        </p>

                        <small>
                          {alert.alertTime
                            ? new Date(
                                alert.alertTime
                              ).toLocaleString()
                            : "Recently"}
                        </small>

                      </div>

                    </div>

                  );
                })

              ) : (

                <div className="notification-empty">

                  <FiCheckCircle />

                  <strong>
                    No notifications
                  </strong>

                  <p>
                    No fraud alerts available.
                  </p>

                </div>

              )}

            </div>

          )}

        </div>

        <div className="navbar-divider"></div>

        {/* =================================================
            ADMIN
        ================================================= */}

        <div className="admin-wrapper">

          <button
            type="button"
            className="admin-profile"
            onClick={() => {
              setAdminOpen(
                (previous) => !previous
              );

              setNotificationsOpen(false);
            }}
          >

            <div className="admin-avatar">

              A

              <span className="admin-online"></span>

            </div>

            <div className="admin-info">
              <strong>
                {admin?.name || "Admin"}
              </strong>

              <span>
                {admin?.role === "SUPER_ADMIN"
                  ? "Super Admin"
                  : admin?.role || "Admin"}
              </span>
            </div>

            <FiChevronDown
              className={`admin-chevron ${
                adminOpen
                  ? "admin-chevron-open"
                  : ""
              }`}
            />

          </button>

          {/* ADMIN DROPDOWN */}

          {adminOpen && (

            <div className="admin-dropdown">

              <div className="admin-dropdown-header">

                <div className="admin-dropdown-avatar">
                  {admin?.name
                    ? admin.name.charAt(0).toUpperCase()
                    : "A"}
                </div>

                <div>
                  <strong>
                    {admin?.name || "Admin"}
                  </strong>

                  <span>
                    {admin?.email || "Administrator"}
                  </span>
                </div>

              </div>

              <div className="admin-dropdown-divider"></div>

              {/* PROFILE */}

              <button
                type="button"
                onClick={handleProfile}
              >
                <FiUser />

                <span>
                  My Profile
                </span>
              </button>

              {/* SETTINGS */}

              <button
                type="button"
                onClick={handleAccountSettings}
              >
                <FiSettings />

                <span>
                  Account Settings
                </span>
              </button>

              <div className="admin-dropdown-divider"></div>

              {/* LOGOUT */}

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                <FiLogOut />

                <span>
                  Logout
                </span>
              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;