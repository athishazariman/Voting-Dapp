import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../constants";

function CandidatesPage({ account }) {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [filterArea, setFilterArea] = useState("");
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    nationalID: "",
    votingArea: "",
  });
  const [message, setMessage] = useState("");

  const getContract = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, ABI, signer);
  };

  const registerCandidate = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.registerCandidate(
        newCandidate.name,
        newCandidate.nationalID,
        newCandidate.votingArea
      );
      await tx.wait();
      setMessage({
        text: "Candidate registered successfully!",
        type: "success",
      });
      fetchCandidatesByArea(filterArea);
      setNewCandidate({ name: "", nationalID: "", votingArea: "" }); // Reset form
    } catch (error) {
      console.error("Error registering candidate:", error);
      setMessage({
        text: error.reason || "Failed to register candidate.",
        type: "error",
      });
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
      setMessage({
        text: "Failed to fetch candidates for this area.",
        type: "error",
      });
    }
  };

  const handleFilterAreaChange = (event) => {
    const area = event.target.value;
    setFilterArea(area);
    if (area) fetchCandidatesByArea(area);
  };

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
        <h2 style={styles.sectionTitle}>Register Candidate</h2>
        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Candidate Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={newCandidate.name}
              onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>National ID</label>
            <input
              type="text"
              placeholder="12-digit ID"
              value={newCandidate.nationalID}
              onChange={(e) => setNewCandidate({ ...newCandidate, nationalID: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Voting Area</label>
            <input
              type="text"
              placeholder="Area Name"
              value={newCandidate.votingArea}
              onChange={(e) => setNewCandidate({ ...newCandidate, votingArea: e.target.value })}
              style={styles.input}
            />
          </div>
          <button style={styles.button} onClick={registerCandidate}>
            Register Candidate
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

        <h2 style={styles.sectionTitle}>View Candidates</h2>
        <div style={styles.filterSection}>
          <input
            type="text"
            placeholder="Enter Voting Area"
            value={filterArea}
            onChange={handleFilterAreaChange}
            style={styles.input}
          />
        </div>

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
  filterSection: {
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    maxWidth: "800px",
    margin: "20px auto",
    borderCollapse: "collapse",
    backgroundColor: "#FFF",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    backgroundColor: "#731EBE",
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    padding: "10px",
  },
  tableRow: {
    textAlign: "center",
    borderBottom: "1px solid #DDD",
  },
  tableCell: {
    padding: "10px",
    fontSize: "1rem",
    color: "#4B0082",
  },
  message: {
    marginTop: "20px",
    fontSize: "1rem",
    fontWeight: "bold",
  },
};

export default CandidatesPage;
