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
// pgClient.on('connect', () => {
//     pgClient
//         .query(constants.PG_DB_INIT_TABLE)
//         .catch(error => console.log(error, 'not able to create tables'));
//     pgClient
//         .query(constants.CREATE_UUID_OOSP)
//         .catch(error => console.log(error, 'not able to create extension'));
//     pgClient
//         .query(constants.PG_DB_INIT_FUNCTION)
//         .catch(error => console.log(error, 'not able to create functions'));
// });
pgClient.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack)
    }
    client.query(constants.PG_DB_INIT_TABLE, (err, result) => {
        if (err) {
            return console.error('Error Creating Tables', err.stack);
        }
    });
    client.query(constants.CREATE_UUID_OOSP, (err, result) => {
        if (err) {
            return console.error('Error Creating Extension', err.stack);
        }
    });
    client.query(constants.PG_DB_INIT_FUNCTION, (err, result) => {
        release();
        if (err) {
            return console.error('Error Creating Function', err.stack);
        }
    });
});
// Postgres Client Setup ends ---------------

// Express Route Handlers starts ---------------
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// TODO APIs
app.post('/gettodos', async (req, res) => {
    const values = await pgClient.query('select get_todos($1)', [req.body.id]);
    res.send(values.rows[0].get_todos);
});
app.post('/savetodo', async (req, res) => {
    const { id, title, content, isCompleted, buckets, isBucketChanged } = req.body;
    const values = await pgClient.query(
        'select save_todo($1::uuid, $2, $3, $4::bool, $5::uuid[], $6::bool)', 
        [id, title, content, isCompleted, buckets, isBucketChanged]);
    res.send(values.rows[0].save_todo);
});
app.post('/removetodo', async (req, res) => {
    const values = await pgClient.query('select remove_todo($1::uuid)', [req.body.id]);
    res.send(values.row[0].remove_todo);
});

// Buckets APIs
app.post('/getbuckets', async (req, res) => {
    const values = await pgClient.query('select get_buckets($1)', [req.body.id]);
    res.send(values.rows[0].get_buckets);
});
app.post('/savebucket', async (req, res) => {
    const { id, title, color } = req.body;
    const values = await pgClient.query('select save_bucket($1::uuid, $2, $3)', [id, title, color]);
    res.send(values.rows[0].save_bucket);
});
app.post('/removebucket', async (req, res) => {
    const values = await pgClient.query('select remove_bucket($1::uuid)', [req.body.id]);
    res.send(values.rows[0].remove_bucket);
});

app.listen(5000, error => {
    console.log(constants.LISTENING_ON_PORT_MESSAGE);
});
// Express Route Handlers ends ---------------
