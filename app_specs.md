# Product Overview

## HelpDesk Pro

A cloud-based ticket management system for internal company support.

Employees can open support requests and IT/support agents can manage them.

---

# User Roles

## Employee

Can:

```text
Create ticket
View own tickets
Add comments
Upload attachments
Close own ticket
```

---

## Support Agent

Can:

```text
View all tickets
Assign tickets
Change status
Add comments
View dashboard
```

---

## Administrator

Can:

```text
Manage users
Manage departments
Manage priorities
View system statistics
```

---

# Main Screens

## 1. Login Page

```text
Email
Password
Login
```

JWT Authentication.

---

## 2. Dashboard

After login:

```text
Open Tickets
Closed Tickets
High Priority Tickets
Tickets Assigned To Me
```

Cards:

```text
+----------------+
| Open: 42       |
+----------------+

+----------------+
| Closed: 128    |
+----------------+

+----------------+
| High: 8        |
+----------------+
```

---

## 3. Ticket List

Table:

```text
ID
Title
Status
Priority
Department
Assigned To
Created Date
```

Example:

```text
#123
Cannot connect VPN
Open
High
IT
David
```

Filters:

```text
Status
Priority
Department
Assigned Agent
```

---

## 4. Create Ticket

Form:

```text
Title
Description
Department
Priority
Attachment
```

Example:

```text
Title:
VPN not working

Department:
IT

Priority:
High

Description:
Cannot connect since this morning
```

---

## 5. Ticket Details

Example:

```text
Ticket #123

Status: In Progress
Priority: High
Department: IT
Assigned To: David
```

Comments:

```text
Employee:
VPN not working

Agent:
Investigating

Employee:
Still broken
```

---

## 6. User Management

Admin only.

Table:

```text
Name
Email
Role
Department
```

Actions:

```text
Create User
Edit User
Disable User
```

---

## 7. Department Management

```text
IT
Finance
HR
Operations
Sales
```

Admins can create departments.

---

# Backend Modules (NestJS)

## Auth Module

Endpoints:

```text
POST /auth/login
POST /auth/register
GET /auth/profile
```

Features:

```text
JWT
Password hashing
Role validation
```

---

## Users Module

```text
GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id
```

---

## Tickets Module

```text
GET /tickets
GET /tickets/:id
POST /tickets
PUT /tickets/:id
DELETE /tickets/:id
```

---

## Comments Module

```text
GET /tickets/:id/comments
POST /tickets/:id/comments
```

---

## Attachments Module

```text
POST /attachments
GET /attachments/:id
```

Uploads to S3.

---

## Dashboard Module

```text
GET /dashboard/stats
```

Returns:

```json
{
  "openTickets": 42,
  "closedTickets": 120,
  "highPriority": 8,
  "assignedToMe": 5
}
```

---

# MongoDB Collections

## Users

```json
{
  "_id": "...",
  "name": "David Cohen",
  "email": "david@company.com",
  "passwordHash": "...",
  "role": "agent",
  "department": "IT"
}
```

---

## Tickets

```json
{
  "_id": "...",
  "title": "VPN not working",
  "description": "...",
  "status": "OPEN",
  "priority": "HIGH",
  "department": "IT",
  "createdBy": "...",
  "assignedTo": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## Comments

```json
{
  "_id": "...",
  "ticketId": "...",
  "authorId": "...",
  "message": "...",
  "createdAt": "..."
}
```

---

## Attachments

```json
{
  "_id": "...",
  "ticketId": "...",
  "fileName": "vpn_error.png",
  "s3Key": "attachments/123/vpn_error.png",
  "uploadedBy": "...",
  "createdAt": "..."
}
```

---

# Kubernetes Workloads

Frontend:

```text
frontend-deployment
frontend-service
```

Backend:

```text
backend-deployment
backend-service
```

Ingress:

```text
ingress
```

Namespace:

```text
helpdesk-prod
```

---

# What Students Learn

From a DevOps perspective this project naturally covers:

```text
Docker
Multi-stage builds
ECR
GitHub Actions
OIDC
EKS
Deployments
Services
Ingress
Secrets
ConfigMaps
Scaling
Rolling Updates
ALB Controller
MongoDB Atlas
S3
```