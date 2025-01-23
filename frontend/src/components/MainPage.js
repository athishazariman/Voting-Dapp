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
        <h1 style={styles.title}>Welcome to PollPal</h1>
      </div>
  
      <p style={styles.description}>
        PollPal is a decentralized voting system that ensures secure, transparent, and tamper-proof elections using blockchain technology.
      </p>
      <p style={styles.subtitle}>Login into your MetaMask account to start</p>
  
      <div style={styles.boxContainer}>
        <button
          style={styles.box}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#5E35B1"}  // Hover effect
          onMouseLeave={(e) => e.target.style.backgroundColor = "#7E57C2"}  // Reset to original color
          onClick={() => connectWallet("voter")}
        >
          Voter
        </button>
        <button
          style={styles.box}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#5E35B1"}  // Hover effect
          onMouseLeave={(e) => e.target.style.backgroundColor = "#7E57C2"}  // Reset to original color
          onClick={() => connectWallet("admin")}
        >
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
    backgroundImage: "linear-gradient(135deg, #D5B4F2, #9C27B0)", // Light purple to dark purple gradient
    height: "120vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    fontFamily: "'Roboto', sans-serif",
    boxSizing: "border-box",
    transition: "background-color 0.3s ease", // Smooth background transition
    textAlign: "center", // Center text for better alignment
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
    animation: "fadeIn 1s ease-out", // Add fade-in animation to header
  },
  title: {
    fontSize: "3.5rem", // Increased font size for better visibility
    fontWeight: "bold",
    color: "#4A148C", // Darker purple for contrast
    marginTop: "20px",
    lineHeight: "1.2",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
    letterSpacing: "2px", // Increased letter spacing for a modern touch
  },
  logo: {
    width: "130px", // Larger logo size for better visibility
    height: "130px",
    borderRadius: "50%",
    border: "3px solid #4A148C",
    objectFit: "cover",
    marginBottom: "15px", // Increased margin for better spacing
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)", // More pronounced shadow for depth
  },
  subtitle: {
    fontSize: "1rem", // Slightly larger font size for better readability
    color: "#4A148C",
    marginBottom: "30px", // Increased margin for better separation
    fontStyle: "italic",
  },
  description: {
    fontSize: '1.2rem',
    color: '#4A148C',
    marginBottom: '30px', // Increased margin for spacing
    maxWidth: '700px', // Increased max width for better readability
    lineHeight: '1.7', // More line spacing for readability
    padding: "0 20px", // Increased padding for text clarity
    fontWeight: "300", // Lighter weight for easier reading
  },
  boxContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "40px", // Increased gap for spacing
    marginBottom: "30px", // Increased margin for better separation
    animation: "fadeIn 1s ease-out 0.5s", // Delay animation for smooth transition
  },
  box: {
    backgroundColor: "#7E57C2", // Lighter purple shade
    color: "#FFF",
    padding: "15px 50px", // Larger padding for better clickability
    fontSize: "1.2rem", // Slightly larger font size
    fontWeight: "bold",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0px 12px 20px rgba(0, 0, 0, 0.2)", // More depth with shadow
    transition: "all 0.3s ease",
    outline: "none", // Remove default button outline
    transform: "scale(1)", // Ensure initial scale is normal
  },
  resultButton: {
    backgroundColor: "#000000",
    color: "#FFF",
    padding: "15px 40px", // Larger padding for better clickability
    fontSize: "1.2rem", // Slightly larger font size
    fontWeight: "bold",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    marginTop: "30px", // Increased margin for better separation
    transition: "background-color 0.3s, transform 0.2s", // Include transform transition
  },
  resultSection: {
    marginTop: "30px", // Increased margin for better spacing
    textAlign: "center",
  },
  resultTitle: {
    fontSize: "1.8rem", // Increased font size for better visibility
    color: "#4A148C",
    marginBottom: "15px", // Increased margin for better spacing
  },
  input: {
    padding: "15px", // Increased padding for better usability
    fontSize: "1.2rem", // Slightly larger font size for readability
    borderRadius: "8px",
    border: "2px solid #4A148C",
    marginBottom: "15px", // Increased margin for better separation
    width: "350px", // Increased input width for better user experience
    outline: "none",
    transition: "border-color 0.3s ease", // Smooth border color change on focus
  },
  button: {
    padding: "15px 30px", // Larger padding for better usability
    fontSize: "1.1rem", // Slightly larger font size
    fontWeight: "bold",
    color: "#FFF",
    backgroundColor: "#7E57C2",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease", // Smooth background color change
  },
  resultText: {
    marginTop: "15px", // Increased margin for better separation
    fontSize: "1.3rem", // Slightly larger font size
    fontWeight: "bold",
    color: "#4A148C",
  },
  error: {
    marginTop: "30px", // Increased margin for better spacing
    color: "#D32F2F", // Red color for errors
    fontWeight: "bold",
    fontSize: "1.2rem", // Larger font size for visibility
  },
};
export default MainPage;
