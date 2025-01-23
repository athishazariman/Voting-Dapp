// VotersPage.js
import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../constants";
import Navbar from "./Navbar"; // Import Navbar

function VotersPage({ account }) {
  const [newVoter, setNewVoter] = useState({
    address: "",
    nationalID: "",
    votingArea: "",
  });
  const [message, setMessage] = useState("");
  const [voters, setVoters] = useState([]);

  const getContract = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, ABI, signer);
  };

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
      setNewVoter({ address: "", nationalID: "", votingArea: "" });
      fetchVoters();
    } catch (error) {
      console.error("Error registering voter:", error);
      setMessage({
        text: error.reason || "Failed to register voter.",
        type: "error",
      });
    }
  };

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
      <Navbar /> {/* Use Navbar component here */}

      {/* Content */}
      <div style={styles.content}>
        <h1 style={styles.pageTitle}>Voter Registration</h1>

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Voter Address</label>
            <input
              type="text"
              placeholder="Enter Voter Address"
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

        {voters.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Index</th>
                <th style={styles.tableHeader}>Address</th>
                <th style={styles.tableHeader}>National ID</th>
                <th style={styles.tableHeader}>Voting Area</th>
              </tr>
            </thead>
            <tbody>
              {voters.map((voter, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td style={styles.tableCell}>{index + 1}</td>
                  <td style={styles.tableCell}>{voter.address}</td>
                  <td style={styles.tableCell}>{voter.nationalID}</td>
                  <td style={styles.tableCell}>{voter.votingArea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.noVotersMessage}>No voters registered yet.</p> 
        )}
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
  pageTitle: {
    fontSize: "2.4rem",
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: "20px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
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
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#4B0082",
    margin: "20px 0",
  },
  message: {
    fontSize: "1rem",
    fontWeight: "bold",
    padding: "10px",
    borderRadius: "5px",
    marginTop: "15px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    padding: "12px 15px",
    backgroundColor: "#5A00A6",
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "left",
  },
  tableRow: {
    backgroundColor: "#F5F5F5",
    transition: "background-color 0.3s ease",
  },
  tableCell: {
    padding: "12px 15px",
    borderBottom: "1px solid #ddd",
  },
  noVotersMessage: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#9C27B0",
    marginTop: "20px",
    fontStyle: "italic",
  },
};

export default VotersPage;
