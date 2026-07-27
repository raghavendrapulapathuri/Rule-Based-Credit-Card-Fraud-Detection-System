import {
  FiUser,
  FiMail,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

function AdminProfile({ admin }) {
  const getInitial = () => {
    if (admin?.name) {
      return admin.name
        .charAt(0)
        .toUpperCase();
    }

    return "A";
  };

  const formatRole = (role) => {
    if (role === "SUPER_ADMIN") {
      return "Super Administrator";
    }

    return role || "Administrator";
  };

  return (
    <div className="admin-profile-page">

      {/* PAGE HEADER */}

      <div className="admin-profile-page-header">

        <div>
          <span className="page-eyebrow">
            ADMINISTRATION
          </span>

          <h1>My Profile</h1>

          <p>
            View your administrator account
            information and access details.
          </p>
        </div>

        <div className="profile-status-badge">
          <FiCheckCircle />
          Active Account
        </div>

      </div>

      {/* PROFILE CARD */}

      <div className="profile-main-card">

        <div className="profile-banner"></div>

        <div className="profile-header-content">

          <div className="profile-large-avatar">
            {getInitial()}

            <span className="profile-online-dot">
            </span>
          </div>

          <div className="profile-name-section">

            <h2>
              {admin?.name || "Admin"}
            </h2>

            <span>
              {formatRole(admin?.role)}
            </span>

          </div>

        </div>

        {/* INFORMATION */}

        <div className="profile-information">

          <h3>Account Information</h3>

          <p className="profile-section-description">
            Administrator details associated
            with this FraudShield account.
          </p>

          <div className="profile-info-grid">

            {/* NAME */}

            <div className="profile-info-item">

              <div className="profile-info-icon">
                <FiUser />
              </div>

              <div>
                <span>Full Name</span>

                <strong>
                  {admin?.name || "Admin"}
                </strong>
              </div>

            </div>

            {/* EMAIL */}

            <div className="profile-info-item">

              <div className="profile-info-icon">
                <FiMail />
              </div>

              <div>
                <span>Email Address</span>

                <strong>
                  {admin?.email ||
                    "Not available"}
                </strong>
              </div>

            </div>

            {/* ROLE */}

            <div className="profile-info-item">

              <div className="profile-info-icon">
                <FiShield />
              </div>

              <div>
                <span>Account Role</span>

                <strong>
                  {formatRole(admin?.role)}
                </strong>
              </div>

            </div>

            {/* ADMIN ID */}

            <div className="profile-info-item">

              <div className="profile-info-icon">
                <FiUser />
              </div>

              <div>
                <span>Administrator ID</span>

                <strong>
                  #{admin?.id || "N/A"}
                </strong>
              </div>

            </div>

          </div>

        </div>

        {/* SECURITY */}

        <div className="profile-security-section">

          <div className="profile-security-icon">
            <FiShield />
          </div>

          <div>
            <strong>
              Administrator Access
            </strong>

            <p>
              This account has authorized
              access to the FraudShield
              fraud detection control center.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminProfile;