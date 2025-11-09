import { assertEquals } from "@std/assert";

import * as zonex from "../src/index.ts";
import type { ParsedRecord } from "../src/types/parser.types.ts";

const tests = await import("./tests.json", { with: { type: "json" } }).then(
    (mod) => mod.default,
);

for (const test of tests) {
    Deno.test(`${test.name}`, () => {
        const output = zonex.parse(test.input, {
            flatten: true,
        });

        assertEquals(output, test.expected as ParsedRecord[]);
    });
}
