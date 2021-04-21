"use strict";

/** Database setup for shareB&B. */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

//check for ssl config if problems
const db = new Client({
  connectionString: getDatabaseUri(),
});

db.connect();

module.exports = db;