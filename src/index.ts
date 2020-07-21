import express from "express";
import bodyParser from "body-parser";
import appRouter from "./routes/routes";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

var db = new JsonDB(new Config("db", true, false, "/"));

// Pushing the data into the database
// With the wanted DataPath
// By default the push will override the old value
db.push("/users", []);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = appRouter(app, db);

app.listen(3001, () => {
  console.log("listening on port %s... 3001");
});
