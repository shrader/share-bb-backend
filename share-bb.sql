\echo 'Delete and recreate share-bb db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE share-bb;
CREATE DATABASE share-bb;
\connect share-bb

\i share-bb-schema.sql
\i share-bb-seed.sql

\echo 'Delete and recreate share-bb_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE share-bb_test;
CREATE DATABASE share-bb_test;
\connect share-bb_test

\i share-bb-schema.sql
