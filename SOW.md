# Project Title
## Travia Crack

### Team:
#### WIFI Warriors
#### JT Higgins, Ryan James, Adyn Cox

### Project Objective
#### Briefly describe the goal of the project. What problem are you trying to solve or what functionality are you aiming to achieve?

We are looking to make a game similar to trivia crack, where multiple users will be able to connect to a server. Once connected, the server will query the user to enter in information such as usernames, and then will prompt the user with questions that the client must answer. Most likely will be point based game. 

Multiple clients with one server. Secure back and forth communication between server and clients, allowing the clients to interact with each other.

### Scope:
#### Inclusions:
- One server
- Multiple clients (~4)
- Point based game, so there will be a winner
- Terminal based?
- Multiple categories of questions, or a randomized lists. All with a list of possible answers
- Query the users one at a time?
- Give the user a time frame to answer the question?
- Maybe have a maximum point total or a set amount of questions for everybody to determine when the game is done.
- Ability to terminate connection with the server if the user would like to quit.

#### Exclusions:
- List any tasks, features, or components that will not be included in the project.
- No GUI for simplicity purposes?

### Deliverables
- List the expected outputs or deliverables from the project, such as a working Python script, documentation, or presentations.
**Sprint 1:**
- Basic server setup - allow server to listen for connections
- Client side connection - allow the client to connect with the server
- Simple message exchange - Show that the server and client are able to talk back and forth successfully
- Error handling - Throw errors to the client or server based on if there is a failed connection, or if connection is lost.
- Testing - Test that the components work together successfully

### Timeline
#### Key Milestones:
- Outline the major milestones or checkpoints throughout the project, with estimated completion dates.
**Sprint 1 - OCT 6**
We want to have the clients and server in a healthy state where they can exchange messages and test that the functionality is working. If not let the client or server know of what the issues are. 

**Sprint 2**

**Sprint 3**

**Sprint 4**

**Sprint 5**

#### Tesk Breakdown:

| Task                                      | Description                                                                                         | Assigned To           | Estimated Time  |
|-------------------------------------------|-----------------------------------------------------------------------------------------------------|-----------------------|-----------------|
| **Sprint 1: Basic Server-Client Setup**    |                                                                                                     |                       |                 |
| Server setup                              | Create the server that listens for client connections                                                | TBD           | 6 hours         |
| Client connection                         | Implement client-side code to connect to the server                                                  | TBD            | 4 hours         |
| Simple message exchange                   | Ensure that the server and client can communicate (send/receive messages)                            | TBD              | 4 hours         |
| Error handling                            | Add error handling for connection failures and dropped connections                                   | TBD           | 5 hours         |
| Testing (Basic communication)             | Test basic server-client communication with the team and external users (roommates, classmates, etc.)| TBD          | 6 hours         |
| **Sprint 1 Total**                        |                                                                                                     |                       | **25 hours**    |
|                                           |                                                                                                     |                       |                 |
| **Sprint 2: Game Logic Implementation**   |                                                                                                     |                       |                 |
| User registration                         | Create a system for clients to input usernames                                                      | TBD            | 3 hours         |
| Question and answer setup                 | Design the trivia question system with categories and multiple answers                               | TBD            | 6 hours         |
| Scoring system                            | Implement a point-based scoring system to determine winners                                          | TBD              | 5 hours         |
| Timer for answers                         | Add a timer for answering questions within a set time frame                                          | TBD            | 4 hours         |
| Testing (Game logic)                      | Test the full game logic including user registration, question answering, and scoring                | TBD         | 6 hours         |
| **Sprint 2 Total**                        |                                                                                                     |                       | **24 hours**    |
|                                           |                                                                                                     |                       |                 |
| **Sprint 3: Enhancements & Final Testing**|                                                                                                     |                       |                 |
| Randomized question selection             | Implement random selection of questions from the pool                                                | TBD           | 3 hours         |
| Multiple rounds of play                   | Implement support for multiple rounds to continue until a winner is determined                       | TBD             | 5 hours         |
| Clean up and refactor code                | Refactor the code for readability and performance optimization                                       | TBD            | 4 hours         |
| Error logging and reporting               | Add detailed error logging for debugging and to improve user experience                              | TBD              | 3 hours         |
| Final testing (Full game test)            | Conduct full tests of the game with team and external users (friends, roommates, etc.)               | TBD         | 6 hours         |
| **Sprint 3 Total**                        |                                                                                                     |                       | **21 hours**    |
|                                           |                                                                                                     |                       |                 |
| **Sprint 4: Documentation & Presentation**|                                                                                                     |                       |                 |
| Write README.md                           | Complete the README.md with detailed instructions on how to run the server and client                | TBD            | 2 hours         |
| Create final project documentation        | Write up final project documentation explaining the game's features, setup, and usage                | TBD            | 3 hours         |
| Prepare for presentation                  | Create presentation materials (slides, demo, etc.)                                                   | TBD              | 2 hours         |
| **Sprint 4 Total**                        |                                                                                                     |                       | **7 hours**     |
|                                           |                                                                                                     |                       |                 |
| **Overall Project Total**                 |                                                                                                     |                       | **77 hours**    |


### Technical Requirements
#### Hardware:
- Specify any hardware requirements, such as servers, networking equipment, or specific devices.
- **Have the server be a PC, Laptop, or something like a Pi**
- Clients would connect via laptop or PC.

#### Software:
- List the necessary software tools, programming languages (Python), libraries (socket, threading, etc.), and operating systems.
- Python
- Time library - MAYBE
- Random library - MAYBE
- Socket library
- Github - version control
- Python environment
- Possibly threading?

### Assumptions:
- **Network Connectivity:** It is assumed that both the server and clients will have stable internet connections to enable reliable communication during the game. The game requires low-latency connections to function properly.
- **Access to Hardware:** It is assumed that all team members and users involved in testing will have access to either a PC, laptop, or Raspberry Pi to act as a server or client.
- **Python Setup:** It is assumed that Python and necessary libraries will be properly installed and set up on all machines involved in development and testing.
- **Basic Security:** The project assumes basic security for message exchanges, although no advanced encryption or secure transmission protocols (like SSL/TLS) are expected at this stage.
- **Client Participation:** All clients are assumed to actively participate in the game and remain connected to the server until the game finishes or they choose to quit.
- **Question Availability:** It is assumed that a sufficient and randomized list of trivia questions will be provided in advance, with predefined categories and possible answers.
  
### Roles and Responsibilities:
- Define the roles of team members, including project manager, developers, testers, etc., and their responsibilities.
- All are developers. We will all assist in writing the code to make this game functional. Roles based on code are TBD.
- Change up Sprint lead each sprint.
- Test using ourselves, but also roomates, classmates, family members, friends.

### Communication Plan:
- Outline the communication channels and frequency for project updates, meetings, and decision-making.
- Everybody available on Teams for questions or help
- Meet 2 times a week if possible, on teams or in person.
