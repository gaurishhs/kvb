import { Database } from "bun:sqlite";
import Validator, { type AsyncCheckFunction, type SyncCheckFunction, type ValidationSchema, type ValidatorConstructorOptions } from "fastest-validator";
interface KVBaseOptions<T = any> {
    bunOptions?: { filename?: string; options?: | number | { readonly?: boolean; create?: boolean; readwrite?: boolean } };
    tableName?: string;
    schema?: ValidationSchema<T>;
    validatorOptions?: ValidatorConstructorOptions;
}
export class KVBase<T = any> {
    protected db: Database;
    public v?: Validator;
    protected checker?: SyncCheckFunction | AsyncCheckFunction;
    constructor(private o: KVBaseOptions = { tableName: "kvbase" }) {
        this.db = new Database(
            o.bunOptions?.filename ?? ":memory:",
            o.bunOptions?.options ?? { readonly: false, create: true }
        );
        this.db.run(
            `CREATE TABLE IF NOT EXISTS ${o.tableName} (key TEXT PRIMARY KEY, value TEXT)`
        );
        if (o.schema) {
            this.v = new Validator(o.validatorOptions);
            this.checker = this.v.compile(o.schema);
        }
    }
    async get(key: string, first?: boolean): Promise<T | undefined> {
        const p = (v: string) => {
            try {
                return JSON.parse(v);
            } catch {
                return v;
            }
        }
        const result = first
            ? this.db.query(`SELECT value FROM ${this.o.tableName}`).get(key)
                ?.value
            : this.db
                .query(`SELECT value FROM ${this.o.tableName}`)
                .all(key)
                .map((v: any) => v.value);
        if (result) {
            if (/^\s*(\{|\[)/.test(result)) {
                return p(result)
            } else return result
        } else return undefined
    }
    async set(key: string, value: T): Promise<void> {
        if (this.checker) {
            const check = this.checker(value);
            if (check !== true) throw new Error(check.toString());
        }
        return this.db.run(
            `INSERT OR REPLACE INTO ${this.o.tableName} VALUES ($key, $value)`,
            { $key: key, $value: typeof value === "object" ? JSON.stringify(value) : value }
        );
    }
    async delete(key: string): Promise<void> {
        return this.db.run(`DELETE FROM ${this.o.tableName} WHERE key = $key`, {
            $key: key,
        });
    }
    async update(key: string, value: T): Promise<void> {
        return this.db.run(
            `UPDATE ${this.o.tableName} SET value = $value WHERE key = $key`,
            { $key: key, $value: value }
        );
    }
    async close(): Promise<void> {
        return this.db.close();
    }
}
