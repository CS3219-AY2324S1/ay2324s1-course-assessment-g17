# Assignment 3

> [!IMPORTANT]
> As of late, the list of questions appear to take very long to load, as there are over 2000 being fetched. Please wait for a minute and a half if you see no questions on the question list page. We apologise for the inconvenience, and seek your understanding.

## To set up and execute

### Download

1. Download the ZIP file named `ay2324s1-course-assessment-g17-Assignment-3-updated.zip` from the [Assignment-3-updated](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g17/releases/tag/Assignment-3-updated).
2. Unzip the file and navigate to the folder `ay2324s1-course-assessment-g17-Assignment-3-updated`.

### Include .env files

3. Set up the environment for the question service, user service, and frontend by including the `.env` files for each, which have been submitted as:
   `Assignment3-QuestionServiceEnv.txt`,
   `Assignment3-UserServiceEnv.txt`,
   `Assignment3-FrontendEnv.txt` respectively.
   Make sure they are `.env` files within the question service, user service, and frontend directories.

For convenience, they have been placed here:

`Assignment3-QuestionServiceEnv.txt`

```
MONGO_CONNECTION_STRING=mongodb+srv://sherylhci:wsY2vQnTjSStiIQ8@cluster0.kxz8d7c.mongodb.net/peerprep_app?retryWrites=true&w=majority
PORT=8080
ACCESS_TOKEN_SECRET="access_secret"
REFRESH_TOKEN_SECRET="refresh_secret"
FRONTEND_URL="http://localhost:3000"
```

`Assignment3-UserServiceEnv.txt`

```
DATABASE_URL="postgresql://postgres@localhost:5432/postgres?schema=public"
PORT=8000
ACCESS_TOKEN_SECRET="access_secret"
REFRESH_TOKEN_SECRET="refresh_secret"
FRONTEND_URL="http://localhost:3000"
```

`Assignment3-FrontendEnv.txt`

```
REACT_APP_BACKEND_URL=http://localhost:8080/api
REACT_APP_USER_SERVICE_BACKEND_URL=http://localhost:8000/
```

### Install dependencies

4. Run `npm install` to install the dependencies for the question service, user service, and frontend.

### Set up postgresql

5. Start the postgresql used by the frontend by running below on another terminal window.

```
docker run --rm -p 5432:5432 -e POSTGRES_HOST_AUTH_METHOD=trust postgres;
```

6. Then navigate to the user service directory (i.e. `ay2324s1-course-assessment-g17-Assignment-3-updated/ay2324s1-course-assessment-g17-Assignment-3-updated/backend/user-service`) and run the following commands:

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
