## parking_system_deployment

# Overview
A serverless REST API for managing parking ticket using AWS services.

# Features
- Create Parking Ticket
- Read Parking Ticket
- List Parking Tickets
- Update Parking Ticket Information
- Delete Parking Ticket

# Architecture
- AWS API Gateway
- AWS API Gateway
- AWS Lambda Functions
- DynamoDB for data storage
- Serverless Framework for infrastructure
- Node.js with TypeScript

# Prerequisites
- AWS Account
- Node.js 18.x
- Serverless Framework
- AWS CLI configured

# AWS Deployment Setup
1. Create IAM Role first with custom_name
2. Apply Permission policies (DynmoDB, API Gateway, CloudFormation, S3)
3. Edit Trust relationships which OIDC Provider (Action: sts:AssumeRoleWithWebIdentity)

# Local Development Setup and Testing
1. Clone repository
2. npm install
3. npm run deploy:dev

# Running Tests
```npm test```

# Deployment
- Development: npm run deploy:dev
- Production: npm run deploy:prod