# Assignment 5: Queue for Matching

## To set up and execute

| **Step** | **Description**                                                                                                                                                                                                                                      |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Download the zip file named `ay2324s1-course-assessment-Assignment-5.zip` from [Assignment-5](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g17/releases/tag/Assignment-5).                                                          |
| 2        | Unzip the file and navigate to the folder `ay2324s1-course-assessment-Assignment-5`.                                                                                                                                                                 |
| 3        | Set up the environment variables in `.env` for each of the microservices and `frontend`.                                                                                                                                                             |
| 4        | Run `npm install` to install the dependencies for each microservice and `frontend`. Note: You may need to run `npm i --save-dev @types/cors` and `npm i --save-dev @types/express` should you encounter any errors.                                  |
| 5        | Run `brew install rabbitmq` to install RabbitMQ.                                                                                                                                                                                                     |
| 6        | Run `rabbitmq-plugins enable rabbitmq_management` to enable the RabbitMQ management plugin.                                                                                                                                                          |
| 7        | Run `brew services start rabbitmq` to start the RabbitMQ server.                                                                                                                                                                                     |
| 8        | To ensure that the RabbitMQ server is running, navigate to `http://localhost:15672/` and login with the default credentials `guest` and `guest`. Note: If RabbitMQ is already running, you may want to run `brew services restart rabbitmq` instead. |
| 9        | Run `npm start` and navigate to `http://localhost:3000/` to access the frontend.                                                                                                                                                                     |
| 10       | Once a successful match is made, you can verify the queue is working by navigating to `http://localhost:15672/#/queues`. You should see the queue `match_results` if it is successful.                                                               |
