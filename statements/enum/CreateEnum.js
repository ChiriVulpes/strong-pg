"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Statement_1 = __importDefault(require("../Statement"));
class CreateEnum extends Statement_1.default {
    constructor(name) {
        super();
        this.name = name;
    }
    compile() {
        return `CREATE TYPE ${this.name} AS ENUM ()`;
    }
}
exports.default = CreateEnum;
