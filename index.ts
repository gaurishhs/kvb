import {Database} from "bun:sqlite";
interface KVBaseOptions {
    bunOptions?: {
        filename?: string;
        options?: number | { readonly?: boolean; create?: boolean; readwrite?: boolean; }
    };
    tableName?: string;
}
export class KVBase<T = any> {
    private db: Database;
    constructor(private options:KVBaseOptions={
        tableName: "kvbase",
    }) {
        this.db = new Database(options.bunOptions?.filename ?? ":memory:", options.bunOptions?.options ?? { readonly: false, create: true });
        this.db.run(`CREATE TABLE IF NOT EXISTS ${options.tableName} (key TEXT PRIMARY KEY, value TEXT)`);
    }
    async get(key: string, first?: boolean): Promise<T | undefined> {
        return first ? this.db.query(`SELECT value FROM ${this.options.tableName}`).get(key)?.value : this.db.query(`SELECT value FROM ${this.options.tableName}`).all(key).map((v: any) => v.value);
    }
    async set(key: string, value: T): Promise<void> {
        this.db.run(`INSERT OR REPLACE INTO ${this.options.tableName} VALUES ($key, $value)`, { $key: key, $value: value });
    }
    async delete(key: string): Promise<void> {
        this.db.run(`DELETE FROM ${this.options.tableName} WHERE key = $key`, { $key: key });
    }
    async update(key: string, value: T): Promise<void> {
        this.db.run(`UPDATE ${this.options.tableName} SET value = $value WHERE key = $key`, { $key: key, $value: value });
    }    
    async close(): Promise<void> {
        this.db.close();
    }    
}