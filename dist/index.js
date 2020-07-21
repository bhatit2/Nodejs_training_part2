"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./routes/routes"));
const node_json_db_1 = require("node-json-db");
const JsonDBConfig_1 = require("node-json-db/dist/lib/JsonDBConfig");
var db = new node_json_db_1.JsonDB(new JsonDBConfig_1.Config("db", true, false, "/"));
// Pushing the data into the database
// With the wanted DataPath
// By default the push will override the old value
db.push("/users", []);
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const routes = routes_1.default(app, db);
app.listen(3001, () => {
    console.log("listening on port %s... 3001");
});
