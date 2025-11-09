/**
 * Port of {@link https://www.npmjs.com/package/zonex-dns | ZoneX} to JSR
 *
 * A lightweight TypeScript library for parsing and generating DNS zone files
 * compliant with RFC standards (e.g. {@link https://tools.ietf.org/html/rfc1035 | RFC 1035}).
 *
 * This library allows you to:
 * - Convert BIND-style zone files into JavaScript objects
 * - Generate zone files from JavaScript objects
 * - Support a wide variety of DNS record {@linkcode RecordType | types}.
 * - Customizable field mappings to work with your own data structures
 * - TypeScript support for type safety and autocompletion
 * - RFC-compliant output for production use (after editing SOA/NS records as
 * needed).
 *
 * @example Generating a Zone file
 * ```ts
 * import { generate } from 'zonex';
 * const zoneRecords: InputRecord[] = [
 *   {
 *     type: "A",
 *     name: "example.com.",
 *     ttl: 3600,
 *     class: "IN",
 *     address: "192.0.2.1",
 *   },
 *   {
 *     type: "MX",
 *     name: "mail.example.com.",
 *     ttl: 3600,
 *     class: "IN",
 *     preference: 10,
 *     exchange: "mail.example.com.",
 *   },
 * ];
 * const zoneFileContent = generate(zoneRecords);
 * console.log(zoneFileContent);
 * ```
 *
 * Expected Output:
 * ```zone
 * $ORIGIN example.com.
 * $TTL 3600
 *
 * ;; A records
 * example.com.    3600    IN      A       192.0.2.1
 *
 * ;; MX records
 * mail.example.com.       3600    IN      MX      mail.example.com.
 * ```
 *
 * @example Generating a Zone file with custom field mappings
 * ```ts
 * import { generate } from 'zonex';
 * const zoneRecords: InputRecord[] = [
 *   {
 *     type: "A",
 *     name: "example.com.",
 *     ttl: 3600,
 *     class: "IN",
 *     address: "192.0.2.1"
 *   },
 *   {
 *     type: "MX",
 *     name: "mail.example.com.",
 *     ttl: 3600,
 *     class: "IN",
 *     preference: 10,
 *     exchange: "mail.example.com."
 *   },
 * ];
 * const zoneFileContent = generate(zoneRecords, {
 *   fieldMap: {
 *     "MX": { priority: "preference" },
 *   },
 * });
 * console.log(zoneFileContent);
 * ```
 *
 * Expected Output:
 * ```
 * $ORIGIN example.com.
 * $TTL 3600
 *
 * ;; A records
 * example.com.    3600    IN      A       192.0.2.1
 *
 * ;; MX records
 * mail.example.com.       3600    IN      MX      mail.example.com.
 * ```
 *
 * @example Parsing a Zone file
 * ```ts
 * import { parse } from 'zonex';
 *
 * const zoneFileContent = `
 * $ORIGIN example.com.
 * $TTL 86400
 * @   IN SOA ns1.example.com. hostmaster.example.com. (
 *         2025091801 ; serial
 *         7200       ; refresh
 *         3600       ; retry
 *         1209600    ; expire
 *         3600 )     ; minimum
 *
 * @            IN  NS  ns1.example.com.
 * @            IN  NS  ns2.example.com.
 * @    3600    IN  MX  10  mail.example.com.
 * @            IN  TXT     "v=spf1 include:example.com ~all"
 * @    600     IN  A       192.0.2.1
 * www  3600    IN  CNAME   example.com.
 * `;
 *
 * // Parse a zone file
 * const zoneData = parse(zoneFileContent);
 *
 * console.log(zoneData);
 * ```
 *
 * Expected Output:
 * ```json
 * {
 *   "SOA": [
 *     {
 *       "name": "example.com.",
 *       "ttl": 86400,
 *       "class": "IN",
 *       "type": "SOA",
 *       "rdata": "ns1.example.com. hostmaster.example.com. 2025091801 7200 3600 1209600 3600",
 *       "mname": "ns1.example.com.",
 *       "rname": "hostmaster.example.com.",
 *       "serial": 2025091801,
 *       "refresh": 7200,
 *       "retry": 3600,
 *       "expire": 1209600,
 *       "minimum": 3600
 *     }
 *   ],
 *   "NS": [
 *     {
 *       "name": "example.com.",
 *       "ttl": 86400,
 *       "class": "IN",
 *       "type": "NS",
 *       "rdata": "ns1.example.com.",
 *       "host": "ns1.example.com."
 *     },
 *     {
 *       "name": "example.com.",
 *       "ttl": 86400,
 *       "class": "IN",
 *       "type": "NS",
 *       "rdata": "ns2.example.com.",
 *       "host": "ns2.example.com."
 *     }
 *   ],
 *   "MX": [
 *     {
 *       "name": "example.com.",
 *       "ttl": 3600,
 *       "class": "IN",
 *       "type": "MX",
 *       "rdata": "10 mail.example.com.",
 *       "priority": 10,
 *       "exchange": "mail.example.com."
 *     }
 *   ],
 *   "TXT": [
 *     {
 *       "name": "example.com.",
 *       "ttl": 86400,
 *       "class": "IN",
 *       "type": "TXT",
 *       "rdata": "v=spf1 include:example.com ~all",
 *       "text": "v=spf1 include:example.com ~all"
 *     }
 *   ],
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
 * @see {@link https://github.com/thedeepakcodes/zonex-dns | Original Zonex GitHub Repository}
 * @see {@link https://tools.ietf.org/html/rfc1035 | RFC 1035 - Domain Names - Implementation and Specification}
 * @see {@link https://en.wikipedia.org/wiki/Zone_file | Zone File Format}
 *
 * @module zonex
 * @author  Sandeep K.
 * @license MIT
 */

export { generate } from './generator.ts'
export { parse } from './parser.ts'
export { RecordType } from './utils/records.parser.ts'

export type { GenerateOptions, InputRecord } from './generator.ts'
export type {
	ParsedRecord,
	ParsedRecordByType,
	ParseOptions,
} from './utils/records.parser.ts'
