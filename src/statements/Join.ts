import Schema, { TableSchema } from "../Schema";
import Expression, { ExpressionInitialiser } from "../expressions/Expression";
import Statement from "./Statement";

enum JoinType {
	Inner,
	"Left Outer",
	"Full Outer",
	"Right Outer",
}

type JoinTypeName = Uppercase<keyof typeof JoinType>;

type SelectableColumns<TABLE1 extends TableSchema, TABLE2 extends TableSchema, TABLE1_NAME extends string, TABLE2_NAME extends string> =
	Schema.Column<TABLE1> extends infer TABLE1_COLUMNS extends string ?
	Schema.Column<TABLE2> extends infer TABLE2_COLUMNS extends string ?
	Exclude<TABLE1_COLUMNS, TABLE2_COLUMNS> | Exclude<TABLE2_COLUMNS, TABLE1_COLUMNS> extends infer COLUMNS_UNION ?

	| COLUMNS_UNION
	| `${TABLE1_NAME}.${TABLE1_COLUMNS}`
	| `${TABLE2_NAME}.${TABLE2_COLUMNS}`

	: never : never : never;

export default class Join<TABLE1 extends TableSchema, TABLE2 extends TableSchema, TABLE1_NAME extends string, TABLE2_NAME extends string, ALIAS1 extends string, ALIAS2 extends string> extends Statement {

	private vars: any[] = [];
	public constructor (public readonly type: JoinTypeName, public readonly table1: TABLE1_NAME, public readonly table2: TABLE2_NAME, public readonly alias1?: ALIAS1, public readonly alias2?: ALIAS2) {
		super();
	}

	private condition?: string;
	public on (initialiser: ExpressionInitialiser<Schema.Columns<TABLE1, `${ALIAS1}.`> & Schema.Columns<TABLE2, `${ALIAS2}.`>, boolean>) {
		const queryable = Expression.compile(initialiser, undefined, this.vars);
		this.condition = `ON (${queryable.text})`;
		return this;
	}

	public select<COLUMNS extends SelectableColumns<TABLE1, TABLE2, ALIAS1, ALIAS2>[]> (...columns: COLUMNS) {

	}

	public override compile (): Statement.Queryable[] {
		if (this.type !== "INNER" && !this.condition)
			throw new Error(`Unable to join ${this.table1} and ${this.table2}, no ON expression provided`);

		const type = this.type === "INNER" && !this.condition ? "CROSS" : this.type;
		return this.queryable(`${this.table1} ${this.alias1 ?? ""} ${type} JOIN ${this.table2} ${this.alias2 ?? ""} ${this.condition ?? ""}`, undefined, this.vars);
	}
}
