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
pgClient.on('connect', () => {
    pgClient
        .query(constants.PG_DB_INIT_TABLE)
        .catch(error => console.log(error, 'not able to create tables'));
    pgClient
        .query(constants.CREATE_UUID_OOSP)
        .catch(error => console.log(error, 'not able to create extension'));
    pgClient
        .query(constants.PG_DB_INIT_FUNCTION)
        .catch(error => console.log(error, 'not able to create functions'));
});
// Postgres Client Setup ends ---------------

// Express Route Handlers starts ---------------
app.get('/', (req, res) => {
    res.send('Hi');
});

// TODO APIs
app.get('/gettodos', async (req, res) => {
    const values = await pgClient.query('select get_all_buckets()');
    res.send(values);
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

// Buckets APIs
app.get('/getbuckets', async (req, res) => {
    const values = await pgClient.query('select get_all_buckets()');
    res.send(values.rows);
});
app.post('/savebucket', async (req, res) => {
    const values = await pgClient.query('select save_bucket($1, $2, $3)', [req.id, req.title, req.color]);
    res.send(values.rows);
});
app.post('/removebucket', async (req, res) => {
    const values = await pgClient.query('select remove_bucket($1)', [req.id]);
    res.send(values.rows);
});

app.listen(5000, error => {
    console.log(constants.LISTENING_ON_PORT_MESSAGE);
});
// Express Route Handlers ends ---------------
