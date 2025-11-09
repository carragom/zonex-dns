import { extractRawRecords, sanitize } from "./utils/parser.helper.ts";
import {
    type ParsedRecord,
    type ParsedRecordByType,
    type ParseOptions,
    RecordType,
} from "./utils/records.parser.ts";
import * as parser from "./utils/records.parser.ts";

/**
 * Parse a BIND-style zone file into structured JSON records.
 * @param input BIND-style zone file contents.
 * @param options Optional parsing options.
 *
 * @returns Parsed DNS records in either grouped or flattened format.
 *
 * @example
 * ```ts
 * import { parse } from 'zonex';
 *
 * const records = parse(input);
 * console.log(JSON.stringify(records, null, 2));
 * ```
 *
 * Expected Output:
 * ```json
 * {
 *   "A": [
 *     {
 *       "name": "example.com.",
 *       "ttl": 600,
 *       "class": "IN",
 *       "type": "A",
 *       "rdata": "192.0.2.1",
 *       "address": "192.0.2.1"
 *     }
 *   ],
 *   "CNAME": [
 *     {
 *       "name": "www.example.com.",
 *       "ttl": 3600,
 *       "class": "IN",
 *       "type": "CNAME",
 *       "rdata": "example.com.",
 *       "target": "example.com."
 *     }
 *   ]
 * }
 * ```
 *
 * @example Flattened Output
 * ```ts
 * import { parse } from 'zonex';
 *
 * const records = parse(input, { flatten: true });
 * console.log(JSON.stringify(records, null, 2));
 * ```
 *
 * Expected Output:
 * ```json
 * [
 *   {
 *     "name": "example.com.",
 *     "ttl": 600,
 *     "class": "IN",
 *     "type": "A",
 *     "rdata": "192.0.2.1",
 *     "address": "192.0.2.1"
 *   },
 *   {
 *     "name": "www.example.com.",
 *     "ttl": 3600,
 *     "class": "IN",
 *     "type": "CNAME",
 *     "rdata": "example.com.",
 *     "target": "example.com."
 *   }
 * ]
 * ```
 */

export function parse(
    input: string,
    options?: Omit<ParseOptions, "flatten"> & { flatten?: false },
): ParsedRecordByType;

export function parse(
    input: string,
    options: Omit<ParseOptions, "flatten"> & { flatten: true },
): ParsedRecord[];

export function parse(
    input: string,
    options?: ParseOptions,
): ParsedRecordByType | ParsedRecord[] {
    const records = sanitize(input);

    const { records: dnsRecords } = extractRawRecords(records, options);

    const { flatten } = options || {
        flatten: false,
    };

    const groupedRecords: ParsedRecordByType = Object.values(RecordType).reduce(
        (acc) => {
            return acc;
        },
        {} as ParsedRecordByType,
    );

    dnsRecords.forEach((dnsRecord) => {
        const type = dnsRecord.type.toUpperCase() as RecordType;

        const parsedRecord = parser.recordParsers[type](dnsRecord);

        if (!groupedRecords[type]) {
            groupedRecords[type] = [];
        }

        (groupedRecords[type] as ParsedRecord[]).push(parsedRecord);
    });

    return flatten ? Object.values(groupedRecords).flat() : groupedRecords;
}
