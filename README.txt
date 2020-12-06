To setup this server locally, follow these steps (why are you not using Docker though? 🙄)

Step 1:
Run "npm i" or "npm install" to install all the project dependencies

Step 2:
Create a file at the root of the project and name it ".env"
In the file, specify the following parameters as so:

PORT=value

#Database credentials
DB_HOST=value
DB_USERNAME=value
DB_PASSWORDvalue
DB_NAME=value
DIALECT=value
CLEARDB_DATABASE_URL=value

JWT_SECRET=value
JWT_EXPIRES_IN=value
JWT_COOKIE_EXPIRES_IN=value
JWT_ISSUER=value

EMAIL_HOST=value
EMAIL_USERNAME=value
EMAIL_PASSWORD=value
EMAIL_PORT=value

GMAIL_EMAIL_HOST=value
GMAIL_EMAIL_USERNAME=value
GMAIL_EMAIL_PASSWORD=value
GMAIL_EMAIL_PORT=value

Step 3:
In the "models/hospital_admin.js" and "models/police_admin.js" files, comment out the validate hooks of the database

Step 4:
Create a database using the name specified for databases in local environments in the "/models/config/config.json" file

Step 5:
Seed the local detabase by running "npm run seed:dev"

Step 6:
In the "models/hospital_admin.js" and "models/police_admin.js" files, uncomment the validate hooks of the database you commented out in Step 3 of this README

Step 7:
Run "npm run start:dev" to start the server locally.
It should be able to run nodemon in the background, restarting the server whenever you make changes to it

