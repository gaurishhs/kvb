# KVBase
KVBase is a <1.5KB key-value store for Bun. It internally uses `bun:sqlite` for the storage.

## Installation

```sh
bun add kvb
```

## Usage

```ts
import { KVBase } from 'kvb';

const db = new KVBase();

await db.set('foo', 'bar');
await db.get('foo'); // bar
await db.delete('foo');
await db.update('foo', 'bar');
```

> **Note:** If no `options.bunOptions.filename` is given, Memory Storage will be used.

## Typescript Support

KVBase is written in Typescript and has full types support.

Use Typescript Generics while creating a new instance of KVBase to get the correct types.

```ts
import { KVBase } from 'kvb';

const db = new KVBase<string>();

await db.set('foo', 'bar');
await db.get('foo'); // bar
```

## Running Tests

```sh{:copy}
bun wiptest
```

## Benchmarks

```sh 
cpu: Intel(R) Core(TM) i5-5350U CPU @ 1.80GHz
runtime: bun 0.4.0 (x64-darwin)

benchmark        time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------- -----------------------------
• KVBase
--------------------------------------------------- -----------------------------
set            9.45 µs/iter     (7.03 µs … 1.49 ms)   8.68 µs  25.45 µs  41.34 µs
get (first)    1.19 µs/iter   (974.23 ns … 2.55 µs)   1.18 µs   2.55 µs   2.55 µs
get (all)      1.33 µs/iter      (1.1 µs … 1.75 µs)   1.41 µs   1.75 µs   1.75 µs
delete          4.9 µs/iter     (3.9 µs … 10.52 µs)    4.9 µs  10.52 µs  10.52 µs
update          5.2 µs/iter     (4.59 µs … 5.97 µs)   5.53 µs   5.97 µs   5.97 µs

summary for KVBase
  set
   7.91x slower than get (first)
   7.09x slower than get (all)
   1.93x slower than delete
   1.82x slower than update
```

To run the benchmarks, use the following command:

```sh
bun run index.bench.ts
```

## API

### `new KVBase(options: KVBaseOptions)`
Creates a new instance of KVBase.

#### `options`
Type: `KVBaseOptions`
Source: `src/index.ts`

```ts
interface KVBaseOptions {
    /**
     * Bun options given to the bun:sqlite instance.
     */
    bunOptions?: {
        filename?: string;
        options?: number | { readonly?: boolean; create?: boolean; readwrite?: boolean; }
    };
    /**
     * The name of the table to use.
     * @Default 'kvbase'
     */
    tableName?: string;
}
```

### `db.set(key: string, value: any)`
Sets a key-value pair in the database.

### `db.get(key: string)`
Gets a value from the database.

### `db.delete(key: string)`
Deletes a key-value pair from the database.

### `db.update(key: string, value: any)`
Updates a key-value pair in the database.

### `db.close()`
Close the database connection.

## License

MIT © [Gaurish Sethia](https://gaurishsethia.me). See [LICENSE](https://github.com/gaurishhs/kvb/tree/main/LICENSE) for more details.

