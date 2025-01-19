import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import AdminPanel from "./components/AdminPanel";
import VoterPanel from "./components/VoterPanel";
import CandidatesPage from "./components/CandidatesPage"; // Import CandidatesPage
import VotersPage from "./components/VotersPage";
import { BrowserProvider } from "ethers";

function App() {
  const [account, setAccount] = useState(""); // State to track the connected account

  // Connect to MetaMask and track account
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } else {
      alert("MetaMask is not installed!");
    }
  };

  // Automatically connect to MetaMask if accounts are available
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MainPage connectWallet={connectWallet} account={account} />} />
      <Route path="/admin" element={<AdminPanel account={account} />} />
      <Route path="/voter" element={<VoterPanel account={account} />} />
      <Route path="/admin/candidates" element={<CandidatesPage account={account} />} />
      <Route path="/admin/voters" element={<VotersPage account={account} />} />
    </Routes>
  );
}

export default App;
