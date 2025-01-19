import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../constants";

function AdminPanel({ account }) {
  const navigate = useNavigate();
  const [votingStatus, setVotingStatus] = useState(""); // Updated to manage conditional status messages
  const [errorMessage, setErrorMessage] = useState(""); // To display error messages for admin actions

  // Function to get the contract instance
  const getContract = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed.");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, ABI, signer);
  };

  // Start Voting
  const startVoting = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.startVoting();
      await tx.wait();
      setErrorMessage(""); // Clear error message
      checkVotingStatus(); // Update status after action
      alert("Voting has started!");
    } catch (error) {
      console.error("Error starting voting:", error);
      setErrorMessage(error.reason || "Failed to start voting.");
    }
  };

  // End Voting
  const endVoting = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.endVoting();
      await tx.wait();
      setErrorMessage(""); // Clear error message
      checkVotingStatus(); // Update status after action
      alert("Voting has ended!");
    } catch (error) {
      console.error("Error ending voting:", error);
      setErrorMessage(error.reason || "Failed to end voting.");
    }
  };

  // Check Voting Status
  const checkVotingStatus = async () => {
    try {
      const contract = await getContract();
      const votingStarted = await contract.votingStarted();
      const votingEnded = await contract.votingEnded();

      // Set voting status based on the conditions
      if (!votingStarted && !votingEnded) {
        setVotingStatus(""); // Don't display anything
      } else if (votingStarted && !votingEnded) {
        setVotingStatus("Voting has started.");
      } else if (votingStarted && votingEnded) {
        setVotingStatus("Voting has ended.");
      }
    } catch (error) {
      console.error("Error fetching voting status:", error);
      setVotingStatus("Error fetching voting status.");
    }
  };

  // Fetch initial voting status
  useEffect(() => {
    checkVotingStatus();
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
        <p style={styles.address}>
          <strong>Your Address:</strong> {account}
        </p>
        <div style={styles.controlSection}>
          <button style={styles.controlButton} onClick={startVoting}>
            Start Voting
          </button>
          <button style={styles.controlButton} onClick={endVoting}>
            End Voting
          </button>
        </div>
        {votingStatus && (
          <div style={styles.statusSection}>
            <h2 style={styles.statusTitle}>Voting Status</h2>
            <p style={styles.statusText}>{votingStatus}</p>
          </div>
        )}
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
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
    backgroundColor: "#5A00A6", // Darker purple for the header
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
    borderRadius: "50%", // Make the logo round
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    padding: "20px",
    textAlign: "center",
  },
  address: {
    fontSize: "1rem",
    color: "#4B0082",
    marginBottom: "20px",
  },
  controlSection: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },
  controlButton: {
    backgroundColor: "#731EBE",
    color: "#FFF",
    padding: "15px 40px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
  },
  statusSection: {
    textAlign: "center",
    marginTop: "20px",
  },
  statusTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: "10px",
  },
  statusText: {
    fontSize: "1.2rem",
    color: "#333",
  },
  error: {
    fontSize: "1rem",
    color: "red",
    marginTop: "10px",
  },
};

export default AdminPanel;
