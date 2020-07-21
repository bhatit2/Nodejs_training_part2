"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_json_db_1 = require("node-json-db");
const JsonDBConfig_1 = require("node-json-db/dist/lib/JsonDBConfig");
// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
var db = new node_json_db_1.JsonDB(new JsonDBConfig_1.Config("db", true, false, "/"));
// Pushing the data into the database
// With the wanted DataPath
// By default the push will override the old value
db.push("/users", []);
