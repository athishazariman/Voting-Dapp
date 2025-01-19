const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Smart Contract", function () {
  let Voting;
  let voting;
  let admin;
  let voter1;
  let voter2;

  beforeEach(async function () {
    // Get signers
    [admin, voter1, voter2] = await ethers.getSigners();

    // Deploy the contract
    const VotingFactory = await ethers.getContractFactory("Voting", admin);
    voting = await VotingFactory.deploy(); // Deployment
    await voting.waitForDeployment(); // Wait for the deployment to complete
  });

  it("should register a voter successfully", async function () {
    const nationalID = "123456789012";
    const votingArea = "Area1";

    await voting.registerVoter(voter1.address, nationalID, votingArea);

    const registeredVoter = await voting.voters(voter1.address);
    expect(registeredVoter.isRegistered).to.equal(true);
    expect(registeredVoter.nationalID).to.equal(nationalID);
    expect(registeredVoter.votingArea).to.equal(votingArea);
  });

  it("should allow a registered voter to cast a vote", async function () {
    const nationalID = "123456789012";
    const votingArea = "Area1";

    // Register voter and candidates
    await voting.registerVoter(voter1.address, nationalID, votingArea);
    await voting.registerCandidate("Candidate1", "123456789013", votingArea);
    await voting.registerCandidate("Candidate2", "123456789014", votingArea);

    // Start voting
    await voting.startVoting();

    // Cast vote
    await voting.connect(voter1).castVote(nationalID, 0);

    const registeredVoter = await voting.voters(voter1.address);
    expect(registeredVoter.hasVoted).to.equal(true);

    const areaCandidates = await voting.getCandidatesByArea(votingArea);
    expect(areaCandidates[0].voteCount).to.equal(1);
  });

  it("should return the correct winner", async function () {
    const votingArea = "Area1";

    // Register voters and candidates
    await voting.registerVoter(voter1.address, "123456789012", votingArea);
    await voting.registerVoter(voter2.address, "123456789013", votingArea);
    await voting.registerCandidate("Candidate1", "123456789014", votingArea);
    await voting.registerCandidate("Candidate2", "123456789015", votingArea);

    // Start voting
    await voting.startVoting();

    // Cast votes
    await voting.connect(voter1).castVote("123456789012", 0);
    await voting.connect(voter2).castVote("123456789013", 0);

    // End voting
    await voting.endVoting();

    // Get results
    const [winnerName, winnerVotes] = await voting.getResultsByArea(votingArea);
    expect(winnerName).to.equal("Candidate1");
    expect(winnerVotes).to.equal(2);
  });
});
