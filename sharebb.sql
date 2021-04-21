\echo 'Delete and recreate share-bb db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE sharebb;
CREATE DATABASE sharebb;
\connect sharebb

\i sharebb-schema.sql

\echo 'Delete and recreate share-bb_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE sharebb_test;
CREATE DATABASE sharebb_test;
\connect sharebb_test

\i sharebb-schema.sql
