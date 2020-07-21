import User, { IUser } from "../model/User";
import { Request, Response } from "express";
import * as Joi from "@hapi/joi";
import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
  createValidator
} from "express-joi-validation";

const validator = createValidator();

const schema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9_]+$"))
    .required(),
  age: Joi.number()
    .integer()
    .min(4)
    .max(130)
    .required()
});

interface UserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    login: string;
    password: string;
    age: number;
  };
}

const getAutoSuggestUsers = (db : any, limit: any, queryStr : string) : IUser[] => {
  return db.data.users
      .filter((user: IUser) => user.login.toLowerCase().includes(queryStr))
      .slice(0, limit);
}

const appRouter = (app: any, db: any) => {
  app.get("/users", async (req: Request, res: Response) => {
    let queryStr : string = req.query.str?.toString() || "";
    let limit = req.query.limit || 5;
    let data: IUser[] = getAutoSuggestUsers(db, limit, queryStr);
    res.send(data);
  });
  app.get("/user/:id", async (req: Request, res: Response) => {
    let index = db.getIndex("/users", req.params.id);
    let user = db.getData(`/users[${index}]`);
    res.send(user);
  });
  app.post(
    "/users/create",
    validator.body(schema),
    async (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
      let { login, password, age } = req.body;
      let user = new User(login, password, age);
      db.push("/users[]", user);
      res.send(user);
    }
  );

  app.put("/users/update/:id", (req: Request, res: Response) => {
    let index = db.getIndex("/users", req.params.id);
    let user = db.getData(`/users[${index}]`);
    let updatedUser = { ...user, ...req.body };
    db.push(`/users[${index}]`, updatedUser);
    res.send(updatedUser);
  });

  app.delete("/users/delete/:id", (req: Request, res: Response) => {
    let index = db.getIndex("/users", req.params.id);
    let user = db.getData(`/users[${index}]`);
    user.isDeleted = true;
    db.push(`/users[${index}]`, user);
    res.send(user);
  });
};

export default appRouter;
