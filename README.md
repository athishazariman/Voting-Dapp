<p align="center">
GROUP 2 - Blockers
  <br>‘PollPal’ - Voting Dapp<br><br>
Prepared by Nur Athisha Binti Mohd Zariman (2118676), Nuur Nadheerah Binti Mohammad Lutfi (2117898) & Nur Huda Binti Eshaifol Azam (2111994)<br><br>

</p><br>

**1. Use Case Diagram**
<br><br>
![use case](report_images/usecase.png)
<br><br>

**2. System Architecture Diagram**
<br><br>
![SAD](report_images/SAD.jpg)
<br><br>

**3. Frontend**
<br>
The frontend is developed using React.js, CSS and HTML providing an interactive and user-friendly interface for both voters and admins. It integrates seamlessly with the Ethereum blockchain through MetaMask and Ethers.js. <br><br>

| **Interface** | **Functionality** |
|---------------|------------------|
| Admin Interface|-Log in using MetaMask with authentication based on the admin address stored in the smart contract. <br>-Register voters and candidates through dedicated forms. <br>-Control the voting lifecycle by starting or ending the voting session. <br>-View election results for specific voting areas. |
| Voter Interface|-Connect to MetaMask for authentication.  <br>-View candidates in the voter's registered voting area. <br>-Verify voter identity using a National ID. <br>-Cast votes securely and receive feedback on the status of their vote.|

<br><br>

**4. Frontend Interface**
<br><br>

Main Page
<br>

| **Main Page** |
|---------------|
| ![SAD](report_images/mainpage.png) |

| **Election Result** |
|------------------|
| ![SAD](report_images/mainpage%20result.png)|

<br><br>
Admin Dashboard
<br>

| **Admin Panel Page** |
|----------|
| ![SAD](report_images/adminpanel.png) <br> ![SAD](report_images/adminpanel%201.png) <br> ![SAD](report_images/adminpanel%202.png) |

| **Candidates Page** |
|----------|
|  ![SAD](report_images/candidatespage.png) <br> ![SAD](report_images/candidatespage%201.png) <br> ![SAD](report_images/candidatespage%202.png) |

| **Voters Page** |
|----------|
|  ![SAD](report_images/voterspage.png) <br> ![SAD](report_images/voterspage%201.png) |

<br><br>
Election Dashboard
<br>

| **Voter Panel Page** |
|----------|
| ![SAD](report_images/voterpanel.png) <br> ![SAD](report_images/voterpanel%201.png) |

<br><br>

**5. Group Contribution**
<br>

| **Name** | **Contribution** |
|----------|------------------|
| Nur Athisha Binti Mohd Zariman (2118676)|Phase 1 <br><br>- registerCandidate <br>- registerVoter <br>- castVote <br>- getResultsByArea <br>- Manage validation rules, compile and testing smart contract <br><br>Phase 2 <br><br>-Backend <br>-Frontend (Make everything functional)|
| Nuur Nadheerah Binti Mohammad Lutfi (2117898)|Phase 1 <br><br>- candidatesByArea <br>- areaVoteCount <br>- voters <br>- Use Case Diagram <br><br>Phase 2 <br><br>-Design frontend <br>-CSS |
| Nur Huda Binti Eshaifol Azam (2111994)|Phase 1 <br><br>- startVoting <br>- endVoting <br>- getCandidatesByArea <br>- System Architecture Diagram <br><br>Phase 2 <br><br>-Unit Testing <br>-Report | 
