/** @enum {string} */
export enum RecordType {
	A = 'A',
	AAAA = 'AAAA',
	CNAME = 'CNAME',
	NS = 'NS',
	TXT = 'TXT',
	MX = 'MX',
	PTR = 'PTR',
	SOA = 'SOA',
	SRV = 'SRV',
	CAA = 'CAA',
	SPF = 'SPF',
	LOC = 'LOC',
	DS = 'DS',
	DNSKEY = 'DNSKEY',
	TLSA = 'TLSA',
	SSHFP = 'SSHFP',
	HTTPS = 'HTTPS',
	IPSECKEY = 'IPSECKEY',
	ALIAS = 'ALIAS',
	NAPTR = 'NAPTR',
	CERT = 'CERT',
	SMIMEA = 'SMIMEA',
	SVCB = 'SVCB',
	URI = 'URI',
	DNAME = 'DNAME',
	HINFO = 'HINFO',
	OPENPGPKEY = 'OPENPGPKEY',
	RP = 'RP',
}

/** Options for {@linkcode parse}. */
export interface ParseOptions {
	/** @type {boolean} Preserve whitespace and indentation in the parsed output. */
	preserveSpacing?: boolean
	/** @type {boolean} Keep the trailing dot on fully qualified domain names. */
	keepTrailingDot?: boolean
	/** @type {boolean} Flatten the parsed records into a single array. */
	flatten?: boolean
}

export interface DNSRecord {
	name: string
	type: keyof typeof RecordType
	ttl: number
	class: string
	rdata: string
}

export interface ARecord extends DNSRecord {
	type: RecordType.A
	address: string
}

export interface AAAARecord extends DNSRecord {
	type: RecordType.AAAA
	address: string
}

export interface CNAMERecord extends DNSRecord {
	type: RecordType.CNAME
	target: string
}

export interface NSRecord extends DNSRecord {
	type: RecordType.NS
	host: string
}

export interface TXTRecord extends DNSRecord {
	type: RecordType.TXT
	text: string
}

export interface MXRecord extends DNSRecord {
	type: RecordType.MX
	priority: number
	exchange: string
}

export interface PTRRecord extends DNSRecord {
	type: RecordType.PTR
	ptrdname: string
}

export interface SOARecord extends DNSRecord {
	type: RecordType.SOA
	mname: string
	rname: string
	serial: number
	refresh: number
	retry: number
	expire: number
	minimum: number
}

export interface SRVRecord extends DNSRecord {
	type: RecordType.SRV
	priority: number
	weight: number
	port: number
	target: string
}

export interface CAARecord extends DNSRecord {
	type: RecordType.CAA
	flag: number
	tag: string
	value: string
}

export interface SPFRecord extends DNSRecord {
	type: RecordType.SPF
	text: string
}

export interface DMS {
	degrees: number
	minutes: number
	seconds: number
	hemisphere: string
}

export interface LOCRecord extends DNSRecord {
	type: RecordType.LOC
	latitude: DMS
	longitude: DMS
	altitude: number
	size: number
	horizPrecision: number
	vertPrecision: number
}

export interface DSRecord extends DNSRecord {
	type: RecordType.DS
	keyTag: number
	algorithm: number
	digestType: number
	digest: string
}

export interface DNSKEYRecord extends DNSRecord {
	type: RecordType.DNSKEY
	flags: number
	protocol: number
	algorithm: number
	publicKey: string
}

export interface TLSARecord extends DNSRecord {
	type: RecordType.TLSA
	usage: number
	selector: number
	matchingType: number
	certificateAssociationData: string
}

export interface SSHFPRecord extends DNSRecord {
	type: RecordType.SSHFP
	algorithm: number
	fingerprintType: number
	fingerprint: string
}

export interface HTTPSRecord extends DNSRecord {
	type: RecordType.HTTPS
	priority: number
	target: string
	params: string
}

export interface IPSECKEYRecord extends DNSRecord {
	type: RecordType.IPSECKEY
	precedence: number
	gatewayType: number
	algorithm: number
	gateway: string
	publicKey: string
}

export interface ALIASRecord extends DNSRecord {
	type: RecordType.ALIAS
	target: string
}

export interface NAPTRRecord extends DNSRecord {
	type: RecordType.NAPTR
	order: number
	preference: number
	flags: string
	service: string
	regexp: string
	replacement: string
}

export interface CERTRecord extends DNSRecord {
	type: RecordType.CERT
	certType: number
	keyTag: number
	algorithm: number
	certificate: string
}

export interface SMIMEARecord extends DNSRecord {
	type: RecordType.SMIMEA
	usage: number
	selector: number
	matchingType: number
	certAssociationData: string
}

export interface SVCBRecord extends DNSRecord {
	type: RecordType.SVCB
	priority: number
	target: string
	params: string
}

export interface URIRecord extends DNSRecord {
	type: RecordType.URI
	priority: number
	weight: number
	target: string
}

export interface DNAMERecord extends DNSRecord {
	type: RecordType.DNAME
	target: string
}

export interface HINFORecord extends DNSRecord {
	type: RecordType.HINFO
	cpu: string
	os: string
}

export interface OPENPGPKEYRecord extends DNSRecord {
	type: RecordType.OPENPGPKEY
	publicKey: string
}

export interface RPRecord extends DNSRecord {
	type: RecordType.RP
	mailbox: string
	txtDomain: string
}

export type ParsedRecord =
	| ARecord
	| AAAARecord
	| CNAMERecord
	| NSRecord
	| TXTRecord
	| MXRecord
	| PTRRecord
	| SOARecord
	| SRVRecord
	| CAARecord
	| SPFRecord
	| LOCRecord
	| DSRecord
	| DNSKEYRecord
	| TLSARecord
	| SSHFPRecord
	| HTTPSRecord
	| IPSECKEYRecord
	| ALIASRecord
	| NAPTRRecord
	| CERTRecord
	| SMIMEARecord
	| SVCBRecord
	| URIRecord
	| DNAMERecord
	| HINFORecord
	| OPENPGPKEYRecord
	| RPRecord

export type DNSRecordsByType = {
	[key: string]: DNSRecord[]
}

export type ParsedRecordByType = {
	[T in RecordType]: Extract<ParsedRecord, { type: T }>[]
}

export function parseSOA(dnsRecord: DNSRecord): ParsedRecord {
	const [mname, rname, serial, refresh, retry, expire, minimum] = dnsRecord
		.rdata.trim().split(/\s+/)

	return {
		...dnsRecord,
		type: RecordType.SOA,
		mname,
		rname,
		serial: Number(serial) || 0,
		refresh: Number(refresh) || 0,
		retry: Number(retry) || 0,
		expire: Number(expire) || 0,
		minimum: Number(minimum) || 0,
	}
}

export function parseNS(dnsRecord: DNSRecord): ParsedRecord {
	return {
		...dnsRecord,
		type: RecordType.NS,
		host: dnsRecord.rdata.trim(),
	}
}

export function parseA(dnsRecord: DNSRecord): ParsedRecord {
	return {
		...dnsRecord,
		type: RecordType.A,
		address: dnsRecord.rdata.trim(),
	}
}

export function parseAAAA(dnsRecord: DNSRecord): ParsedRecord {
	return {
		...dnsRecord,
		type: RecordType.AAAA,
		address: dnsRecord.rdata.trim(),
	}
}

export function parseCNAME(dnsRecord: DNSRecord): ParsedRecord {
	return {
		...dnsRecord,
		type: RecordType.CNAME,
		target: dnsRecord.rdata.trim(),
	}
}

export function parseTXT(dnsRecord: DNSRecord): ParsedRecord {
	return {
		...dnsRecord,
		type: RecordType.TXT,
		text: dnsRecord.rdata.trim(),
	}
}

export function parseMX(dnsRecord: DNSRecord): ParsedRecord {
	const [priority, exchange] = dnsRecord.rdata.trim().split(/\s+/)

	return {
		...dnsRecord,
		type: RecordType.MX,
		priority: Number(priority),
		exchange,
	}
}

export function parsePTR(dnsRecord: DNSRecord): ParsedRecord {
	return {
		...dnsRecord,
		type: RecordType.PTR,
		ptrdname: dnsRecord.rdata.trim(),
	}
}

export function parseSRV(dnsRecord: DNSRecord): ParsedRecord {
	const [priority, weight, port, target] = dnsRecord.rdata.trim().split(
		/\s+/,
	)

	return {
		...dnsRecord,
		type: RecordType.SRV,
		priority: Number(priority) || 0,
		weight: Number(weight) || 0,
		port: Number(port) || 0,
		target,
	}
}

export function parseCAA(dnsRecord: DNSRecord): ParsedRecord {
	const parts = dnsRecord.rdata.trim().split(/\s+/)

	const flag = parts[0] ? Number(parts[0]) : 0
	const tag = parts[1] || ''
	const value = parts.slice(2).join(' ').replace(/^"|"$/g, '')

	return {
		...dnsRecord,
		type: RecordType.CAA,
		flag,
		tag,
		value,
	}
}

export function parseSPF(dnsRecord: DNSRecord): ParsedRecord {
	const text = dnsRecord.rdata.trim().replace(/^"|"$/g, '')

	return {
		...dnsRecord,
		type: RecordType.SPF,
		text,
	}
}

export function parseLOC(dnsRecord: DNSRecord): ParsedRecord {
	const parts = dnsRecord.rdata.trim().split(/\s+/)

	let i = 0

	/* :::: Latitude :::: */
	const latDeg = Number(parts[i++])
	let latMin = 0, latSec = 0
	let latHem = 'N'
	if (i < parts.length && !/^[NS]$/i.test(parts[i])) {
		latMin = Number(parts[i++])
	}
	if (i < parts.length && !/^[NS]$/i.test(parts[i])) {
		latSec = Number(parts[i++])
	}
	if (i < parts.length && /^[NS]$/i.test(parts[i])) {
		latHem = parts[i++].toUpperCase()
	}

	/* :::: Longitude :::: */
	const lonDeg = Number(parts[i++])
	let lonMin = 0, lonSec = 0
	let lonHem = 'E'
	if (i < parts.length && !/^[EW]$/i.test(parts[i])) {
		lonMin = Number(parts[i++])
	}
	if (i < parts.length && !/^[EW]$/i.test(parts[i])) {
		lonSec = Number(parts[i++])
	}
	if (i < parts.length && /^[EW]$/i.test(parts[i])) {
		lonHem = parts[i++].toUpperCase()
	}

	/* :::: Optional altitude and precision :::: */
	const altitude = i < parts.length
		? Number(parts[i++].replace(/[mM]/, ''))
		: 0
	const size = i < parts.length ? Number(parts[i++].replace(/[mM]/, '')) : 1
	const horizPrecision = i < parts.length
		? Number(parts[i++].replace(/[mM]/, ''))
		: 10000
	const vertPrecision = i < parts.length
		? Number(parts[i++].replace(/[mM]/, ''))
		: 10

	return {
		...dnsRecord,
		type: RecordType.LOC,
		latitude: {
			degrees: latDeg,
			minutes: latMin,
			seconds: latSec,
			hemisphere: latHem,
		},
		longitude: {
			degrees: lonDeg,
			minutes: lonMin,
			seconds: lonSec,
			hemisphere: lonHem,
		},
		altitude,
		size,
		horizPrecision,
		vertPrecision,
	}
}

export function parseDS(dnsRecord: DNSRecord): ParsedRecord {
	const parts = dnsRecord.rdata.trim().split(/\s+/)

	return {
		...dnsRecord,
		type: RecordType.DS,
		keyTag: parts[0] ? Number(parts[0]) || 0 : 0,
		algorithm: parts[1] ? Number(parts[1]) || 0 : 0,
		digestType: parts[2] ? Number(parts[2]) || 0 : 0,
		digest: parts[3] || '',
	}
}

export function parseDNSKEY(dnsRecord: DNSRecord): ParsedRecord {
	const parts = dnsRecord.rdata.trim().split(/\s+/)

	return {
		...dnsRecord,
		type: RecordType.DNSKEY,
		flags: parts[0] ? Number(parts[0]) || 0 : 0,
		protocol: parts[1] ? Number(parts[1]) || 0 : 0,
		algorithm: parts[2] ? Number(parts[2]) || 0 : 0,
		publicKey: parts.slice(3).join(' ') || '',
	}
}

export function parseTLSA(dnsRecord: DNSRecord): ParsedRecord {
	const parts = dnsRecord.rdata.trim().split(/\s+/)

	return {
		...dnsRecord,
		type: RecordType.TLSA,
		usage: parts[0] ? Number(parts[0]) || 0 : 0,
		selector: parts[1] ? Number(parts[1]) || 0 : 0,
		matchingType: parts[2] ? Number(parts[2]) || 0 : 0,
		certificateAssociationData: parts.slice(3).join(' ') || '',
	}
}

export function parseSSHFP(dnsRecord: DNSRecord): ParsedRecord {
	const parts = dnsRecord.rdata.trim().split(/\s+/)

	return {
		...dnsRecord,
		type: RecordType.SSHFP,
		algorithm: parts[0] ? Number(parts[0]) || 0 : 0,
		fingerprintType: parts[1] ? Number(parts[1]) || 0 : 0,
		fingerprint: parts.slice(2).join('') || '',
	}
}

export function parseHTTPS(dnsRecord: DNSRecord): ParsedRecord {
	const parts = dnsRecord.rdata.trim().split(/\s+/)

	// Extract priority
	const priority = parts[0] ? Number(parts[0]) || 0 : 0

	// Extract target name
	const target = parts[1] || ''

	// Everything else is params as a raw string
	const params = parts.slice(2).join(' ')

	return {
		...dnsRecord,
		type: RecordType.HTTPS,
		priority,
		target,
		params,
	}
}

export function parseIPSECKEY(dnsRecord: DNSRecord): ParsedRecord {
	const parts = dnsRecord.rdata.trim().split(/\s+/)

	return {
		...dnsRecord,
		type: RecordType.IPSECKEY,
		precedence: parts[0] ? Number(parts[0]) || 0 : 0,
		gatewayType: parts[1] ? Number(parts[1]) || 0 : 0,
		algorithm: parts[2] ? Number(parts[2]) || 0 : 0,
		gateway: parts[3] || '',
		publicKey: parts.slice(4).join(' ') || '',
	}
}

export function parseALIAS(dnsRecord: DNSRecord): ParsedRecord {
	const target = dnsRecord.rdata.trim() || ''

	return {
		...dnsRecord,
		type: RecordType.ALIAS,
		target,
	}
}

export function parseNAPTR(dnsRecord: DNSRecord): ParsedRecord {
	const parts = dnsRecord.rdata.trim().match(/(?:[^\s"]+|"[^"]*")+/g) || []

	return {
		...dnsRecord,
		type: RecordType.NAPTR,
		order: parts[0] ? Number(parts[0]) || 0 : 0,
		preference: parts[1] ? Number(parts[1]) || 0 : 0,
		flags: parts[2] ? parts[2].replace(/"/g, '') : '',
		service: parts[3] ? parts[3].replace(/"/g, '') : '',
		regexp: parts[4] ? parts[4].replace(/"/g, '') : '.',
		replacement: parts[5] ? parts[5].replace(/"/g, '') : '.',
	}
}

export function parseCERT(dnsRecord: DNSRecord): ParsedRecord {
	const parts = dnsRecord.rdata.trim().split(/\s+/)

	return {
		...dnsRecord,
		type: RecordType.CERT,
		certType: parts[0] ? Number(parts[0]) || 0 : 0,
		keyTag: parts[1] ? Number(parts[1]) || 0 : 0,
		algorithm: parts[2] ? Number(parts[2]) || 0 : 0,
		certificate: parts.slice(3).join(' ') || '',
	}
}

export function parseSMIMEA(dnsRecord: DNSRecord): ParsedRecord {
	const parts = dnsRecord.rdata.trim().split(/\s+/)

	return {
		...dnsRecord,
		type: RecordType.SMIMEA,
		usage: parts[0] ? Number(parts[0]) || 0 : 0,
		selector: parts[1] ? Number(parts[1]) || 0 : 0,
		matchingType: parts[2] ? Number(parts[2]) || 0 : 0,
		certAssociationData: parts[3] || '',
	}
}

export function parseSVCB(dnsRecord: DNSRecord): ParsedRecord {
	const parts = dnsRecord.rdata.trim().split(/\s+/)

	const priority = parts[0] ? Number(parts[0]) || 0 : 0
	const target = parts[1] || ''
	const params = parts.slice(2).join(' ') || ''

	return {
		...dnsRecord,
		type: RecordType.SVCB,
		priority,
		target,
		params,
	}
}

export function parseURI(dnsRecord: DNSRecord): ParsedRecord {
	const parts = dnsRecord.rdata.trim().match(/(?:[^\s"]+|"[^"]*")+/g) || []

	return {
		...dnsRecord,
		type: RecordType.URI,
		priority: parts[0] ? Number(parts[0]) || 0 : 0,
		weight: parts[1] ? Number(parts[1]) || 0 : 0,
		target: parts[2] ? parts[2].replace(/^"|"$/g, '') : '',
	}
}

export function parseDNAME(dnsRecord: DNSRecord): ParsedRecord {
	const target = dnsRecord.rdata.trim().replace(/^"|"$/g, '')
	return {
		...dnsRecord,
		type: RecordType.DNAME,
		target,
	}
}

export function parseHINFO(dnsRecord: DNSRecord): ParsedRecord {
	const parts = dnsRecord.rdata.trim().match(/(?:[^\s"]+|"[^"]*")+/g) || []
	const cpu = parts[0] ? parts[0].replace(/^"|"$/g, '') : ''
	const os = parts[1] ? parts[1].replace(/^"|"$/g, '') : ''

	return {
		...dnsRecord,
		type: RecordType.HINFO,
		cpu,
		os,
	}
}

export function parseOPENPGPKEY(dnsRecord: DNSRecord): ParsedRecord {
	const publicKey = dnsRecord.rdata.trim().replace(/^"|"$/g, '')

	return {
		...dnsRecord,
		type: RecordType.OPENPGPKEY,
		publicKey,
	}
}

export function parseRP(dnsRecord: DNSRecord): ParsedRecord {
	const parts = dnsRecord.rdata.trim().match(/(?:[^\s"]+|"[^"]*")+/g) || []
	const mailbox = parts[0] ? parts[0].replace(/^"|"$/g, '') : ''
	const txtDomain = parts[1] ? parts[1].replace(/^"|"$/g, '') : ''

	return {
		...dnsRecord,
		type: RecordType.RP,
		mailbox,
		txtDomain,
	}
}

export const recordParsers: Record<RecordType, (r: DNSRecord) => ParsedRecord> =
	{
		[RecordType.A]: parseA,
		[RecordType.AAAA]: parseAAAA,
		[RecordType.CNAME]: parseCNAME,
		[RecordType.MX]: parseMX,
		[RecordType.NS]: parseNS,
		[RecordType.TXT]: parseTXT,
		[RecordType.SOA]: parseSOA,
		[RecordType.SRV]: parseSRV,
		[RecordType.PTR]: parsePTR,
		[RecordType.CAA]: parseCAA,
		[RecordType.SPF]: parseSPF,
		[RecordType.LOC]: parseLOC,
		[RecordType.DS]: parseDS,
		[RecordType.DNSKEY]: parseDNSKEY,
		[RecordType.TLSA]: parseTLSA,
		[RecordType.SSHFP]: parseSSHFP,
		[RecordType.HTTPS]: parseHTTPS,
		[RecordType.IPSECKEY]: parseIPSECKEY,
		[RecordType.ALIAS]: parseALIAS,
		[RecordType.NAPTR]: parseNAPTR,
		[RecordType.CERT]: parseCERT,
		[RecordType.SMIMEA]: parseSMIMEA,
		[RecordType.SVCB]: parseSVCB,
		[RecordType.URI]: parseURI,
		[RecordType.DNAME]: parseDNAME,
		[RecordType.HINFO]: parseHINFO,
		[RecordType.OPENPGPKEY]: parseOPENPGPKEY,
		[RecordType.RP]: parseRP,
	}
