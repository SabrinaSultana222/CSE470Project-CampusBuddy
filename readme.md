# 🎓 Campus Buddy – Student Life Web System

Campus Buddy is a web-based student-life management system designed to bring essential academic and campus-related services together in one platform.

The system helps students manage their academic activities, assignments, schedules, campus events, club activities, lost and found posts, GPA, discussions, and other student services. It also provides administrative tools for managing users, reports, and campus content.

---

## 📌 Project Overview

Campus Buddy provides a centralized platform for students, club administrators, faculty members, and system administrators.

The main goal of the system is to make university life more organized, accessible, and convenient by bringing multiple student services into a single platform.

The system covers both **academic management** and **campus-life management**.

---

## ✨ Features

Campus Buddy includes the following features:

### 📚 Academic & Student Management

1. **User Authentication & Access Control**
   - Registration
   - Login and Logout
   - Role-based access control

2. **Class Schedule**
   - Create and manage class schedules
   - View academic schedules

3. **Assignment Tracker**
   - Track assignments
   - Manage assignment deadlines

4. **Event Calendar**
   - View and manage academic and campus events

5. **Lost & Found Posts**
   - Create lost and found posts
   - View lost and found information

6. **Club Activities Board**
   - Share club activities
   - View campus club activities and announcements

7. **Simple Chatbot**
   - Rule-based chatbot
   - Provides answers to frequently asked questions

8. **Notifications & Reminders**
   - Real-time notifications
   - Academic and activity reminders
   - WebSocket-based notification delivery

9. **To-Do List**
   - Create and manage personal tasks

10. **GPA Calculator**
    - Calculate student GPA

11. **Discussion Posts & Comments**
    - Create discussion posts
    - Comment and interact with discussions

12. **Search & Filter**
    - Search for relevant content
    - Filter available information

13. **Dark/Light Theme**
    - Switch between dark and light themes

14. **Profile Settings**
    - Manage user profile information and settings

15. **File Upload**
    - Upload notes and relevant files

16. **Admin Dashboard**
    - Administrative management interface
    - Manage system information and users

17. **Report Generator**
    - Generate system reports

18. **Export Data**
    - Export relevant data in CSV format

19. **Help / FAQ Page**
    - Frequently asked questions
    - Help and guidance for users

20. **Student Progress Dashboard**
    - Monitor academic progress
    - Present student progress information

---

# 👥 Team Members & Contributions

Campus Buddy was developed collaboratively by four team members. Each member was responsible for implementing a specific set of features.

---

## 👨‍💻 Apurbo Saha

**Student ID:** 23101329

### Contributions

| Feature | Contribution |
|---|---|
| Authentication | User registration, login/logout and access control |
| Class Schedule | Managing and displaying class schedules |
| Event Calendar | Managing academic and campus events |
| To-Do List | Creating and managing personal tasks |
| Admin Dashboard | Administrative management and system controls |

---

## 👩‍💻 Lena Rani Sarkar

**Student ID:** 22201260

### Contributions

| Feature | Contribution |
|---|---|
| Dark/Light Theme | Theme switching for the user interface |
| Simple Chatbot | Rule-based chatbot for student assistance |
| Export Data | Exporting system data in CSV format |
| Notifications & Reminders | Notification and reminder functionality |
| File Upload | Uploading notes and relevant files |

---

## 👩‍💻 Sabrina Sultana

**Student ID:** 22299072

### Contributions

| Feature | Contribution |
|---|---|
| Club Activities Board | Managing and displaying club activities |
| Discussion Posts & Comments | Creating discussions and managing comments |
| Report Generator | Generating system reports |
| Help / FAQ Page | Providing help and frequently asked questions |
| Student Progress Dashboard | Displaying student academic progress |

### 🔧 Additional Technical Contribution

**WebSocket-Based Real-Time Notifications**

Implemented **WebSocket communication specifically for the Notifications & Reminders feature**.

The WebSocket implementation enables real-time notification delivery to users without requiring them to manually refresh the page. This allows important notifications and reminders to be delivered immediately through a persistent real-time connection.

---

## 👩‍💻 Sabaha Sadik

**Student ID:** 22101094

### Contributions

| Feature | Contribution |
|---|---|
| Assignment Tracker | Managing and tracking student assignments |
| Lost & Found Posts | Creating and managing lost and found posts |
| GPA Calculator | Calculating student GPA |
| Search & Filter | Searching and filtering system content |
| Profile Settings | Managing user profile settings |

---

# 🏗️ System Architecture

Campus Buddy is organized into multiple layers, where each layer is responsible for a specific part of the system. This structure helps keep the application modular, maintainable, and easier to extend.

### 🖥️ 1. Presentation Layer

The Presentation Layer is the user-facing part of Campus Buddy.

It provides the interface through which students, club administrators, faculty members, and system administrators interact with the system.

Key interfaces include:

- Student Dashboard
- Class Schedule
- Assignment Tracker
- Event Calendar
- Club Activities
- Discussion Board
- Lost & Found
- GPA Calculator
- To-Do List
- Profile Settings
- Admin Dashboard
- Student Progress Dashboard
- Help / FAQ

---

### ⚙️ 2. Application Layer

The Application Layer contains the main business logic of Campus Buddy.

It processes user requests and manages the functionality of the different system modules.

Major responsibilities include:

- User authentication and authorization
- Assignment management
- Schedule management
- Event management
- Club activity management
- Discussion management
- GPA calculation
- Search and filtering
- Report generation
- Data export
- File management
- Student progress tracking

---

### 🔌 3. Communication Layer

Campus Buddy uses different communication mechanisms depending on the functionality.

**RESTful APIs** are used for regular client-server communication and data operations.

**WebSocket communication** is used specifically for the **Notifications & Reminders** feature to provide real-time notification delivery.

The WebSocket connection allows the server to send notifications to connected users immediately without requiring the user to refresh the page.

---

### 🗄️ 4. Data Layer

The Data Layer manages the storage and retrieval of application data.

Depending on the implementation, the system can use:

- MongoDB
- PostgreSQL

The database stores information related to:

- Users
- Authentication
- Class schedules
- Assignments
- Events
- Club activities
- Lost & Found posts
- Discussions and comments
- Notifications
- Student progress
- Reports
- Uploaded files

---

### 🏛️ Architecture Overview

```text
┌─────────────────────────────────────────────┐
│              PRESENTATION LAYER             │
│                                             │
│  Dashboards • Schedules • Assignments       │
│  Events • Clubs • Discussions • GPA         │
│  Notifications • Profile • Admin Panel      │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│              APPLICATION LAYER              │
│                                             │
│  Authentication • Business Logic            │
│  Assignment Management • Event Management   │
│  Search • Reports • Export • File Handling  │
└──────────────────────┬──────────────────────┘
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
┌────────────────────┐  ┌────────────────────┐
│   RESTful API      │  │     WebSocket      │
│                    │  │                    │
│ Regular Data       │  │ Real-Time          │
│ Communication      │  │ Notifications      │
└─────────┬──────────┘  └─────────┬──────────┘
          │                       │
          └───────────┬───────────┘
                      ▼
┌─────────────────────────────────────────────┐
│                  DATA LAYER                 │
│                                             │
│                   MongoDB         
└─────────────────────────────────────────────┘
