import { useEffect, useState } from "react";
import api from "../services/api";

import {
  FiSettings,
  FiBell,
  FiShield,
  FiAlertTriangle,
  FiMonitor,
  FiDatabase,
  FiCheckCircle,
  FiRefreshCw,
  FiSave,
  FiInfo,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

function Settings({ admin }) {
  const defaultSettings = {
    fraudAlerts: true,
    suspiciousAlerts: true,
    systemNotifications: true,
    soundNotifications: false,
    autoRefresh: true,
    highRiskMonitoring: true,
  };

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem(
      "fraudshield-settings"
    );

    if (savedSettings) {
      try {
        return {
          ...defaultSettings,
          ...JSON.parse(savedSettings),
        };
      } catch {
        return defaultSettings;
      }
    }

    return defaultSettings;
  });

  const [saved, setSaved] = useState(false);

  /* =====================================================
     PASSWORD STATE
  ===================================================== */

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* =====================================================
     UPDATE SETTING
  ===================================================== */

  const toggleSetting = (settingName) => {
    setSettings((previous) => ({
      ...previous,
      [settingName]: !previous[settingName],
    }));

    setSaved(false);
  };

  /* =====================================================
     SAVE SETTINGS
  ===================================================== */

  const handleSave = () => {
    localStorage.setItem(
      "fraudshield-settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  /* =====================================================
     RESET SETTINGS
  ===================================================== */

  const handleReset = () => {
    setSettings(defaultSettings);

    localStorage.setItem(
      "fraudshield-settings",
      JSON.stringify(defaultSettings)
    );

    setSaved(false);
  };

  /* =====================================================
     PASSWORD INPUT
  ===================================================== */

  const handlePasswordInput = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordMessage("");
    setPasswordError("");
  };

  /* =====================================================
     CHANGE PASSWORD
  ===================================================== */

  const handleChangePassword = async (event) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    const currentPassword =
      passwordData.currentPassword.trim();

    const newPassword =
      passwordData.newPassword.trim();

    const confirmPassword =
      passwordData.confirmPassword.trim();

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please complete all password fields."
      );

      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must contain at least 8 characters."
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );

      return;
    }

    if (!admin?.email) {
      setPasswordError(
        "Administrator information is unavailable. Please log in again."
      );

      return;
    }

    try {
      setPasswordLoading(true);

      const response = await api.put(
        "/api/admin/change-password",
        {
          email: admin.email,
          currentPassword,
          newPassword,
        }
      );

      setPasswordMessage(
        response.data?.message ||
          "Password changed successfully."
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setPasswordError(
        error.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    setSaved(false);
  }, []);

  return (
    <div className="settings-page">

      {/* ================= HEADER ================= */}

      <div className="settings-header">
        <div>
          <p className="settings-eyebrow">
            SYSTEM CONFIGURATION
          </p>

          <h1>Settings</h1>

          <p className="settings-description">
            Configure FraudShield notifications,
            monitoring preferences, security and
            system behaviour.
          </p>
        </div>

        <button
          type="button"
          className="settings-save-button"
          onClick={handleSave}
        >
          {saved ? (
            <>
              <FiCheckCircle />
              Saved
            </>
          ) : (
            <>
              <FiSave />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* ================= SAVED MESSAGE ================= */}

      {saved && (
        <div className="settings-success-message">
          <FiCheckCircle />

          <span>
            Your FraudShield settings have been saved.
          </span>
        </div>
      )}

      <div className="settings-layout">

        {/* =================================================
            LEFT COLUMN
        ================================================= */}

        <div className="settings-main-column">

          {/* NOTIFICATIONS */}

          <SettingsSection
            icon={<FiBell />}
            title="Notifications"
            description="Choose which FraudShield events should generate notifications."
          >
            <SettingToggle
              icon={<FiShield />}
              title="Fraud Alerts"
              description="Receive notifications when a fraudulent transaction is detected."
              enabled={settings.fraudAlerts}
              onChange={() =>
                toggleSetting("fraudAlerts")
              }
              type="danger"
            />

            <SettingToggle
              icon={<FiAlertTriangle />}
              title="Suspicious Transaction Alerts"
              description="Receive notifications for transactions requiring additional review."
              enabled={settings.suspiciousAlerts}
              onChange={() =>
                toggleSetting("suspiciousAlerts")
              }
              type="warning"
            />

            <SettingToggle
              icon={<FiBell />}
              title="System Notifications"
              description="Receive important FraudShield system and service notifications."
              enabled={settings.systemNotifications}
              onChange={() =>
                toggleSetting(
                  "systemNotifications"
                )
              }
              type="blue"
            />

            <SettingToggle
              icon={<FiMonitor />}
              title="Notification Sounds"
              description="Play a sound when an important fraud notification is received."
              enabled={settings.soundNotifications}
              onChange={() =>
                toggleSetting(
                  "soundNotifications"
                )
              }
              type="purple"
            />
          </SettingsSection>

          {/* FRAUD MONITORING */}

          <SettingsSection
            icon={<FiShield />}
            title="Fraud Monitoring"
            description="Configure monitoring behaviour for the fraud detection dashboard."
          >
            <SettingToggle
              icon={<FiRefreshCw />}
              title="Automatic Dashboard Refresh"
              description="Allow FraudShield dashboards to refresh monitoring information automatically."
              enabled={settings.autoRefresh}
              onChange={() =>
                toggleSetting("autoRefresh")
              }
              type="blue"
            />

            <SettingToggle
              icon={<FiAlertTriangle />}
              title="High-Risk Monitoring"
              description="Highlight high-risk transactions requiring administrator attention."
              enabled={settings.highRiskMonitoring}
              onChange={() =>
                toggleSetting(
                  "highRiskMonitoring"
                )
              }
              type="danger"
            />
          </SettingsSection>

          {/* =================================================
              SECURITY / CHANGE PASSWORD
          ================================================= */}

          <section className="settings-section">

            <div className="settings-section-header">

              <div className="settings-section-icon">
                <FiLock />
              </div>

              <div>
                <h2>Security</h2>

                <p>
                  Manage administrator password
                  and account security.
                </p>
              </div>

            </div>

            <form
              className="change-password-form"
              onSubmit={handleChangePassword}
            >

              <div className="password-account-info">
                <FiShield />

                <div>
                  <span>
                    Administrator Account
                  </span>

                  <strong>
                    {admin?.email ||
                      "Administrator"}
                  </strong>
                </div>
              </div>

              {/* CURRENT PASSWORD */}

              <div className="password-form-group">

                <label htmlFor="currentPassword">
                  Current Password
                </label>

                <div className="password-input-wrapper">

                  <FiLock className="password-input-icon" />

                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordData.currentPassword
                    }
                    onChange={handlePasswordInput}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-eye-button"
                    onClick={() =>
                      setShowCurrentPassword(
                        (previous) => !previous
                      )
                    }
                  >
                    {showCurrentPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>

              </div>

              {/* NEW PASSWORD */}

              <div className="password-form-group">

                <label htmlFor="newPassword">
                  New Password
                </label>

                <div className="password-input-wrapper">

                  <FiLock className="password-input-icon" />

                  <input
                    id="newPassword"
                    name="newPassword"
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordData.newPassword
                    }
                    onChange={handlePasswordInput}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-eye-button"
                    onClick={() =>
                      setShowNewPassword(
                        (previous) => !previous
                      )
                    }
                  >
                    {showNewPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>

                <small>
                  Password must contain at least
                  8 characters.
                </small>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="password-form-group">

                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>

                <div className="password-input-wrapper">

                  <FiLock className="password-input-icon" />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={handlePasswordInput}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-eye-button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>

              </div>

              {/* ERROR */}

              {passwordError && (
                <div className="password-error-message">
                  <FiAlertTriangle />
                  {passwordError}
                </div>
              )}

              {/* SUCCESS */}

              {passwordMessage && (
                <div className="password-success-message">
                  <FiCheckCircle />
                  {passwordMessage}
                </div>
              )}

              <button
                type="submit"
                className="change-password-button"
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <>
                    <FiRefreshCw />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <FiLock />
                    Change Password
                  </>
                )}
              </button>

            </form>

          </section>

        </div>

        {/* =================================================
            RIGHT COLUMN
        ================================================= */}

        <div className="settings-side-column">

          {/* SYSTEM STATUS */}

          <section className="settings-side-card">

            <div className="settings-side-heading">

              <div className="settings-side-icon green">
                <FiShield />
              </div>

              <div>
                <h3>System Status</h3>
                <p>FraudShield services</p>
              </div>

            </div>

            <div className="settings-status-list">

              <StatusRow
                name="Fraud Engine"
                status="Operational"
              />

              <StatusRow
                name="Database"
                status="Connected"
              />

              <StatusRow
                name="Alert Service"
                status="Active"
              />

              <StatusRow
                name="Customer Support"
                status="Active"
              />

            </div>

          </section>

          {/* SYSTEM INFORMATION */}

          <section className="settings-side-card">

            <div className="settings-side-heading">

              <div className="settings-side-icon blue">
                <FiInfo />
              </div>

              <div>
                <h3>System Information</h3>
                <p>Application details</p>
              </div>

            </div>

            <div className="settings-info-list">

              <InfoRow
                name="Application"
                value="FraudShield"
              />

              <InfoRow
                name="System"
                value="Rule-Based Fraud Detection"
              />

              <InfoRow
                name="Frontend"
                value="React"
              />

              <InfoRow
                name="Backend"
                value="Spring Boot"
              />

              <InfoRow
                name="Database"
                value="MySQL"
              />

            </div>

          </section>

          {/* DATABASE */}

          <section className="settings-side-card settings-database-card">

            <div className="settings-database-icon">
              <FiDatabase />
            </div>

            <div>
              <span>
                Database Connection
              </span>

              <strong>
                <span className="settings-online-dot">
                </span>

                Connected
              </strong>

              <p>
                FraudShield database services
                are available.
              </p>
            </div>

          </section>

          {/* RESET */}

          <button
            type="button"
            className="settings-reset-button"
            onClick={handleReset}
          >
            <FiRefreshCw />
            Reset to Defaults
          </button>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   SETTINGS SECTION
===================================================== */

function SettingsSection({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section className="settings-section">

      <div className="settings-section-header">

        <div className="settings-section-icon">
          {icon}
        </div>

        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

      </div>

      <div className="settings-options">
        {children}
      </div>

    </section>
  );
}

/* =====================================================
   TOGGLE
===================================================== */

function SettingToggle({
  icon,
  title,
  description,
  enabled,
  onChange,
  type,
}) {
  return (
    <div className="settings-option">

      <div className="settings-option-content">

        <div
          className={`settings-option-icon ${type}`}
        >
          {icon}
        </div>

        <div>
          <strong>{title}</strong>
          <p>{description}</p>
        </div>

      </div>

      <button
        type="button"
        className={`settings-toggle ${
          enabled ? "enabled" : ""
        }`}
        onClick={onChange}
        aria-pressed={enabled}
      >
        <span></span>
      </button>

    </div>
  );
}

/* =====================================================
   STATUS ROW
===================================================== */

function StatusRow({ name, status }) {
  return (
    <div className="settings-status-row">

      <span>{name}</span>

      <strong>
        <span className="settings-status-dot">
        </span>

        {status}
      </strong>

    </div>
  );
}

/* =====================================================
   INFO ROW
===================================================== */

function InfoRow({ name, value }) {
  return (
    <div className="settings-info-row">
      <span>{name}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default Settings;