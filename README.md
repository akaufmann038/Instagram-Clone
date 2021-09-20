# Instagram Clone
Instagram clone which allows authenticated users to post, view, edit, and delete pictures on a feed and direct message other users

## BackEnd
- Wrote a REST API in JavaScript using Node JS and Express JS
- Created authentication by generating random tokens which are sent to the frontend upon a successful login and stored in a 
session using express-session
- Wrote Express JS middleware that authenticates incoming API calls by validating the sent token with the express session.
If token is validated, all API functionality is accessible to the calling client. If not, no functionality is accessible.
- API provides access to the following functionality:
  - User registration
  - User login
  - Querrying all application data
  - Creating, editing, deleting posts
  - Creating, deleting direct messages
  - Creating direct message conversations
- Created functionality for direct message chatting server-side using Socket IO
  - Server socket listens for incoming events and sends event to correct client socket

## FrontEnd
- Coded client-side using Javascript and React JS
- Created routing using the React Router library
- The home page calls backend for applicaiton data and populates the component tree with received data
- Implemented PrivateRoute component which only allows authentication users to render the components within it.
  - Authentication information is stored utilizing React.createContext.
  - PrivateRoute checks the data storted in React.createContext and allows access if API auth token exists
  and reroutes to login page if not.
- Implemented direct messaging
  - Refreshes data in chat components upon sending a message or triggering Socket IO listener
  - Client-side Socket listens for message indicating that a message has been sent from the other user, allowing for frontend data 
  to be refreshed after every message sent (by either user)
  
## DataBase
- Modeled a MongoDB database schema to store the application’s data
- Querried and edited data using the Mongoose library
