# Assignment-4

## To set up and execute

1. Download and unzip the file for [Assignment 4](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g17/archive/refs/tags/Assignment-4.zip). `cd` into it.
2. Set up environment variables.
   > The unredacted environment variable `MONGO_CONNECTION_STRING` can be found in our Canvas submission for private variables.

- frontend
  - Save the frontend variables under `frontend/.env`.
    ```
    REACT_APP_BACKEND_URL=http://localhost:8080/api
    REACT_APP_USER_SERVICE_BACKEND_URL=http://localhost:8000/
    ```
- user-service

  - Save the user-service variables twice in `backend/user-service/.env` and `backend/user-service/.env.docker`
    - backend/user-service/.env.docker
    ```
    DATABASE_URL="postgresql://postgres:postgres@postgres:5432/peerprep?schema=public"
    PORT=8000
    JWT_SECRET="secret"
    FRONTEND_URL="http://localhost:3000"
    ```
    - backend/user-service/.env
      (need to change DATABASE_URL because we would not be in docker compose's network)
    ```
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/peerprep?schema=public"
    PORT=8000
    JWT_SECRET="secret"
    FRONTEND_URL="http://localhost:3000"
    ```

- question-service
  - Save the question-service variables under `backend/question-service/.env`
    ```
    MONGO_CONNECTION_STRING=<redacted>
    PORT=8080
    FRONTEND_URL="http://localhost:3000"
    ```

3. Actually run it with Docker.

- Option 1 (recommended): Docker Compose
  1. cd into all frontend/backend services and type `npm install`
  2. `docker-compose up`
- Option 2: Running individually with `docker`
  1. Navigate to the folder of the zip file you unzipped previously.
  2. `cd backend/question-service`
  3. `docker build . -t question-service && docker run -p 8080:8080 -d question-service`
  4. Open another terminal tab. Repeat step 1.
  5. `cd backend/user-service`
  6. `docker build . -t user-service && docker run -p 8000:8000 -d user-service`

4. Testing

- If you used option 1, the frontend should be up as well, navigate to http://localhost:3000 to see the results.
- If you used option 2, you can use some curl commands to verify the services work
  - Question service: `curl localhost:8080/api/questions/1`
  - User service: `curl localhost:8000/currentUser`
