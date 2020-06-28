
# General information

Within this package is the GraphQL API interface that 
translates frontend inputs to the backend and vise
versa using GraphQL. When the API is running it will 
be accessible from: 

http://localhost:4000/

In GraphQL there is tool to allow direct manipulation 
of the API using a text based GUI. This would be 
accessible from:

http://localhost:4000/graphql

From here you can run querys to search data and 
mutations for creating, updating and deleting. You can 
see examples of these in the folder called examples.

Within package.json, you will see the list of 
dependencies for this project aswell as their 
versions.

The docker container for this project can be found 
from: 

https://hub.docker.com/r/justox51/wisetreeapi

or pulled into docker from: 

docker pull justox51/wisetreeapi 

# How to get started

1.  Open folder in terminal or code editor
2.  Install / Update NPM / sudo npm install -g npm
3.  Check version of NPM (Current 6.14.5) / npm -v
4.  Install project dependancies / npm install
5.  Run server / npm (run) start

# Database Details

Currently, this API is connected to a Mongo DB 
database with the credentials specified in app.js
in line 18. The app is able to run on any MongoDB 
database withthe permissions able to read and write
data and can be easily changed.

# Dockerfile Details

If you would like to put a new version into a 
container, this is listed in the project as 
Dockerfile. To build this image you can with the 
command: 

docker build --tag wisetreeapi:XX.XX . 


