"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const History_1 = require("./History");
class Database {
    constructor(schema, pool) {
        this.schema = schema;
        this.pool = pool;
    }
    async migrate() {
        return this.history?.migrate(this.pool);
    }
    setHistory(initialiser) {
        this.history = initialiser(new History_1.History());
        return this;
    }
    /**
     * @deprecated WARNING: This drops and recreates your database!
     */
    async drop() {
        return this.pool.query("DROP OWNED BY CURRENT_USER CASCADE");
    }
}
exports.default = Database;
