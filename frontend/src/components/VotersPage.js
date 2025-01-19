import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../constants";

function VotersPage({ account }) {
  const navigate = useNavigate();
  const [newVoter, setNewVoter] = useState({
    address: "",
    nationalID: "",
    votingArea: "",
  });
  const [message, setMessage] = useState("");
  const [voters, setVoters] = useState([]);

  // Function to get the contract instance
  const getContract = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, ABI, signer);
  };

  // Register a new voter
  const registerVoter = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.registerVoter(
        newVoter.address,
        newVoter.nationalID,
        newVoter.votingArea
      );
      await tx.wait();
      setMessage({
        text: "Voter registered successfully!",
        type: "success",
      });
      setNewVoter({ address: "", nationalID: "", votingArea: "" }); // Reset form
      fetchVoters(); // Refresh voters list
    } catch (error) {
      console.error("Error registering voter:", error);
      setMessage({
        text: error.reason || "Failed to register voter.",
        type: "error",
      });
    }
  };

  // Fetch all registered voters
  const fetchVoters = async () => {
    try {
      const contract = await getContract();
      const voterAddresses = await contract.getAllVoters();
      const votersList = await Promise.all(
        voterAddresses.map(async (address) => {
          const voter = await contract.voters(address);
          return {
            address,
            nationalID: voter.nationalID,
            votingArea: voter.votingArea,
          };
        })
      );
      setVoters(votersList);
    } catch (error) {
      console.error("Error fetching voters:", error);
      setMessage({
        text: "Failed to fetch voters.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.navbar}>
        <div style={styles.logoContainer}>
          <img src="/logo.png" alt="Logo" style={styles.logo} />
          <span style={styles.logoTitle}>Admin Dashboard</span>
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

      {/* Content */}
      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Register Voter</h2>
        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Voter Address</label>
            <input
              type="text"
              placeholder="0x123..."
              value={newVoter.address}
              onChange={(e) => setNewVoter({ ...newVoter, address: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>National ID</label>
            <input
              type="text"
              placeholder="12-digit ID"
              value={newVoter.nationalID}
              onChange={(e) => setNewVoter({ ...newVoter, nationalID: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Voting Area</label>
            <input
              type="text"
              placeholder="Area Name"
              value={newVoter.votingArea}
              onChange={(e) => setNewVoter({ ...newVoter, votingArea: e.target.value })}
              style={styles.input}
            />
          </div>
          <button style={styles.button} onClick={registerVoter}>
            Register Voter
          </button>
        </div>

        {message.text && (
          <p
            style={{
              ...styles.message,
              color: message.type === "success" ? "green" : "red",
            }}
          >
            {message.text}
          </p>
        )}

        <h2 style={styles.sectionTitle}>Registered Voters</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Address</th>
              <th style={styles.tableHeader}>National ID</th>
              <th style={styles.tableHeader}>Voting Area</th>
            </tr>
          </thead>
          <tbody>
            {voters.map((voter, index) => (
              <tr key={index} style={styles.tableRow}>
                <td style={styles.tableCell}>{voter.address}</td>
                <td style={styles.tableCell}>{voter.nationalID}</td>
                <td style={styles.tableCell}>{voter.votingArea}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#D5B4F2",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Roboto', sans-serif",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#5A00A6",
    padding: "10px 20px",
    color: "#FFF",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  logoTitle: {
    fontSize: "1.8rem",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    gap: "20px",
  },
  navItem: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#FFF",
    cursor: "pointer",
    transition: "color 0.3s ease",
  },
  content: {
    flexGrow: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    color: "#4B0082",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
    maxWidth: "400px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#4B0082",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #4B0082",
    width: "100%",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#FFF",
    backgroundColor: "#731EBE",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  table: {
    width: "100%",
    maxWidth: "800px", // Center the table and limit the width
    margin: "20px auto", // Add spacing from other elements
    borderCollapse: "collapse",
    backgroundColor: "#FFF", // White background for contrast
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for a professional look
  },
  tableHeader: {
    backgroundColor: "#731EBE", // Match the button color
    color: "#FFF", // White text for better contrast
    textAlign: "center",
    fontWeight: "bold",
    padding: "10px",
  },
  tableRow: {
    textAlign: "center",
    borderBottom: "1px solid #DDD", // Subtle row separation
  },
  tableCell: {
    padding: "10px",
    fontSize: "1rem",
    color: "#4B0082", // Text color to match the theme
  },
  
  message: {
    marginTop: "20px",
    fontSize: "1rem",
    fontWeight: "bold",
  },
};

export default VotersPage;
