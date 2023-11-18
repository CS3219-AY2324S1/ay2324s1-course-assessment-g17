# Assignment 1: CRUD Question Bank

## To setup and execute

| **Step** | **Description**                                                                                                                                                                                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Download the zip file named `ay2324s1-course-assessment-g17-Assignment-1-updated.zip` from [Assignment-1-updated](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g17/releases/tag/Assignment-1-updated).                                                   |
| 2        | Unzip the file and navigate to the folder `ay2324s1-course-assessment-g17-Assignment-1-updated`.                                                                                                                                                                          |
| 3        | Set up the environment variables in `.env` for `backend/question-service` and `frontend`.                                                                                                                                                                                 |
| 4        | `cd` into `backend/question-service` and `frontend`. Run `npm install` to install the dependencies for `question-service` and `frontend`. Note: You may need to run `npm i --save-dev @types/cors` and `npm i --save-dev @types/express` should you encounter any errors. |
| 5        | In `frontend` and `backend/question-service`, run `npm start`. Access the frontend by navigating to `localhost:3000` in your browser.                                                                                                                                     |
| 6        | The question table on the landing page will be flashing at first. This is because all our questions in the final database are scraped from Leetcode, so it would take a while, as long as 3 minutes, to get and load all 2354 questions. Wait for the question table containing questions to appear on the landing page before performing CRUD. Note: You may have to wait again after creating, editing or deleting a question. We apologise for the inconvenience, and seek your understanding. |

Before:
<img width="1672" alt="Screenshot 2023-11-18 at 13 41 45" src="https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g17/assets/97394017/dbbfbcf9-8463-4d36-810d-b919f7dff1ca">

After waiting:
<img width="1672" alt="Screenshot 2023-11-18 at 13 50 03" src="https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g17/assets/97394017/5d4b858a-083e-4028-9170-f1d71652c222">
