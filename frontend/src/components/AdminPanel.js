import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../constants";
import Navbar from "./Navbar";
import "../index.css";

function AdminPanel({ account }) {
  const navigate = useNavigate();
  const [votingStatus, setVotingStatus] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");

  const getContract = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed.");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, ABI, signer);
  };

  const startVoting = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.startVoting();
      await tx.wait();
      setErrorMessage(""); 
      checkVotingStatus();
      alert("Voting has started!");
    } catch (error) {
      console.error("Error starting voting:", error);
      setErrorMessage(error.reason || "Failed to start voting.");
    }
  };

  const endVoting = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.endVoting();
      await tx.wait();
      setErrorMessage(""); 
      checkVotingStatus();
      alert("Voting has ended!");
    } catch (error) {
      console.error("Error ending voting:", error);
      setErrorMessage(error.reason || "Failed to end voting.");
    }
  };

  const checkVotingStatus = async () => {
    try {
      const contract = await getContract();
      const votingStarted = await contract.votingStarted();
      const votingEnded = await contract.votingEnded();

      if (!votingStarted && !votingEnded) {
        setVotingStatus(""); 
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

  useEffect(() => {
    checkVotingStatus();
  }, []);

  return (
    <div style={styles.container}>
      <Navbar /> {/* Use Navbar here */}
      <div style={styles.content}>
        {/* Logo above Admin Dashboard */}
        <div style={styles.logoContainer}>
          <img src="/logo.png" alt="Logo" style={styles.logo} />
        </div>

        <h1 style={styles.pageTitle}>ADMIN DASHBOARD</h1>
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
    backgroundImage: "linear-gradient(135deg, #D5B4F2, #9C27B0)",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Roboto', sans-serif",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    padding: "30px 40px",
    textAlign: "center",
    backgroundImage: "linear-gradient(135deg, #D5B4F2, #9C27B0)",
    borderRadius: "15px",
  },
  logoContainer: {
    marginBottom: "20px", // Space between the logo and the title
  },
  logo: {
    width: "140px", // Adjust the size of the logo
    height: "140px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  pageTitle: {
    fontSize: "2.4rem",
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: "20px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  },
  address: {
    fontSize: "1.1rem",
    color: "#4B0082",
    marginBottom: "20px",
    fontWeight: "bold",
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
