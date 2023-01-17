import { expect, test } from "bun:test";
import { KVBase } from ".";

let db = new KVBase();

test("KVBase.set", async () => {
    await db.set("test", "test");
    expect(await db.get("test", true)).toBe("test");
})

test("KVBase.get (first)", async () => {
    expect(await db.get("test", true)).toBe("test");
})

test("KVBase.get (all)", async () => {
    expect(await db.get("test")).toEqual(["test"]);
})

test("KVBase.delete", async () => {
    await db.delete("test");
    expect(await db.get("test", true)).not.toBeDefined();
});

test("KVBase.update", async () => {
    await db.set("test", "test");
    await db.update("test", "test2");
    expect(await db.get("test", true))
});

test("KVBase.set (schema)", async () => {
    let db = new KVBase({
        schema: {
            test: { type: "string" },
        },
    });
    await db.set("test", { test: "test" });
    expect(await db.get("test", true)).toEqual({ test: "test" });
});