import { useEffect, useState } from "react";
import api from "../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users")
      .then((response) => {
        console.log("Users API Response:", response.data);

        // Make sure the response is an array
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error(
            "Users API did not return an array:",
            response.data
          );
          setUsers([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setUsers([]);
        setLoading(false);
      });
  }, []);

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
          marginBottom: "30px",
        }}
      >
        Users Management
      </h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div
          style={{
            background: "#111827",
            border: "1px solid #FFD700",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#000000",
                  color: "#FFD700",
                }}
              >
                <th style={tableHeader}>ID</th>
                <th style={tableHeader}>Full Name</th>
                <th style={tableHeader}>Email</th>
                <th style={tableHeader}>Phone Number</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td style={tableCell}>{user.id}</td>

                    <td style={tableCell}>
                      {user.fullName || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {user.email || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {user.phoneNumber || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "25px",
                    }}
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const tableHeader = {
  padding: "15px",
  textAlign: "left",
  borderBottom: "1px solid #FFD700",
};

const tableCell = {
  padding: "15px",
  borderBottom: "1px solid #334155",
};

export default Users;