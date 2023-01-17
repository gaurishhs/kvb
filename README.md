# KVBase
KVBase is a < 3KB key-value store for Bun. It internally uses `bun:sqlite` for the storage.

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
runtime: bun 0.5.0 (x64-darwin)

benchmark         time (avg)             (min … max)       p75       p99      p995
---------------------------------------------------- -----------------------------
• KVBase
---------------------------------------------------- -----------------------------
set             11.4 µs/iter    (6.83 µs … 32.14 ms)   8.57 µs  21.29 µs  30.91 µs
get (first)     1.28 µs/iter   (958.38 ns … 1.97 µs)   1.38 µs   1.97 µs   1.97 µs
get (all)       2.03 µs/iter     (1.39 µs … 4.61 µs)   2.23 µs   4.61 µs   4.61 µs
delete          4.16 µs/iter     (3.55 µs … 5.59 µs)   4.41 µs   5.59 µs   5.59 µs
update          6.02 µs/iter    (4.29 µs … 11.21 µs)   6.51 µs  11.21 µs  11.21 µs
set (schema)  684.69 µs/iter   (386.83 µs … 7.35 ms) 637.98 µs   4.07 ms   4.93 ms

summary for KVBase
  set
   8.9x slower than get (first)
   5.63x slower than get (all)
   2.74x slower than delete
   1.89x slower than update
   60.08x faster than set (schema)
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

Schema for `KVBaseOptions`.

Schema is an optional parameter. If not supplied, No schema will be used. If supplied, the schema will be used to validate the data in every set call. If the data is invalid, an error will be thrown. The schema is validated using [fastest-validator](https://github.com/icebob/fastest-validator) and the schema is passed as it is to the validator. For more information on the schema, refer to the [fastest-validator documentation](https://github.com/icebob/fastest-validator#usage). Supply the Validator instance options in the `options.validatorOptions` property. 

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

