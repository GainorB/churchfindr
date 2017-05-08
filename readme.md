# ChurchFindr
An application that finds local churches or churches using a zip code, with YELP reviews to help the user to find a comfortable fit. Possibly use Google Reviews if it is tied into the Maps API.

### Wireframing

https://trello.com/

### User Stories
1. A user vists the application
2. A user reads the description of the application
3. A user can then browse different aspects of the website to find out more on functionality
4. An unregistered user is prompted to Register
5. Once user is registered you can locate churches around your location

### API's
* Google Places API

### Landing Page
1. The user will see a brief description of the app and its functions
2. From there the user can register
    * Mandatory: first name, last name, Email, Password, etc..
3. Login
4. Logout

### API Usage
* Utilize Google Places API to locate churches around the user

### MVP
1. ~~Theme~~
2. ~~Proper routing/views/css~~
3. ~~Registration/Login/Logout~~
4. ~~Connect and store users in a database~~
    * ~~Retrieving information as well~~
5. ~~Using Google Places API to locate churches~~

### Wish List
1. Incorporating Google Reviews
2. Leave reviews in the app
3. Save visited churches to profile
4. Text a user the address of the church they chose

### Technologies used
1. HTML/CSS/Javascript
2. Node.js
3. Express
4. PostgreSQL Databases

### Database

https://gist.github.com/GainorB/5b430fda91e2e246e67dbe05b7f6a272

### Node Modules
1. Passport: http://passportjs.org/
    * To build a User System with authentication
    * Registration Form to store User's preferences
2. Axios (CRUD)
    * Library used to interact with the server. (send and receive information)
3. PG-Promise
    * Used to read SQL queries on Node
4. Logger
    * Terminal logger
5. Express Validator
    * Used to validate input from form submission
6. Body-Parser
    * Parse HTML and receive json object based on inputs on the server
7. DotENV
    * Allows .env support
8. bluebird
    * A promise library that is quick, easy to debug and full of features
9. Express
    * Used with Node.js
10. Path
    * Used to set up public folder for static files.
11. Express Session
    * Used to enable sessions, to track users activity and to keep users logged in.
12. CORS
    * Used to manage Cross Origin issues
13. Request
    * Make HTTP calls (Used to GET Google API)

### Download Project & Install
1. Git clone or download this project
2. Open up Terminal or command line
3. Navigate to the directory where the project was cloned to or downloaded to
4. Run this command: psql -f models/schema.sql
5. This command will create a PostgreSQL database along with the tables
6. If you haven't already, install nodemon with this command: npm install -g nodemon
7. To run the application, you need to install the dependencies, run this command: npm install --save
8. To start the application, run this command: npm run dev
9. The application will run at: localhost:3000, if that port is already in use, run this command: PORT=1738 npm run dev
10. This command will start the server at: localhost:1738