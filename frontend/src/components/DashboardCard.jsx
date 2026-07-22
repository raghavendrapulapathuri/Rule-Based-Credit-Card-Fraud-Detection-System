import { useState } from "react";

function DashboardCard(props) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "220px",
        height: "180px",
        background: "#1E1E1E",
        borderRadius: "12px",
        border: "2px solid #FFD700",
        boxShadow: hover
          ? "0px 0px 25px rgba(255,215,0,0.7)"
          : "0px 4px 12px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hover ? "translateY(-8px)" : "translateY(0px)",
      }}
    >
      <div
        style={{
          color: "#FFD700",
          fontSize: "45px",
          marginBottom: "12px",
        }}
      >
        {props.icon}
      </div>

      <h3
        style={{
          color: "#FFD700",
          margin: "0",
        }}
      >
        {props.title}
      </h3>

      <h1
        style={{
          color: "#FFD700",
          marginTop: "15px",
          fontSize: "45px",
        }}
      >
        {props.value}
      </h1>
    </div>
  );
}

export default DashboardCard;