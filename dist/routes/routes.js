"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../model/User"));
const Joi = __importStar(require("@hapi/joi"));
const express_joi_validation_1 = require("express-joi-validation");
const validator = express_joi_validation_1.createValidator();
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
const getAutoSuggestUsers = (db, limit, queryStr) => {
    return db.data.users
        .filter((user) => user.login.toLowerCase().includes(queryStr))
        .slice(0, limit);
};
const appRouter = (app, db) => {
    app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        let queryStr = ((_a = req.query.str) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        let limit = req.query.limit || 5;
        let data = getAutoSuggestUsers(db, limit, queryStr);
        res.send(data);
    }));
    app.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let index = db.getIndex("/users", req.params.id);
        let user = db.getData(`/users[${index}]`);
        res.send(user);
    }));
    app.post("/users/create", validator.body(schema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { login, password, age } = req.body;
        let user = new User_1.default(login, password, age);
        db.push("/users[]", user);
        res.send(user);
    }));
    app.put("/users/update/:id", (req, res) => {
        let index = db.getIndex("/users", req.params.id);
        let user = db.getData(`/users[${index}]`);
        let updatedUser = Object.assign(Object.assign({}, user), req.body);
        db.push(`/users[${index}]`, updatedUser);
        res.send(updatedUser);
    });
    app.delete("/users/delete/:id", (req, res) => {
        let index = db.getIndex("/users", req.params.id);
        let user = db.getData(`/users[${index}]`);
        user.isDeleted = true;
        db.push(`/users[${index}]`, user);
        res.send(user);
    });
};
exports.default = appRouter;
