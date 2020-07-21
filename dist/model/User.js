"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class User {
    constructor(login, password, age) {
        this.id = uuid_1.v4();
        this.login = login;
        this.password = password;
        this.age = age;
        this.isDeleted = false;
    }
}
exports.default = User;
