import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../constants";

function VoterPanel() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(""); // Account address
  const [nationalID, setNationalID] = useState(""); // National ID input
  const [candidateIndex, setCandidateIndex] = useState(""); // Candidate index input
  const [candidates, setCandidates] = useState([]); // List of candidates
  const [votingArea, setVotingArea] = useState(""); // Voter's area
  const [message, setMessage] = useState(""); // Error or success messages
  const [isVerified, setIsVerified] = useState(false); // Whether the user is verified

  useEffect(() => {
    const initializeAccount = async () => {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    };

    initializeAccount();

    // Listen for MetaMask account changes
    window.ethereum.on("accountsChanged", (accounts) => {
      setAccount(accounts[0]);
      resetState();
    });

    return () => {
      window.ethereum.removeListener("accountsChanged", () => {});
    };
  }, []);

  const resetState = () => {
    setNationalID("");
    setCandidateIndex("");
    setCandidates([]);
    setVotingArea("");
    setMessage("");
    setIsVerified(false);
  };

  const getContract = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, ABI, signer);
  };

  const verifyNationalID = async () => {
    try {
      const contract = await getContract();
      const voter = await contract.voters(account);

      if (!voter.isRegistered) {
        setMessage("You are not registered to vote.");
        setIsVerified(false);
        return;
      }

      if (voter.nationalID !== nationalID) {
        setMessage("National ID does not match.");
        setIsVerified(false);
        return;
      }

      setVotingArea(voter.votingArea);
      setIsVerified(true);
      setMessage("National ID verified. You can now vote.");
      fetchCandidatesByArea(voter.votingArea);
    } catch (error) {
      console.error("Error verifying National ID:", error);
      setMessage("Error verifying National ID. Ensure you're registered.");
      setIsVerified(false);
    }
  };

  const fetchCandidatesByArea = async (area) => {
    try {
      const contract = await getContract();
      const areaCandidates = await contract.getCandidatesByArea(area);

      const formattedCandidates = areaCandidates.map((candidate, index) => ({
        index,
        name: candidate.name,
        nationalID: candidate.nationalID,
        votingArea: area,
        voteCount: candidate.voteCount,
      }));

      setCandidates(formattedCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setMessage("Failed to fetch candidates for this area.");
    }
  };

  const castVote = async () => {
    if (!candidateIndex || isNaN(candidateIndex) || candidateIndex < 0) {
      setMessage("Invalid candidate index.");
      return;
    }

    try {
      const contract = await getContract();
      const tx = await contract.castVote(nationalID, candidateIndex);
      await tx.wait();
      setMessage("Vote cast successfully!");
      fetchCandidatesByArea(votingArea);
    } catch (error) {
      console.error("Error casting vote:", error);
      setMessage(error.reason || "Failed to cast vote.");
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.navbar}>
        <div style={styles.logoContainer}>
          <img src="/logo.png" alt="Logo" style={styles.logo} />
          <span style={styles.logoTitle}>Voting Dapp</span>
        </div>
        <nav style={styles.navLinks}>
          <span style={styles.navItem} onClick={() => navigate("/")}>
            Main Page
          </span>
        </nav>
      </header>

      {/* Content */}
      <div style={styles.content}>
        <p style={styles.address}>
          <strong>Your Address:</strong> {account}
        </p>

        <div style={styles.form}>
          <h2 style={styles.sectionTitle}>Enter National ID</h2>
          <input
            type="text"
            placeholder="National ID"
            value={nationalID}
            onChange={(e) => setNationalID(e.target.value)}
            style={styles.input}
          />
          <button style={styles.button} onClick={verifyNationalID}>
            Verify
          </button>
        </div>

        {message && <p style={styles.message}>{message}</p>}

        {isVerified && (
          <>
            <div style={styles.form}>
              <h2 style={styles.sectionTitle}>Enter Candidate Index</h2>
              <input
                type="text"
                placeholder="Candidate Index"
                value={candidateIndex}
                onChange={(e) => setCandidateIndex(e.target.value)}
                style={styles.input}
              />
              <button style={styles.button} onClick={castVote}>
                Cast Vote
              </button>
            </div>

            <h2 style={styles.sectionTitle}>Candidates in {votingArea}</h2>
            <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableCell}>Index</th>
                <th style={styles.tableCell}>Name</th>
                <th style={styles.tableCell}>National ID</th>
                <th style={styles.tableCell}>Voting Area</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.index} style={styles.tableRow}>
                  <td style={styles.tableCell}>{candidate.index}</td>
                  <td style={styles.tableCell}>{candidate.name}</td>
                  <td style={styles.tableCell}>{candidate.nationalID}</td>
                  <td style={styles.tableCell}>{candidate.votingArea}</td>
                </tr>
              ))}
            </tbody>
            </table>
          </>
        )}
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
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    color: "#4B0082",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #4B0082",
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
  },
  table: {
    width: "90%", // Adjusted for better centering
    margin: "20px auto",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "1rem",
    backgroundColor: "#FFF",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    backgroundColor: "#731EBE",
    color: "#FFF",
    fontWeight: "bold",
  },
  tableRow: {
    borderBottom: "1px solid #DDD",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  tableRowHover: {
    backgroundColor: "#F5F5F5",
  },
  tableCell: {
    padding: "12px 15px",
    border: "none",
    textAlign: "center", // Center alignment for better readability
  },
  message: {
    color: "red",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

export default VoterPanel;
