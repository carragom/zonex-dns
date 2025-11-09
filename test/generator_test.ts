import { assertEquals } from "@std/assert";

import * as zonex from "../src/index.ts";
import type { InputRecord } from "../src/types/generator.types.ts";

Deno.test("Zone File Generation", async () => {
    const records = await import("./generator.json", { with: { type: "json" } })
        .then(
            (mod) => mod.default as InputRecord[],
        );

    const output = zonex.generate(records, {
        origin: "example.com.", // ensures all relative names are resolved relative to this domain
        ttl: 3500, // default TTL for records
        keepComments: true, // useful for readability, especially during testing
        keepHeaders: true, // includes metadata like export date and tool info
    });

    const expectedOutput = await Deno.readTextFile(
        "./test/generator.zone",
    );

    assertEquals(removeDate(output), removeDate(expectedOutput));
});

function removeDate(string: string): string {
    return string.replace(
        /;; Exported:\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/,
        ";; Exported:   [DATE REMOVED]",
    );
}
