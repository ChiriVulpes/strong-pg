import { Pool, PoolClient, QueryResult } from "pg";
import { InputTypeFromString, OutputTypeFromString } from "../IStrongPG";
import Schema, { TableSchema } from "../Schema";
import { ExpressionInitialiser } from "../expressions/Expression";
import Statement from "./Statement";
type SingleStringUnion<T> = ((k: ((T extends any ? () => T : never) extends infer U ? ((U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never) extends () => (infer R) ? R : never : never)) => any) extends (k: T) => any ? T : never;
type SelectResult<SCHEMA extends TableSchema, COLUMNS extends (Schema.Column<SCHEMA> | "*")[]> = {
    [K in "*" extends COLUMNS[number] ? Schema.Column<SCHEMA> : COLUMNS[number]]: OutputTypeFromString<SCHEMA[K]>;
};
export default class SelectFromTable<SCHEMA extends TableSchema, COLUMNS extends (Schema.Column<SCHEMA> | "*")[] = Schema.Column<SCHEMA>[], RESULT = SelectResult<SCHEMA, COLUMNS>[]> extends Statement<RESULT> {
    readonly tableName: string;
    readonly schema: SCHEMA;
    readonly columns: COLUMNS;
    private vars;
    constructor(tableName: string, schema: SCHEMA, columns: COLUMNS);
    private condition?;
    where(initialiser: ExpressionInitialiser<Schema.Columns<SCHEMA>, boolean>): this;
    primaryKeyed(id: InputTypeFromString<SCHEMA[SingleStringUnion<Schema.PrimaryKey<SCHEMA>[number]>]>): SelectFromTable<SCHEMA, COLUMNS, SelectResult<SCHEMA, COLUMNS> | undefined>;
    private _limit?;
    limit(count: 1): SelectFromTable<SCHEMA, COLUMNS, SelectResult<SCHEMA, COLUMNS> | undefined>;
    limit(count: number): SelectFromTable<SCHEMA, COLUMNS, SelectResult<SCHEMA, COLUMNS>[]>;
    compile(): Statement.Queryable[];
    queryOne(pool: Pool | PoolClient): Promise<SelectResult<SCHEMA, COLUMNS> | undefined>;
    protected resolveQueryOutput(output: QueryResult<any>): any;
}
export {};