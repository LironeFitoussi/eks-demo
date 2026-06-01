
```text
                       Internet
                           |
                        Route53
                           |
                     ACM Certificate
                           |
                         ALB
                           |
              AWS Load Balancer Controller
                           |
                         Ingress
                           |
        +------------------+------------------+
        |                                     |
  React Frontend                         NestJS API
  Deployment                             Deployment
  2 replicas                             2-3 replicas
        |                                     |
        |                                     |
        +---------------------------> MongoDB Atlas
                                              |
                                              |
                                             S3
```

## Application: Help Desk SaaS

A small internal ticketing platform.

Main features:

```text
Users
Tickets
Comments
Ticket status
Priority
Departments
File attachments
Dashboard
```

Example user flow:

```text
Employee opens ticket
        |
Support agent sees ticket
        |
Agent comments / changes status
        |
User uploads screenshot
        |
File goes to S3
        |
Ticket metadata saved in MongoDB Atlas
```

---

# AWS Infrastructure

```text
AWS Account
├── VPC
│   ├── Public Subnets
│   │   └── ALB
│   │
│   └── Private Subnets
│       └── EKS Worker Nodes
│
├── EKS Cluster
├── ECR
├── S3
├── Route53
├── ACM
├── IAM
├── CloudWatch
└── MongoDB Atlas outside AWS or via private peering
```

## VPC

Use a standard production-style VPC:

```text
VPC: 10.0.0.0/16

Public Subnet A:  10.0.1.0/24
Public Subnet B:  10.0.2.0/24

Private Subnet A: 10.0.11.0/24
Private Subnet B: 10.0.12.0/24
```

Public subnets contain:

```text
ALB
NAT Gateway
```

Private subnets contain:

```text
EKS nodes
Application pods
```

The EKS nodes should not be directly exposed to the internet.

---

# Kubernetes Architecture

```text
EKS Cluster
└── namespace: helpdesk-prod
    ├── frontend-deployment
    ├── frontend-service
    ├── backend-deployment
    ├── backend-service
    ├── ingress
    ├── configmap
    └── secrets
```

## Frontend

React app built with Vite.

```text
frontend-deployment
├── image: ECR/helpdesk-frontend
├── replicas: 2
├── container port: 80
└── served by nginx
```

Kubernetes objects:

```text
Deployment
Service: ClusterIP
```

The frontend does not talk directly to MongoDB.

It only talks to the backend API.

---

## Backend

NestJS API.

```text
backend-deployment
├── image: ECR/helpdesk-api
├── replicas: 2 or 3
├── container port: 3000
└── connects to MongoDB Atlas
```

Kubernetes objects:

```text
Deployment
Service: ClusterIP
Secret
ConfigMap
```

Backend responsibilities:

```text
Authentication
Ticket CRUD
Comments
Status changes
File upload metadata
Dashboard stats
```

---

# Ingress Routing

Recommended simple routing:

```text
helpdesk.example.com
├── /       → frontend-service
└── /api    → backend-service
```

Flow:

```text
User
 |
Route53
 |
ALB
 |
Ingress
 |
Frontend or Backend service
 |
Pod
```

Example:

```text
GET helpdesk.example.com
→ frontend-service
→ frontend pod
```

```text
GET helpdesk.example.com/api/tickets
→ backend-service
→ backend pod
```

---

# Database: MongoDB Atlas

Keep MongoDB outside Kubernetes.

```text
MongoDB Atlas
├── users
├── tickets
├── comments
└── attachments
```

Collections:

```text
users
- _id
- name
- email
- role
- department

tickets
- _id
- title
- description
- status
- priority
- createdBy
- assignedTo
- createdAt
- updatedAt

comments
- _id
- ticketId
- authorId
- body
- createdAt

attachments
- _id
- ticketId
- fileName
- s3Key
- uploadedBy
- createdAt
```

Connection string stored in Kubernetes Secret:

```text
MONGODB_URI
```

---

# File Uploads: S3

Use S3 for screenshots and attachments.

```text
S3 Bucket
└── helpdesk-attachments-prod
```

Flow:

```text
User uploads file
        |
Frontend sends file to Backend
        |
Backend uploads file to S3
        |
Backend saves file metadata in MongoDB
```

Better production version:

```text
Frontend asks backend for signed URL
        |
Backend creates pre-signed S3 upload URL
        |
Frontend uploads directly to S3
        |
Backend saves metadata
```

For students, start with backend upload first.

---

# Secrets and Config

## ConfigMap

Non-sensitive values:

```text
NODE_ENV=production
PORT=3000
S3_BUCKET_NAME=helpdesk-attachments-prod
AWS_REGION=us-east-1
```

## Secret

Sensitive values:

```text
MONGODB_URI
JWT_SECRET
```

For real production, later upgrade to:

```text
AWS Secrets Manager
+
External Secrets Operator
```

But for the first version, Kubernetes Secret is fine.

---

# CI/CD

Common flow:

```text
Developer
    |
GitHub
    |
GitHub Actions
    |
OIDC to AWS
    |
Build Docker images
    |
Push to ECR
    |
Deploy to EKS
```

Images:

```text
ECR
├── helpdesk-frontend
└── helpdesk-api
```

Pipeline stages:

```text
1. Install dependencies
2. Run tests
3. Build frontend image
4. Build backend image
5. Push images to ECR
6. Update Kubernetes deployment
7. Kubernetes performs rolling update
```

---

# Scaling

Frontend:

```text
2 replicas minimum
```

Backend:

```text
2-3 replicas minimum
```

Later add HPA:

```text
If backend CPU > 70%
scale from 2 pods to 6 pods
```

This demonstrates real Kubernetes value without making the project too complex.

---

# Final Architecture Summary

```text
Route53
  |
ACM TLS Certificate
  |
Application Load Balancer
  |
Ingress
  |
EKS
├── React Frontend Pods
│   └── frontend-service
│
└── NestJS API Pods
    └── backend-service
        |
        ├── MongoDB Atlas
        └── S3 Bucket
```