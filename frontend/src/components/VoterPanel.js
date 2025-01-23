import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../constants";

function VoterPanel() {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [nationalID, setNationalID] = useState("");
  const [candidateIndex, setCandidateIndex] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [votingArea, setVotingArea] = useState("");
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const initializeAccount = async () => {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    };

    initializeAccount();

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
      }));
      setCandidates(formattedCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setCandidates([]);
      setMessage("Failed to fetch candidates for this area.");
    }
  };

  const castVote = async () => {
    if (!candidateIndex || isNaN(candidateIndex) || candidateIndex < 0 || candidateIndex >= candidates.length) {
      setMessage("Invalid candidate index.");
      return;
    }

    try {
      const contract = await getContract();
      const tx = await contract.castVote(nationalID, parseInt(candidateIndex));
      await tx.wait();
      setMessage("Vote cast successfully!");
      fetchCandidatesByArea(votingArea);
    } catch (error) {
      console.error("Error casting vote:", error);
      setMessage(error.reason || "Failed to cast vote.");
    }
  };

  const handleCandidateIndexChange = (event) => {
    setCandidateIndex(event.target.value);
  };

  return (
    <div style={styles.container}>
      <header style={styles.navbar}>
        <div style={styles.navbarBrand}>
          <img src="/logo.png" alt="Logo" style={styles.navbarLogo} />
          <span style={styles.navbarTitle}>PollPal</span>
        </div>
        <nav style={styles.navLinks}>
          <span style={styles.navItem} onClick={() => navigate("/")}>
            Main Page
          </span>
        </nav>
      </header>

      <div style={styles.content}>
        <img src="/vote.jpg" alt="Voter Panel Banner" style={styles.bannerImage} />

        <h1 style={styles.pageTitle}>Election Dashboard</h1>

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>National ID</label>
            <input
              type="text"
              placeholder="Enter National ID"
              value={nationalID}
              onChange={(e) => setNationalID(e.target.value)}
              style={styles.input}
            />
          </div>
          <button style={styles.button} onClick={verifyNationalID}>
            Verify National ID
          </button>
        </div>

        {message && (
          <p
            style={{
              ...styles.message,
              color: isVerified ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}

        {isVerified && (
          <>
          <div style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Candidate Index</label>
                <input
                  type="text"
                  placeholder="Enter Candidate Index"
                  value={candidateIndex}
                  onChange={handleCandidateIndexChange}
                  style={styles.input}
                />
              </div>
              <button style={styles.button} onClick={castVote}>
                Cast Vote
              </button>
            </div>
            <h2 style={styles.sectionTitle}>Candidates for {votingArea}</h2>

            {candidates.length > 0 && (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Index</th>
                    <th style={styles.tableHeader}>Name</th>
                    <th style={styles.tableHeader}>National ID</th>
                    <th style={styles.tableHeader}>Voting Area</th>
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
            )}
          </>
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
    gap: "10px",
  },
  navbarLogo: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
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
  bannerImage: {
    width: "450px",
    height: "auto",
    borderRadius: "15px",
    marginBottom: "20px",
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
    marginTop: "50px",
    marginBottom: "20px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  },
  table: {
    width: "100%",
    maxWidth: "800px",
    margin: "20px auto",
    borderCollapse: "collapse",
    backgroundColor: "#FFF",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    padding: "10px 15px",
    backgroundColor: "#5A00A6",
    color: "#FFF",
    textAlign: "left",
    fontWeight: "bold",
  },
  tableRow: {
    backgroundColor: "#F9F9F9",
  },
  tableCell: {
    padding: "10px 15px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  },
  message: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginTop: "20px",
  },
};

export default VoterPanel;
