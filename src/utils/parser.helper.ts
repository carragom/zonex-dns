import type { ParseOptions } from '../parser.ts'
import { type DNSRecord, RecordType } from './records.parser.ts'

export const DEFAULT_TTL = '3600'
const dnsTypes = Object.keys(RecordType)

export function sanitize(input: string): string[] {
	const records: string[] = []
	let buffer = ''

	const lines = input.split(/\r?\n/)

	for (let line of lines) {
		if (!line || line.startsWith(';')) continue

		line = removeRecordComments(line)

		if (line.includes('(') && !line.includes(')')) {
			buffer += line.replace('(', '').trim() + ' '
			continue
		}

		if (line.includes(')')) {
			buffer += line.replace(')', '').trim()
			records.push(buffer.trim())
			buffer = ''
			continue
		}

		if (buffer) {
			buffer += line + ' '
			continue
		}

		records.push(line)
	}

	return records.map((r) => r.replace(/\t/g, ' '))
}

function removeRecordComments(line: string): string {
	let record = ''

	let insideQuotes = false

	if (!line.includes(';')) return line

	for (let i = 0; i < line.length; i++) {
		const char = line[i]
		const isEscaped = i > 0 && line[i - 1] === '\\'

		if (!insideQuotes && char === ';') {
			break
		}

		record += char

		if (char === '"' && !isEscaped) {
			insideQuotes = !insideQuotes
			continue
		}
	}

	return record
}

export function extractRawRecords(
	rawRecords: string[],
	options?: ParseOptions,
): { records: DNSRecord[]; origin: string; ttl: number } {
	const { preserveSpacing, keepTrailingDot } = {
		preserveSpacing: true,
		keepTrailingDot: true,
		...options,
	}

	const parsedRecords: DNSRecord[] = []

	let origin: string = ''
	let currentOrigin: string | undefined
	let originTTL: string | undefined

	for (const rawRecord of rawRecords) {
		if (rawRecord.startsWith('$')) {
			const directive = rawRecord.trim().toLowerCase()

			if (directive.startsWith('$origin')) {
				currentOrigin = directive.split(' ')[1]
				origin = currentOrigin
			}
			if (directive.startsWith('$ttl')) {
				originTTL = directive.split(' ')[1]
			}

			continue
		}

		const dnsRecord = {
			name: '',
			ttl: '',
			class: '',
			type: '',
			rdata: '',
		}

		let insideQuotes = false
		let reconstructed = ''

		for (let i = rawRecord.length - 1; i >= 0; i--) {
			const char = rawRecord[i]
			const isEscaped = i > 0 && rawRecord[i - 1] === '\\'

			if (char === '"' && !isEscaped) {
				insideQuotes = !insideQuotes
				continue
			}

			if (!insideQuotes) {
				reconstructed = char + reconstructed
			} else {
				reconstructed = ''
			}
		}

		/**
		 * Append a trailing space to the record string
		 * So that type is always followed by a whitespace character.
		 */

		reconstructed += ' '

		const typeRegex = new RegExp(
			`(?:\\s|^)(${dnsTypes.join('|')})(?=\\s)`,
			'gmi',
		)
		const recordType = reconstructed.match(typeRegex)?.pop() ?? ''
		const typeIndex = reconstructed.lastIndexOf(recordType)

		const parts = [
			rawRecord.slice(0, typeIndex),
			recordType,
			rawRecord.slice(typeIndex + recordType.length).trim(),
		]

		if (parts.length === 3) {
			dnsRecord.rdata = parts.pop()?.trim() ?? ''
			dnsRecord.type = parts.pop()?.trim() ?? ''
			const tokens = (parts[0]?.split(' ') ?? []).reverse()
			const inheritOwnerName = tokens[tokens.length - 1] === ''
			const [first, second, third] = tokens.filter(Boolean)

			const assignRecord = (
				ttl: string | undefined,
				recordClass: string | undefined,
				name: string | undefined,
			) => {
				dnsRecord.ttl = ttl ?? originTTL ?? DEFAULT_TTL
				dnsRecord.class = recordClass ?? 'IN'
				dnsRecord.name = name ?? currentOrigin ?? '@'
			}

			if (!first && !second && !third) {
				dnsRecord.ttl = originTTL ?? DEFAULT_TTL
				dnsRecord.class = 'IN'
				dnsRecord.name = currentOrigin ?? '@'
			} else if (first && !second && !third) {
				if (isValidClass(first)) {
					assignRecord(
						originTTL,
						inheritOwnerName ? first : 'IN',
						inheritOwnerName ? currentOrigin : first,
					)
				} else {
					assignRecord(
						inheritOwnerName ? first : originTTL,
						'IN',
						inheritOwnerName ? currentOrigin : first,
					)
				}
			} else if (first && second && !third) {
				if (isValidClass(first)) {
					assignRecord(
						inheritOwnerName ? second : originTTL,
						first,
						inheritOwnerName ? currentOrigin : second,
					)
				} else {
					assignRecord(
						first,
						inheritOwnerName ? second : 'IN',
						inheritOwnerName ? currentOrigin : second,
					)
				}
			} else if (first && second && third) {
				if (isValidClass(first)) {
					assignRecord(second, first, third)
				} else {
					assignRecord(first, second, third)
				}
			}

			currentOrigin = dnsRecord.name

			if (!origin && dnsRecord.type === 'SOA') {
				if (dnsRecord.name.endsWith('.')) {
					dnsRecord.name = dnsRecord.name.slice(0, -1)
				}

				origin = dnsRecord.name + '.'
			}

			// complete relative domains
			let recordName = dnsRecord.name.replace('@', origin ?? '')
			if (dnsRecord.type !== 'SOA') {
				recordName = toFqdn(recordName, origin ?? '', keepTrailingDot)
			}

			// cname records can have relative domains
			if (dnsRecord.type === 'CNAME') {
				dnsRecord.rdata = dnsRecord.rdata.replace('@', origin ?? '')
				dnsRecord.rdata = toFqdn(
					dnsRecord.rdata,
					origin ?? '',
					keepTrailingDot,
				)
			}

			// remove spaces from non-TXT records
			if (dnsRecord.type !== 'TXT') {
				dnsRecord.rdata = dnsRecord.rdata.replace(/\s+/g, ' ')
			}

			// remove quotes from TXT records :::: Added SPF just to support old zone files
			if (dnsRecord.type === 'TXT' || dnsRecord.type === 'SPF') {
				const matches = dnsRecord.rdata.match(/"((?:[^"\\]|\\.)*)"/g)
				const joinBy = preserveSpacing ? ' ' : ''

				dnsRecord.rdata = matches?.map((s) =>
					s.slice(1, -1)
				).join(joinBy) ?? ''
			}

			parsedRecords.push({
				...dnsRecord,
				type: dnsRecord.type as RecordType,
				name: recordName.toLowerCase(),
				ttl: normalizeTtl(dnsRecord.ttl),
			})
		}
	}

	return { records: parsedRecords, origin, ttl: normalizeTtl(originTTL) }
}

export function normalizeTtl(ttl: string | number | undefined): number {
	if (!ttl) return parseInt(DEFAULT_TTL)

	if (typeof ttl === 'number') return ttl

	const digits = /\d+(\.\d+)?/

	if (digits.test(ttl) && /^\d+$/.test(ttl)) return parseInt(ttl, 10)

	const units: Record<string, number> = {
		s: 1,
		m: 60,
		h: 3600,
		d: 86400,
		w: 604800,
	}

	const trimmed = ttl.trim().toLowerCase()
	const unit = trimmed.slice(-1)
	const numPart = parseFloat(trimmed.slice(0, -1))

	if (!units[unit] || isNaN(numPart)) return parseInt(DEFAULT_TTL)

	return numPart * units[unit]
}

function toFqdn(
	name: string,
	origin: string,
	keepTrailingDot?: boolean,
): string {
	const fqdn = name.endsWith('.') ? name : name + '.' + origin

	return keepTrailingDot ? fqdn : fqdn.slice(0, -1)
}

function isValidClass(value: string | undefined) {
	return value ? ['IN', 'CH', 'CS', 'HS'].includes(value.toUpperCase()) : false
}
