//Initial app.js to get the GraphQL API up and running for querys and mutations to be made
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql-schema/schema'); // Links our schema for grapql server
const mongoose = require('mongoose'); // importing our ORM
const cors = require('cors');
const path = require('path'); 
const app = express();


// Allow CORS
app.use(cors());

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose
    // To change the database connection, edit the next line
    .connect(
        'mongodb+srv://thetrung2411:mr0royal@cluster0-2spqi.mongodb.net/Cluster0?retryWrites=true&w=majority'
    )
    .then(() => {
        console.log('connected to database');
        // To change the host port, edit the next line
        app.use(
            '/graphql',
            graphqlHTTP({
                schema,
                graphiql: true,
            })
        );
        app.use(express.static('public'));
        app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
        })  
        app.listen(5000, () => {
            console.log('now listening for requests on port 4000');
        });
    })
    .catch(err => {
        console.log(err);
    });
