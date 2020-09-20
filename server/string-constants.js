const DATABASE_INIT_TABLE_CODE = `
CREATE TABLE IF NOT EXISTS todos (
	id UUID, 
	title TEXT, 
	content TEXT, 
	iscompleted BOOLEAN, 
	createddate TIMESTAMP WITH TIME ZONE,
	modifieddate TIMESTAMP WITH TIME ZONE, 
	isactive BOOLEAN,
	PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS buckets (
	id UUID, 
	title TEXT, 
	color text, 
	createddate TIMESTAMP WITH TIME ZONE, 
	modifieddate TIMESTAMP WITH TIME ZONE, 
	isactive BOOLEAN,
	PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS todos_buckets_mapping (
	id UUID, 
	todoid uuid, 
	bucketid uuid, 
	PRIMARY KEY(id), 
	CONSTRAINT fk_todoid FOREIGN KEY(todoid) REFERENCES todos(id), 
	CONSTRAINT fk_bucketid FOREIGN KEY(bucketid) REFERENCES buckets(id)
);`;

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
		IF EXISTS (SELECT * FROM buckets WHERE lower(title) = lower(par_buckettitle) AND isactive = true) AND (par_bucketid IS NULL) THEN
			var_statuscode := 1;
			var_data := 'Bucket already exists.';
		ELSIF par_bucketid IS NOT NULL THEN
		IF EXISTS (SELECT * FROM buckets WHERE lower(title) = lower(par_buckettitle) AND id != par_bucketid AND isactive = true) THEN
			var_statuscode := 1;
			var_data := 'Bucket already exists.';
		ELSIF EXISTS (SELECT * FROM buckets WHERE id = par_bucketid AND isactive = true) THEN
			UPDATE 
				buckets 
			SET 
				title = par_buckettitle, 
				color = par_bucketcolor,
				modifieddate = (select now())
			WHERE 
				id = par_bucketid;
				var_statuscode := 0;
			var_data := 'Bucket updated.';
		ELSE
			var_statuscode := 2;
			var_data := 'Bucket is inactive.';
		END IF;
		ELSE
			var_statuscode := 0;
			INSERT INTO 
				buckets (id, title, color, createddate, modifieddate, isactive) 
			VALUES
				(uuid_generate_v4(), 
				 par_buckettitle, 
				 par_bucketcolor, 
				 (select now()),
				 (select now()),
				 true);
			var_data := 'New Bucket inserted.';
		END IF;

		EXCEPTION WHEN others THEN
			var_statuscode := 3;
			var_error := 'Some error occurred while inserting the Bucket.';
	END;
	RETURN json_build_object(
		'status', var_statuscode,
		'data', var_data,
		'error', var_error
	);
END;
$BODY$;


CREATE OR REPLACE FUNCTION public.remove_bucket(
	par_bucketid uuid)
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
			DELETE FROM todos_buckets_mapping WHERE bucketid = par_bucketid;
			UPDATE buckets SET isactive = false WHERE id = par_bucketid;
			var_statuscode := 0;
			var_data := 'Bucket is now inactive.';
		ELSE
			var_statuscode := 1;
			var_data := 'No such Bucket found in database.';
		END IF;

		EXCEPTION WHEN others THEN
			var_statuscode := 3;
			var_error := 'Some error occurred while removing the Bucket.';
	END;
	RETURN json_build_object(
		'status', var_statuscode,
		'data', var_data,
		'error', var_error
	);
END;
$BODY$;



CREATE OR REPLACE FUNCTION public.get_buckets(
	par_id uuid DEFAULT NULL::uuid
	)
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
		IF par_id IS NOT NULL THEN
			var_data := (SELECT json_agg(t) FROM (
							SELECT 
								id, 
								title, 
								color,
								createddate AS createdDate,
								modifieddate AS modifiedDate
							FROM 
								buckets 
							WHERE 
								isactive = true
								AND
								id = par_id
						) t)::json;
		ELSE
			var_data := (SELECT json_agg(t) FROM (
							SELECT 
								id, 
								title, 
								color,
								createddate AS createdDate,
								modifieddate AS modifiedDate
							FROM 
								buckets 
							WHERE 
								isactive = true
							ORDER BY
								createddate
						) t)::json;
		END IF;
		
		EXCEPTION WHEN others THEN
			var_statuscode := 3;
			var_error := 'Some error occurred while preparing the json object';
	END;
	
	RETURN json_build_object(
		'status', var_statuscode,
		'data', var_data,
		'error', var_error
	);
END;
$BODY$;


CREATE OR REPLACE FUNCTION public.save_todo(
	par_id uuid DEFAULT NULL::uuid,
	par_title text DEFAULT NULL::text,
	par_content text DEFAULT NULL::text,
	par_iscompleted boolean DEFAULT NULL::boolean,
	par_buckets uuid[] DEFAULT NULL::uuid[],
	par_isbucketchanged boolean DEFAULT true)
    RETURNS json
    LANGUAGE 'plpgsql'

AS $BODY$
DECLARE
var_data text;
var_statuscode int;
var_error text;
var_todoid uuid;
BEGIN
	var_error := '';
	var_statuscode := 0;
	BEGIN
		IF par_id IS NOT NULL THEN
			UPDATE 
				todos 
			SET 
				title = par_title, 
				content = par_content,
				iscompleted = par_iscompleted,
				modifieddate = (select now())
			WHERE 
				id = par_id;
			IF par_isbucketchanged = true THEN
				DELETE FROM todos_buckets_mapping WHERE todoid = par_id;
				INSERT INTO todos_buckets_mapping
					(id, todoid, bucketid)
				VALUES
					(
						uuid_generate_v4(),
						var_todoid,
						UNNEST(par_buckets)
					);
			END IF;
			
			var_data := 'Todo updated.';
		ELSE
			var_todoid = (SELECT uuid_generate_v4());
			INSERT INTO todos 
				(id, title, content, iscompleted, createddate, modifieddate, isactive) 
			VALUES
				(var_todoid, 
				 par_title, 
				 par_content,
				 par_iscompleted,
				 (select now()),
				 (select now()),
				 true);
			INSERT INTO todos_buckets_mapping
				(id, todoid, bucketid)
			VALUES
				(
					uuid_generate_v4(),
					var_todoid,
					UNNEST(par_buckets)
				);
			var_data := 'New Todo inserted.';
		END IF;

		EXCEPTION WHEN others THEN
			var_statuscode := 3;
			var_error := 'Some error occurred while inserting the Todo.';
	END;
	RETURN json_build_object(
		'status', var_statuscode,
		'data', var_data,
		'error', var_error
	);
END;
$BODY$;


CREATE OR REPLACE FUNCTION public.remove_todo(
	par_todoid uuid)
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
		IF EXISTS (SELECT * FROM todos WHERE id = par_todoid AND isactive = true) THEN
			DELETE FROM todos_buckets_mapping WHERE todoid = par_todoid;
			UPDATE todos SET isactive = false WHERE id = par_todoid;
			var_statuscode := 0;
			var_data := 'Todo is now inactive.';
		ELSE
			var_statuscode := 1;
			var_data := 'No such Todo found in database.';
		END IF;

		EXCEPTION WHEN others THEN
			var_statuscode := 3;
			var_error := 'Some error occurred while removing the Todo.';
	END;
	RETURN json_build_object(
		'status', var_statuscode,
		'data', var_data,
		'error', var_error
	);
END;
$BODY$;


CREATE OR REPLACE FUNCTION public.get_todos(
	par_id uuid DEFAULT NULL::uuid
	)
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
		IF par_id IS NOT NULL THEN
			var_data := (SELECT json_agg(t1) FROM (
							SELECT 
								id, 
								title, 
								content, 
								iscompleted,
								(
									SELECT 
										json_agg(t2) 
									FROM (
										SELECT 
											buc.id, buc.title, buc.color
										FROM 
											todos_buckets_mapping tbm
										INNER JOIN
											buckets buc
										ON
											buc.id = tbm.bucketid
										WHERE 
											tbm.todoid = tot.id
									) t2
								) AS buckets,
								createddate AS createdDate,
								modifieddate AS modifiedDate
							FROM 
								todos tot
							WHERE 
								isactive = true
								AND
								tot.id = par_id
						) t1)::json;
		ELSE
			var_data := (SELECT json_agg(t1) FROM (
							SELECT 
								id, 
								title, 
								content, 
								iscompleted,
								(
									SELECT 
										json_agg(t2) 
									FROM (
										SELECT 
											buc.id, buc.title, buc.color
										FROM 
											todos_buckets_mapping tbm
										INNER JOIN
											buckets buc
										ON
											buc.id = tbm.bucketid
										WHERE 
											tbm.todoid = tot.id
									) t2
								) AS buckets,
								createddate AS createdDate,
								modifieddate AS modifiedDate
							FROM 
								todos tot
							WHERE 
								isactive = true
							ORDER BY
								createddate
						) t1)::json;
		END IF;
		
		EXCEPTION WHEN others THEN
			var_statuscode := 3;
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