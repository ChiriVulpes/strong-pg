import { Merge2, ReplaceKey, TypeString } from "./IStrongPG";

interface SpecialKeys<SCHEMA> {
	PRIMARY_KEY?: keyof SCHEMA | (keyof SCHEMA)[];
}

type SchemaBase = Record<string, TypeString>;

// type Schema<SCHEMA extends SchemaBase = SchemaBase> = { PRIMARY_KEY?: keyof SCHEMA } & SCHEMA;

export interface DatabaseSchema {
	tables: Record<string, Record<string, any>>;
}

export namespace DatabaseSchema {
	export interface Empty {
		tables: {};
	}

	export type ReplaceTable<SCHEMA extends DatabaseSchema, TABLE extends TableName<SCHEMA>, TABLE_SCHEMA_NEW> =
		ReplaceKey<SCHEMA, "tables", ReplaceKey<SCHEMA["tables"], TABLE, TABLE_SCHEMA_NEW>>;
}

export type TableName<SCHEMA extends DatabaseSchema> = keyof SCHEMA["tables"] & string;

export function Schema<SCHEMA extends DatabaseSchema> (schema: SCHEMA): SCHEMA {
	return schema;
}

export namespace Schema {

	export type PrimaryKey<SCHEMA> =
		SCHEMA extends SpecialKeys<any> ? SCHEMA["PRIMARY_KEY"] : never;
	export type PrimaryKeyOrNull<SCHEMA> =
		SCHEMA extends { PRIMARY_KEY: infer KEY } ? KEY : null;

	export type PrimaryKeyed<SCHEMA, KEY extends keyof SCHEMA | (keyof SCHEMA)[]> =
		Merge2<SCHEMA, { PRIMARY_KEY: KEY }>;

	export type DropPrimaryKey<SCHEMA> = Pick<SCHEMA, Exclude<keyof SCHEMA, "PRIMARY_KEY">>;

	export function primaryKey<KEYS extends string[]> (...keys: KEYS): KEYS[number][] {
		return keys;
	}

	// this is a type function that validates the schema it receives
	type ValidateTableSchema<SCHEMA> =
		// type variables
		SpecialKeys<SCHEMA> extends infer SPECIAL_DATA ? // 
		keyof SPECIAL_DATA extends infer SPECIAL_KEYS ?
		Exclude<keyof SCHEMA, SPECIAL_KEYS> extends infer KEYS ?
		Pick<SCHEMA, KEYS & keyof SCHEMA> extends infer SCHEMA_CORE ?
		Pick<SCHEMA, SPECIAL_KEYS & keyof SCHEMA> extends infer SCHEMA_SPECIAL ?

		// the actual validation
		SCHEMA_CORE extends SchemaBase ?
		SCHEMA_SPECIAL extends SPECIAL_DATA ? SCHEMA : "Unknown or invalid special keys in schema"
		: "Invalid column types"

		: never : never : never : never : never;

	export function table<SCHEMA> (schema: SCHEMA): ValidateTableSchema<SCHEMA> {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return schema as any;
	}
}