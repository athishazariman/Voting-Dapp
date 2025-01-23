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
| User Interface|-Connect to MetaMask for authentication.  <br>-View candidates in the voter's registered voting area. <br>-Verify voter identity using a National ID. <br>-Cast votes securely and receive feedback on the status of their vote.|
| Admin Interface|-Log in using MetaMask with authentication based on the admin address stored in the smart contract. <br>-Register voters and candidates through dedicated forms. <br>-Control the voting lifecycle by starting or ending the voting session. <br>-View election results for specific voting areas. |

<br><br>

**4. Frontend Interface**
<br>

Main Page
<br>

| **Main Page** |
|---------------|
| ![SAD](report_images/mainpage.png) |

| **Election Result** |
|------------------|
| ![SAD](report_images/mainpage%20result.png)|

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

Election Dashboard
<br>

| **Voter Panel Page** |
|----------|
| ![SAD](report_images/voterpanel.png) <br> ![SAD](report_images/voterpanel%201.png) |

**5. Group Contribution**
<br><br>

| **Name** | **Contribution** |
|----------|------------------|
| Nur Athisha Binti Mohd Zariman (2118676)|Schedule Pages <br>- schedule.dart <br>- add_event_page.dart <br>- view_all_events_page.dart <br>- event_details_page.dart <br>|
| Nora Alissa binti Ismail (2117862)|Family Profile Pages <br>- create_profile_page.dart <br>- edit_profile_page.dart <br>- home_page.dart <br>- members_detail_page.dart <br>- members_profile_page.dart <br>- firestore.dart <br>- member.dart <br>- nav_bar.dart <br> |
| Adriana binti Anuar Kamal (2025778)|Login and Reminder Pages <br> - main.dart <br>- reminder.dart <br>- auth.dart <br>- notification_service.dart <br>- reminder_page.dart <br>- login_register_page.dart | 
