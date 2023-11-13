# PeerPrep G17

## Overview
An interview preparation platform designed to facilitate live coding sessions between peers.

## Repository Structure
The repository consists of a [frontend](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g17/tree/master/frontend) and multiple microservices on the [backend](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g17/tree/master/backend), each serving a specific purpose to enhance the overall interview preparation experience.

```bash
.
├── frontend
├── backend
│   ├── question-service 
│   ├── user-service
│   ├── matching-service
│   ├── collaboration-service
│   ├── forum-service
│   ├── chat-service 
│   ├── help-service
│   └── api-gateway
├── serverless
└── docker-compose.yml

```

## Setup
### Local Deployment
Ensure that you have the following:
- [Docker](https://docs.docker.com/get-docker/)
- Environment variables configured for the respective microservices

### Instructions
1. Clone the repository.
2. Set up the environment variables for the microservices.
3. Run `docker-compose up` in the root directory of the repository.
4. Access the frontend by navigating to `localhost:3000` in your browser.

## Deployment
PeerPrep is deployed on both AWS and GCP for scalability and reliability. 

- The frontend is deployed on AWS Amplify.
- The backend is deployed on GCP Cloud Run, question storage (MongoDB Atlas), relational database needs (AWS RDS), RabbitMQ for message queuing (AWS EC2) and serverless functions for question scraping (GCP Cloud Functions, Cloud Scheduler). 
- CI is done using GitHub Actions.

