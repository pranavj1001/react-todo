const keys = require('./keys');
const constants = require('./string-constants');

// Express App Setup starts ---------------
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// Express App Setup ends ---------------

// Postgres Client Setup starts ---------------
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHOST,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});
pgClient.on('error', () => console.log(constants.LOST_PG_CONNECTION_MESSAGE));
pgClient
    .query(constants.PG_CLIENT_CREATE_TODO_TABLE)
    .catch(error => console.log(error, 'not able to create table'));
pgClient
    .query(constants.PG_CLIENT_CREATE_BUCKETS_TABLE)
    .catch(error => console.log(error, 'not able to create table'));
// Postgres Client Setup ends ---------------

// Express Route Handlers starts ---------------
app.get('/', (req, res) => {
    res.send('Hi');
});
app.get('/gettodos', async (req, res) => {
    const values = await pgClient.query(constants.PG_CLIENT_SELECT_ALL_VALUES_TABLE_QUERY);
    res.send(values.rows);
});
app.get('/getbuckets', async (req, res) => {
    const values = await pgClient.query(constants.PG_CLIENT_SELECT_ALL_VALUES_TABLE_QUERY);
    res.send(values.rows);
});
app.post('/savetodo', async (req, res) => {
    const index = req.body.index;
    if (parseInt(index) > 40) {
        return  res.status(422).send(constants.INDEX_VALUE_TOO_HIGH_MESSAGE);
    }
    // save in postgres database
    pgClient.query(constants.PG_CLIENT_INSERT_VALUE_TABLE_QUERY, [index]);

    res.send({ working: true });
});

app.listen(5000, error => {
    console.log(constants.LISTENING_ON_PORT_MESSAGE);
});
// Express Route Handlers ends ---------------
