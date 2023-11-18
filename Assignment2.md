# Assignment 2

> [!IMPORTANT] 
> As of late, the list of questions appear to take very long to load, as there are over 2000 being fetched. Please wait for a minute and a half if you see no questions on the question list page. We apologise for the inconvenience, and seek your understanding.

## To set up and execute

### Download
Download the ZIP file named `ay2324s1-course-assessment-g17-Assignment-2-Updated.zip` from [Assignment-2-Updated](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g17/releases/tag/Assignment-2-Updated).
2. Unzip the file and navigate to the folder `ay2324s1-course-assessment-g17-Assignment-2-Updated`.

### Include .env files
3. Set up the environment for the question service, user service, and frontend by including the `.env` files for each, which have been submitted separately on CANVAS. Make sure they are `.env` files within the question service, user service, and frontend directories.

### Install dependencies
4. Change into each directory (`frontend`, `backend/question-service`, `backend/user-service`) and run `npm install` to install the dependencies for the question service, user service, and frontend.

Note: You may need to run `npm i --save-dev @types/cors` and `npm i --save-dev @types/express` should you encounter any errors.

### Set up postgresql
5. Start the postgresql used by the frontend by running below on another terminal window. 

```
docker run --rm -p 5432:5432 -e POSTGRES_HOST_AUTH_METHOD=trust postgres;
```

6. Then navigate to the user service directory (i.e. `ay2324s1-course-assessment-g17-Assignment-2-Updated/ay2324s1-course-assessment-g17-Assignment-2-Updated/backend/user-service`) and run the following commands:

```
npx prisma db push
npx prisma db seed
```

This will set up the postgresql database schema, and also seed the database with 1 ADMIN role user account, the "designated maintainer role" account, and 1 USER role user accounts, "registered users". Details for usernames and passwords below.

```
ADMIN role account details:
username: admin_user
password: admin_password 

USER role account details:
username: regular_user
password: user_password
```

Other accounts signed up from the application interface are all USER role user accounts, "registered users". 

## Finished set up
7. `npm start` the question service, user service, and frontend.

## Notes
To see the user database, you can simply run the command `npx prisma studio`, which will open up an interface for you to easily view the user database.
