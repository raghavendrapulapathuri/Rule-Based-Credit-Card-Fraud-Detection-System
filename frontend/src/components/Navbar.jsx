import { useEffect, useState } from "react";
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

function Navbar({ toggleSidebar }) {
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [adminOpen, setAdminOpen] = useState(false);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const [lightMode, setLightMode] =
    useState(false);

  const [alerts, setAlerts] = useState([]);

  /* =========================
     FETCH ALERTS
  ========================= */

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

  const activeAlerts = alerts.filter(
    (alert) =>
      alert.status?.toUpperCase() !==
      "RESOLVED"
  );

  const recentAlerts = [...alerts]
    .sort(
      (a, b) =>
        new Date(b.alertTime || 0) -
        new Date(a.alertTime || 0)
    )
    .slice(0, 3);

  /* =========================
     FULLSCREEN
  ========================= */

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

  /* =========================
     THEME
  ========================= */

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

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    /*
      Later, when authentication is implemented,
      we will remove JWT/session information here
      and redirect to the login page.
    */

    setAdminOpen(false);

    alert(
      "Logout will be connected after authentication is added."
    );
  };

  return (
    <header className="top-navbar">

      {/* LEFT */}

      <div className="navbar-left">

        <button
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

      {/* SEARCH */}

      <div className="navbar-search">

        <FiSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search transactions, cards, users..."
        />

        <span className="search-shortcut">
          ⌘ K
        </span>

      </div>

      {/* RIGHT */}

      <div className="navbar-actions">

        {/* THEME */}

        <button
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

        {/* =====================
            NOTIFICATIONS
        ====================== */}

        <div className="notification-wrapper">

          <button
            className="navbar-icon-btn notification-btn"
            title="Notifications"
            onClick={() => {
              setNotificationsOpen(
                !notificationsOpen
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
                            "Transaction"}{" "}
                          • Fraud Score:{" "}
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

        {/* =====================
            ADMIN
        ====================== */}

        <div className="admin-wrapper">

          <button
            className="admin-profile"
            onClick={() => {
              setAdminOpen(!adminOpen);
              setNotificationsOpen(false);
            }}
          >

            <div className="admin-avatar">
              A
              <span className="admin-online"></span>
            </div>

            <div className="admin-info">
              <strong>Admin</strong>
              <span>Super Admin</span>
            </div>

            <FiChevronDown
              className={`admin-chevron ${
                adminOpen
                  ? "admin-chevron-open"
                  : ""
              }`}
            />

          </button>

          {adminOpen && (

            <div className="admin-dropdown">

              <div className="admin-dropdown-header">

                <div className="admin-dropdown-avatar">
                  A
                </div>

                <div>
                  <strong>Admin</strong>
                  <span>Super Administrator</span>
                </div>

              </div>

              <div className="admin-dropdown-divider"></div>

              <button>
                <FiUser />
                <span>My Profile</span>
              </button>

              <button>
                <FiSettings />
                <span>Account Settings</span>
              </button>

              <div className="admin-dropdown-divider"></div>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                <FiLogOut />
                <span>Logout</span>
              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;