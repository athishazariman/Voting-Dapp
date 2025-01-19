// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;
    bool public votingStarted = false;
    bool public votingEnded = false;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        string nationalID;
        string votingArea;
    }

    struct Candidate {
        string name;
        string nationalID;
        string votingArea;
        uint256 voteCount;
    }

    mapping(address => Voter) public voters;
    address[] public voterAddresses; // Array to store voter addresses
    mapping(string => Candidate[]) public candidatesByArea; // Group candidates by area
    mapping(string => uint256) public areaVoteCount; // Track total votes in each area
    mapping(string => bool) private registeredVoterIDs; // Track registered voter IDs
    mapping(string => bool) private registeredCandidateIDs; // Track registered candidate IDs

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier isVotingOpen() {
        require(votingStarted && !votingEnded, "Voting is not open.");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Register a voter
    function registerVoter(address _voter, string memory _nationalID, string memory _votingArea) public onlyAdmin {
        require(bytes(_nationalID).length == 12, "National ID must be 12 digits");
        require(!registeredVoterIDs[_nationalID], "This national ID is already registered as a voter.");
        
        voters[_voter] = Voter({
            isRegistered: true,
            hasVoted: false,
            nationalID: _nationalID,
            votingArea: _votingArea
        });

        voterAddresses.push(_voter); // Add voter address to array
        registeredVoterIDs[_nationalID] = true; // Mark the ID as registered
    }

    // Register a candidate
    function registerCandidate(string memory _name, string memory _nationalID, string memory _votingArea) public onlyAdmin {
        require(bytes(_nationalID).length == 12, "National ID must be 12 digits");
        require(!registeredCandidateIDs[_nationalID], "This national ID is already registered as a candidate.");
        
        candidatesByArea[_votingArea].push(Candidate({
            name: _name,
            nationalID: _nationalID,
            votingArea: _votingArea,
            voteCount: 0
        }));

        registeredCandidateIDs[_nationalID] = true; // Mark the ID as registered
    }

    // Start voting
    function startVoting() public onlyAdmin {
        require(!votingStarted, "Voting has already started.");
        votingStarted = true;
    }

    // End voting
    function endVoting() public onlyAdmin {
        require(votingStarted, "Voting has not started yet.");
        require(!votingEnded, "Voting has already ended.");
        votingEnded = true;
    }

    // View candidates in a specific area
    function getCandidatesByArea(string memory _area) public view returns (Candidate[] memory) {
        return candidatesByArea[_area];
    }

    // Cast a vote
    function castVote(string memory _nationalID, uint256 candidateIndex) public isVotingOpen {
        Voter storage sender = voters[msg.sender];

        // Check if voter is registered
        require(sender.isRegistered, "You are not registered to vote.");
        require(keccak256(bytes(sender.nationalID)) == keccak256(bytes(_nationalID)), "National ID does not match.");
        require(!sender.hasVoted, "You have already voted.");

        // Get candidates in voter's area
        string memory voterArea = sender.votingArea;
        Candidate[] storage areaCandidates = candidatesByArea[voterArea];

        // Check if there are enough candidates in the area
        require(areaCandidates.length >= 2, "Not enough candidates in your voting area.");
        require(candidateIndex < areaCandidates.length, "Invalid candidate index.");

        // Cast vote
        areaCandidates[candidateIndex].voteCount++;
        sender.hasVoted = true;
        areaVoteCount[voterArea]++;
    }

    // Get results for a specific area
    function getResultsByArea(string memory _area) public view returns (string memory winnerName, uint256 winnerVotes) {
        require(votingEnded, "Voting has not ended yet.");

        Candidate[] storage areaCandidates = candidatesByArea[_area];
        require(areaCandidates.length > 0, "No candidates in this area.");

        uint256 highestVoteCount = 0;
        uint256 winnerIndex = 0;

        for (uint i = 0; i < areaCandidates.length; i++) {
            if (areaCandidates[i].voteCount > highestVoteCount) {
                highestVoteCount = areaCandidates[i].voteCount;
                winnerIndex = i;
            }
        }

        winnerName = areaCandidates[winnerIndex].name;
        winnerVotes = areaCandidates[winnerIndex].voteCount;
    }

    // Get all registered voter addresses
    function getAllVoters() public view returns (address[] memory) {
        return voterAddresses;
    }
}
