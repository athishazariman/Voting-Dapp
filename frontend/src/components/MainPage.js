import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../constants";

function MainPage() {
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [showResults, setShowResults] = useState(false); // Toggle result section
  const [votingArea, setVotingArea] = useState(""); // Voting area input
  const [result, setResult] = useState(null); // Result state
  const [votingEnded, setVotingEnded] = useState(false); // State to check if voting has ended
  const navigate = useNavigate();

  const connectWallet = async (role) => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];
      console.log("Connected account:", account);

      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      if (role === "admin") {
        const admin = await contract.admin();
        if (account.toLowerCase() === admin.toLowerCase()) {
          navigate("/admin");
        } else {
          setErrorMessage("You are not an admin");
        }
      } else if (role === "voter") {
        navigate("/voter");
      }
    } catch (error) {
      console.error("Error during wallet connection:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const fetchVotingStatus = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      const isVotingEnded = await contract.votingEnded();
      setVotingEnded(isVotingEnded);

      if (!isVotingEnded) {
        setErrorMessage("Voting has not ended yet.");
      }
    } catch (error) {
      console.error("Error checking voting status:", error);
      setErrorMessage("Failed to check voting status.");
    }
  };

  const fetchResults = async () => {
    try {
      if (!votingArea.trim()) {
        setErrorMessage("Please enter a voting area.");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

      const areaCandidates = await contract.getCandidatesByArea(votingArea);

      if (areaCandidates.length === 1) {
        setResult(`Winner: ${areaCandidates[0].name} (Default winner, no competition).`);
        return;
      }

      let highestVoteCount = 0;
      let winners = [];

      areaCandidates.forEach((candidate) => {
        if (candidate.voteCount > highestVoteCount) {
          highestVoteCount = candidate.voteCount;
          winners = [candidate.name];
        } else if (candidate.voteCount === highestVoteCount) {
          winners.push(candidate.name);
        }
      });

      if (winners.length > 1) {
        setResult(`Candidates ${winners.join(", ")} are tied with ${highestVoteCount} votes!`);
      } else {
        setResult(`Winner: ${winners[0]} with ${highestVoteCount} votes!`);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      setErrorMessage("Failed to fetch results. Ensure voting has ended and area is correct.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src="/logo.png" alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>Welcome to Decentralized Voting Application</h1>
      </div>

      <p style={styles.subtitle}>Login into your MetaMask account to start</p>

      <div style={styles.boxContainer}>
        <button style={styles.box} onClick={() => connectWallet("voter")}>
          Voter
        </button>
        <button style={styles.box} onClick={() => connectWallet("admin")}>
          Admin
        </button>
      </div>

      {showResults ? (
        <div style={styles.resultSection}>
          <h3 style={styles.resultTitle}>See Result</h3>
          <input
            type="text"
            placeholder="Enter Voting Area"
            value={votingArea}
            onChange={(e) => setVotingArea(e.target.value)}
            style={styles.input}
          />
          <button
            style={styles.button}
            onClick={async () => {
              await fetchVotingStatus();
              if (votingEnded) {
                await fetchResults();
              }
            }}
          >
            Show Result
          </button>
          {result && <p style={styles.resultText}>{result}</p>}
        </div>
      ) : (
        <button style={styles.resultButton} onClick={() => setShowResults(true)}>
          See Result
        </button>
      )}

      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#D5B4F2",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "3.5rem",
    fontWeight: "bold",
    color: "#4B0082",
    marginTop: "20px", // Add margin to separate the logo and title
    textAlign: "center",
    lineHeight: "1.2",
  },
  logo: {
    width: "120px",
    height: "120px",
    borderRadius: "50%", // Makes the logo round
    border: "2px solid #4B0082", // Optional border for style
    objectFit: "cover",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#4B0082",
    marginBottom: "20px",
    fontStyle: "italic",
  },
  boxContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "20px",
  },
  box: {
    backgroundColor: "#731EBE",
    color: "#FFF",
    padding: "15px 50px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
  },
  resultButton: {
    backgroundColor: "#000",
    color: "#FFF",
    padding: "10px 30px",
    fontSize: "1rem",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginTop: "20px",
  },
  resultSection: {
    marginTop: "20px",
    textAlign: "center",
  },
  resultTitle: {
    fontSize: "1.5rem",
    color: "#4B0082",
    marginBottom: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #4B0082",
    marginBottom: "10px",
    width: "300px",
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
  resultText: {
    marginTop: "10px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#4B0082",
  },
  error: {
    marginTop: "20px",
    color: "red",
    fontWeight: "bold",
    fontSize: "1rem",
  },
};

export default MainPage;
