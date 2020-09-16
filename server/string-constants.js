module.exports = {
    PG_CLIENT_CREATE_TODO_TABLE : 'CREATE TABLE IF NOT EXISTS todos (id UUID, title TEXT, content TEXT, iscompleted BOOLEAN, buckets UUID[], createddate TIMESTAMP WITH TIME ZONE, modifieddate TIMESTAMP WITH TIME ZONE, isactive BOOLEAN)',
    PG_CLIENT_CREATE_BUCKETS_TABLE : 'CREATE TABLE IF NOT EXISTS buckets (id UUID, title TEXT, color text, isactive BOOLEAN)',
    PG_CLIENT_SELECT_ALL_VALUES_TABLE_QUERY: 'SELECT * FROM buckets',
    PG_CLIENT_INSERT_VALUE_TABLE_QUERY: 'INSERT INTO buckets (id, title) VALUES($1)',
    LOST_PG_CONNECTION_MESSAGE: 'Lost PG Connection.',
    LISTENING_ON_PORT_MESSAGE: 'Listening on port number 5000',
    CREATE_UUID_OOSP: 'CREATE EXTENSION "uuid-ossp"'
};