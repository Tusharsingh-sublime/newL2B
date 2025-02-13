# New Lead 2 Business - Backend API and Database

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Database Design](#database-design)
- [API Documentation](#api-documentation)
- [Developers](#developers)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Error Handling](#error-handling)
- [Authentication & Security](#authentication--security)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

</br>

## Overview

**Project Description:**  
The Lead Management System is a Node.js-based application designed to help administrators and users efficiently manage leads and track follow-ups. This role-based system defines two primary roles: Admin and User, each with distinct functionalities. Admins have complete control over user management and can assign specific sales targets to users while monitoring their progress. They can create, update, delete, and manage leads, ensuring proper organization and follow-through on business opportunities. Additionally, Admins are responsible for scheduling follow-ups and managing the overall lead tracking process. On the other hand, Users focus on managing their assigned leads by adding, updating, and deleting relevant information. They can perform and schedule follow-ups on these leads to ensure timely engagement and can also track their assigned sales targets to measure performance. This system streamlines lead management, making it easier for teams to collaborate, monitor progress, and achieve sales goals effectively.

## Project Structure

```bash
.
├── node_modules
├── src
│   ├── config
│   │   ├── auth.js
│   │   └── connection.js
│   ├── controller
│   │   └── V1
│   │       └── Admin
│   │           ├── loginCtrl.js
│   │           └── userCtrl.js
│   ├── helper
│   │   ├── cache.js
│   │   ├── comman_helper.js
│   │   ├── counter.js
│   │   ├── htmlTopdfConverter.js
│   │   ├── lead2business-555f4-32e03cf28223.json
│   │   ├── leadsparrow-e4b97-firebase-adminsdk.json
│   │   ├── loggerService.js
│   │   ├── security.js
│   │   ├── taskHelperFunc.js
│   │   └── validate.js
│   ├── models
│   │   └── schema.js
│   └── routes
│       └── V1
│           └── Admin
│               ├── loginRouter.js
│               └── userRouter.js
├── .env
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

</br>

## Technologies Used

- Backend Framework: Node.js
- Database:MongoDB
- Authentication: JWT

</br>

## Database Design

### **1. Admin Schema**

The Admin schema represents the administrator of the system responsible for managing users, targets, and system settings.

#### Admin Schema Fields

- username: (String) Required – The username of the admin.
- email: (String) Required, Unique – Admin email for authentication and contact.
- password: (String) Required – Encrypted password for secure login.
- role: (String) Enum [admin], Default: admin – Defines the role of the user as admin.
- isActive: (Boolean) Default: true – Specifies if the admin account is active.
- firebase_token: (String) – Used for push notifications.
- createdAt: (Date) Default: Date.now – Timestamp for when the admin was created.

### **2. User Schema**

The User schema represents the end-user responsible for managing leads and tracking targets. Each user is linked to specific business roles.

#### User Schema Fields

- username: (String) Required – Username for user login.
- fullName: (String) Required – Full name of the user.
- password: (String) Required – Encrypted password for login.
- mobile: (String) Required – User’s mobile number for contact and notifications.
- email: (String) Required, Unique – Unique email address for each user.
- branch: (String) Required – Specifies the branch where the user is associated.
- role: (String) Enum [user], Default: user – Defines the role of the user.
- Roles: (String) Required – Additional roles for user management.
- gender: (String) Enum [male, female, other] – Gender of the user.
- isActive: (Boolean) Default: true – Specifies if the user account is active.
- createdAt: (Date) Default: Date.now – Timestamp for user creation.
- assignedDate: (Date) – Date when the target was assigned to the user.
- targetNo: (Number) – Number of leads or tasks assigned as a target.
- startDate: (Date) – Target start date.
- dueDate: (Date) – Target due date.

# API Documentation

- Base URL: http://localhost:3000/api/v1

## Admin

undefined

## End-point: instert

### Method: POST

> ```
> http://localhost:3000/api/admin/add
> ```

### Body (**raw**)

```json
{
  "username": "Tushar",
  "email": "tushar@gmail.com",
  "password": "Tushar@gmail",
  "role": "admin",
  "isActive": true,
  "createdAt": "2025-02-11T09:51:19.666+00:00",
  "__v": 0
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Login

### Method: POST

> ```
> http://localhost:3000/api/admin/login
> ```

### Body (**raw**)

```json
{
  "email": "tushar@gmail.com",
  "password": "Tushar@gmail"
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## User

undefined

## End-point: user/add

### Method: POST

> ```
> http://localhost:3000/api/user/add
> ```

### Body (**raw**)

```json
{
  "username": "john_doe",
  "fullName": "John Doe",
  "password": "StrongPassword123!",
  "mobile": "9876543210",
  "email": "johndoe@example.com",
  "branch": "New York",
  "role": "user",
  "Roles": "sales",
  "gender": "male"
}
```

## End-point: user/delete

### Method: Delete

> ```
> http://localhost:3000/api/user/delete
> ```

### Query

> ```
> http://localhost:3000/api/user/delete?email=example@example.com
> ```

## End-point: user/update

### Method: Post

> ```
> http://localhost:3000/api/user/update
> ```

### Body (**raw**)

```json
{
  "username": "john_doe",
  "fullName": "John Doe",
  "password": "StrongPassword123!",
  "mobile": "9876543210",
  "email": "johndoe@example.com",
  "branch": "New York",
  "role": "user",
  "Roles": "sales",
  "gender": "male"
}
```

## End-point: user/list

### Method: Get (With all filtration according to figma )

> ```
> http://localhost:3000/api/user/list
> ```

### Query Params

| Param     | Value            |
| --------- | ---------------- |
| pageNo    | 1                |
| limit     | 5                |
| username  | john             |
| fullName  | John Doe         |
| email     | john@example.com |
| mobile    | 1234567890       |
| gender    | male             |
| branch    | IT               |
| Roles     | admin            |
| startDate | 2023-01-01       |
| endDate   | 2023-12-31       |

## End-point: user/targetList (for target Management )

### Method: Get (With all filtration according to figma )

> ```
> http://localhost:3000/api/user/targetList
> ```

### Query Params

| Param    | Value      |
| -------- | ---------- |
| fromDate | 2023-01-01 |
| toDate   | 2023-12-31 |
| branch   | IT         |

## Developers

| Name   | Start Date | End Date |
| :----- | ---------- | -------: |
| Tushar | date       |     date |
| PQR    | date       |     date |

## Installation and Setup

- Clone the repository:

```bash
git clone https://github.com/Tusharsingh-sublime/newL2B.git

```

Install dependencies:

```bash
npm install
```

- Run the development server:

```bash
npm run dev
```

## Authentication & Security

- Use JWT for authentication
- Passwords are hashed using bcrypt
- Implement role-based access control

