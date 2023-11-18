# Assignment 1: CRUD Question Bank

## To setup and execute

| **Step** | **Description**                                                                                                                                                                                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Download the zip file named `ay2324s1-course-assessment-g17-Assignment-1-updated.zip` from [Assignment-1-updated](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g17/releases/tag/Assignment-1-updated).                                                   |
| 2        | Unzip the file and navigate to the folder `ay2324s1-course-assessment-g17-Assignment-1-updated`.                                                                                                                                                                          |
| 3        | Set up the environment variables in `.env` for `backend/question-service` and `frontend`.                                                                                                                                                                                 |
| 4        | `cd` into `backend/question-service` and `frontend`. Run `npm install` to install the dependencies for `question-service` and `frontend`. Note: You may need to run `npm i --save-dev @types/cors` and `npm i --save-dev @types/express` should you encounter any errors. |
| 5        | In `frontend` and `backend/question-service`, run `npm start`. Access the frontend by navigating to `localhost:3000` in your browser.                                                                                                                                     |
| 6        | The landing page will show "No questions found" at first. This is because all our questions in the database are scraped from Leetcode, so it would take a while, as long as 2 minutes, to load all 2354 questions. Wait for the questions to appear on the landing page before performing CRUD. |

Before:
<img width="1672" alt="Screenshot 2023-11-18 at 10 24 56" src="https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g17/assets/97394017/6c2e0b82-9f7f-4361-855b-63e2c43a2561">

After waiting:
<img width="1670" alt="Screenshot 2023-11-18 at 10 24 44" src="https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g17/assets/97394017/5624ccd5-5303-4d8e-84bd-49309604f8e0">
