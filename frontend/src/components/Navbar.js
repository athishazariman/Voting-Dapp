import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header style={styles.navbar}>
      <div style={styles.navbarBrand}>
        <img src="/logo.png" alt="Logo" style={styles.navbarLogo} /> {/* Logo beside PollPal */}
        <span style={styles.navbarTitle}>PollPal</span>
      </div>
      <nav style={styles.navLinks}>
        <span style={styles.navItem} onClick={() => navigate("/")}>
          Main Page
        </span>
        <span style={styles.navItem} onClick={() => navigate("/admin/candidates")}>
          Candidates
        </span>
        <span style={styles.navItem} onClick={() => navigate("/admin/voters")}>
          Voters
        </span>
        <span style={styles.navItem} onClick={() => navigate("/admin")}>
          Voting Status
        </span>
      </nav>
    </header>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#5A00A6",
    padding: "10px 20px",
    color: "#FFF",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  navbarBrand: {
    display: "flex",
    alignItems: "center",
    gap: "10px", // Spacing between logo and title
  },
  navbarLogo: {
    width: "40px",
    height: "40px",
    borderRadius: "50%", // Smooth edges for navbar logo
    objectFit: "cover",
  },
  navbarTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  navLinks: {
    display: "flex",
    gap: "20px",
  },
  navItem: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#FFF",
    cursor: "pointer",
    padding: "10px",
  },
};

export default Navbar;
