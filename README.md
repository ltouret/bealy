# Bealy Travel test

To launch the project be sure to have installed docker (and docker-compose) and use the command: make

Added a insomnia json (v4) file to test each route described in this documentation 

For this Api I used as database postgresql with typeorm as orm.

Routes of the API

Each route of the api is guarded by checking the cookie access_token for a jwt, this token will expire after 15 minutes, with the exception of user/signup and user/login
Only the user that created a place in the database can delete or modify it.

POST /user/signup
  - Creates a new user in the database
  - To do this need to receive as json body an object {email, password}
  - Returns object with status (201 success or 409 failure) and user object {email, id}
  - Cant repeat as email its unique in the database

POST /user/login
  - Log in to the service
  - To do this need to receive the same as the signup object
  - Returns object with status (201 success or 401 unauthorized) and jwt access token

GET /user/me
  - Returns user with an array of all the places created

GET /user/logout
  - Log out the user if connected, if it does then it returns an object {status : "success"}

GET /travel
  - Returns all the places in the database, no matter the user who created them, returns 404 if there are no places in the database

GET /travel/:id
  - Returns the place corresponding to the :id, no matter the user who created them, 404 if not found

GET /travel/score?score=
  - Returns an array with all the places created by the user that is logged in that have a score equal or bigger than the score received as query (score), returns 404 if no places are found
  - Receives as query a number score

GET /travel/search?keyword=
  - Returns an array with all the places that have the keyword in the place object, that may be in the title, localisation or description field, returns a 404 if no place is found
  - Receives as query a string keyword

DELETE /travel/:id
  - Deletes the place corresponding to the :id, 404 if not found

POST /travel
  - The user logged in creates a new place in the database
  - Receives as json body an object Place {title, description, localisation, score}

PUT /travel
  - The user logged in updates a place in the database, this happens only if the user created the place that he wants to modify.
  - Receives as json body an object Place {id, title, description, localisation, score}
