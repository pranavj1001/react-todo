const DATABASE_INIT_TABLE_CODE = `
CREATE TABLE IF NOT EXISTS todos (id UUID, title TEXT, content TEXT, iscompleted BOOLEAN, buckets UUID[], createddate TIMESTAMP WITH TIME ZONE, modifieddate TIMESTAMP WITH TIME ZONE, isactive BOOLEAN);
CREATE TABLE IF NOT EXISTS buckets (id UUID, title TEXT, color text, isactive BOOLEAN);`;

const DATABASE_INIT_FUNCTION_CODE = `
CREATE OR REPLACE FUNCTION public.save_bucket(
	par_bucketid uuid DEFAULT NULL::uuid, 
	par_buckettitle text DEFAULT NULL::text, 
	par_bucketcolor text DEFAULT NULL::text)
    RETURNS json
    LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
var_data text;
var_statuscode int;
var_error text;
BEGIN
	var_error := '';
	BEGIN
		IF EXISTS (SELECT * FROM buckets WHERE title = par_buckettitle AND isactive = true) THEN
			var_statuscode := 1;
			var_data := 'Bucket already exists.';
		ELSIF par_bucketid IS NOT NULL THEN
			var_statuscode := 0;
			UPDATE buckets SET title = par_buckettitle, color = par_bucketcolor WHERE id = par_bucketid;
			var_data := 'Bucket updated.';
		ELSE
			var_statuscode := 0;
			INSERT INTO buckets (id, title, color, isactive) VALUES(uuid_generate_v4(), par_buckettitle, par_bucketcolor, true);
			var_data := 'New Bucket inserted.';
		END IF;

		EXCEPTION WHEN others THEN
			var_statuscode := 2;
			var_error := 'Some error occurred while inserting the Bucket.';
	END;
	RETURN json_build_object(
		'status', var_statuscode,
		'data', var_data,
		'error', var_error
	);
END;
$BODY$;


CREATE OR REPLACE FUNCTION public.remove_bucket(par_bucketid uuid)
    RETURNS json
    LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
var_data text;
var_statuscode int;
var_error text;
BEGIN
	var_error := '';
	BEGIN
		IF EXISTS (SELECT * FROM buckets WHERE id = par_bucketid AND isactive = true) THEN
			UPDATE buckets SET isactive = false WHERE id = par_bucketid;
			var_statuscode := 0;
			var_data := 'Bucket is now inactive.';
		ELSE
			var_statuscode := 1;
			var_data := 'No such Bucket found in database.';
		END IF;

		EXCEPTION WHEN others THEN
			var_statuscode := 2;
			var_error := 'Some error occurred while removing the Bucket.';
	END;
	RETURN json_build_object(
		'status', var_statuscode,
		'data', var_data,
		'error', var_error
	);
END;
$BODY$;

CREATE OR REPLACE FUNCTION public.get_all_buckets()
    RETURNS json
    LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
var_data json;
var_statuscode int;
var_error text;
BEGIN
	var_statuscode := 0;
	var_error := '';
	BEGIN
		var_data := (SELECT array_to_json(array_agg(row_to_json(t))) FROM (
						SELECT id, title, color FROM buckets WHERE isactive = true
					) t)::json;
		
		EXCEPTION WHEN others THEN
			var_statuscode := 11;
			var_error := 'Some error occurred while preparing the json object';
	END;
	
	RETURN json_build_object(
		'status', var_statuscode,
		'data', var_data,
		'error', var_error
	);
END;
$BODY$;
`;


module.exports = {
    PG_DB_INIT_TABLE: DATABASE_INIT_TABLE_CODE,
    PG_DB_INIT_FUNCTION: DATABASE_INIT_FUNCTION_CODE,
    LOST_PG_CONNECTION_MESSAGE: 'Lost PG Connection.',
    LISTENING_ON_PORT_MESSAGE: 'Listening on port number 5000',
    CREATE_UUID_OOSP: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'
};