import { assertEquals } from "@std/assert";

import { generate, type InputRecord } from "./mod.ts";

Deno.test("Zone File Generation", (_) => {
    const output = generate(records(), {
        origin: "example.com.", // ensures all relative names are resolved relative to this domain
        ttl: 3500, // default TTL for records
        keepComments: true, // useful for readability, especially during testing
        keepHeaders: true, // includes metadata like export date and tool info
    });

    assertEquals(removeDate(output), expected());
});

function removeDate(string: string): string {
    return string.replace(
        /;; Exported:\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/,
        ";; Exported:   [DATE REMOVED]",
    );
}

function records(): InputRecord[] {
    return [
        {
            name: "example.com",
            class: "IN",
            type: "SOA",
            rdata:
                "martha.ns.cloudflare.com. dns.cloudflare.com. 2050976517 10000 2400 604800 3600",
            mname: "martha.ns.cloudflare.com.",
            rname: "dns.cloudflare.com.",
            serial: 2050976517,
            refresh: 10000,
            retry: 2400,
            expire: 604800,
            minimum: 3600,
        },
        {
            name: "example.com.",
            ttl: 86400,
            type: "NS",
            rdata: "marth.ns.cloudflare.com.",
            host: "marth.ns.cloudflare.com.",
        },
        {
            name: "example.com.",
            ttl: 86400,
            class: "IN",
            type: "NS",
            rdata: "ridg.ns.cloudflare.com.",
            host: "ridg.ns.cloudflare.com.",
        },
        {
            name: "example.com.",
            ttl: 1,
            class: "IN",
            type: "A",
            rdata: "192.168.1.36",
            address: "192.168.1.36",
        },
        {
            name: "example.com.",
            ttl: 3600,
            class: "IN",
            type: "MX",
            rdata: "10 mail1.example.com.",
            priority: 10,
            exchange: "mail1.example.com.",
        },
        {
            name: "www.example.com.",
            ttl: 3600,
            class: "IN",
            type: "AAAA",
            rdata: "2001:db8::1",
            address: "2001:db8::1",
        },
        {
            name: "api.example.com.",
            ttl: 3600,
            class: "IN",
            type: "AAAA",
            rdata: "2001:db8::2",
            address: "2001:db8::2",
        },
        {
            name: "ftp.example.com.",
            ttl: 3600,
            class: "IN",
            type: "CNAME",
            rdata: "www.example.com.",
            target: "www.example.com.",
        },
        {
            name: "example.com.",
            ttl: 3600,
            class: "IN",
            type: "TXT",
            rdata: "v=spf1 include:_spf.example.com ~all",
            text: "v=spf1 include:_spf.example.com ~all",
        },
        {
            name: "_dmarc.example.com.",
            ttl: 3600,
            class: "IN",
            type: "TXT",
            rdata: "v=DMARC1; p=none; rua=mailto:dmarc@example.com",
            text: "v=DMARC1; p=none; rua=mailto:dmarc@example.com",
        },
        {
            name: "_sip._tcp.example.com.",
            ttl: 3600,
            class: "IN",
            type: "SRV",
            rdata: "10 60 5060 sipserver.example.com.",
            priority: 10,
            weight: 60,
            port: 5060,
            target: "sipserver.example.com.",
        },
        {
            name: "example.com.",
            ttl: 3600,
            class: "IN",
            type: "CAA",
            rdata: '0 issue "letsencrypt.org"',
            flag: 0,
            tag: "issue",
            value: "letsencrypt.org",
        },
        {
            name: "example.com.",
            ttl: 3600,
            class: "IN",
            type: "CAA",
            rdata: '0 issuewild "comodoca.com"',
            flag: 0,
            tag: "issuewild",
            value: "comodoca.com",
        },
        {
            name: "example.com.",
            ttl: 3600,
            class: "IN",
            type: "CAA",
            rdata: '0 iodef "mailto:security@example.com"',
            flag: 0,
            tag: "iodef",
            value: "mailto:security@example.com",
        },
        {
            name: "www.example.com.",
            ttl: 3600,
            class: "IN",
            type: "CAA",
            rdata: '0 issue "digicert.com"',
            flag: 0,
            tag: "issue",
            value: "digicert.com",
        },
        {
            name: "api.example.com.",
            ttl: 3600,
            class: "IN",
            type: "CAA",
            rdata: '0 issue "sectigo.com"',
            flag: 0,
            tag: "issue",
            value: "sectigo.com",
        },
        {
            name: "example.com.",
            ttl: 3600,
            class: "IN",
            type: "SPF",
            rdata: "v=spf1 include:_spf.google.com ~all",
            text: "v=spf1 include:_spf.google.com ~all",
        },
        {
            name: "host1.example.com.",
            ttl: 3600,
            class: "IN",
            type: "LOC",
            rdata: "37 46 29 N 122 25 10 W",
            latitude: {
                degrees: 37,
                minutes: 46,
                seconds: 29,
                hemisphere: "N",
            },
            longitude: {
                degrees: 122,
                minutes: 25,
                seconds: 10,
                hemisphere: "W",
            },
            altitude: 0,
            size: 1,
            horizPrecision: 10000,
            vertPrecision: 10,
        },
        {
            name: "host2.example.com.",
            ttl: 3600,
            class: "IN",
            type: "LOC",
            rdata: "37 46 29 N 122 25 10 W 15m",
            latitude: {
                degrees: 37,
                minutes: 46,
                seconds: 29,
                hemisphere: "N",
            },
            longitude: {
                degrees: 122,
                minutes: 25,
                seconds: 10,
                hemisphere: "W",
            },
            altitude: 15,
            size: 1,
            horizPrecision: 10000,
            vertPrecision: 10,
        },
        {
            name: "host3.example.com.",
            ttl: 3600,
            class: "IN",
            type: "LOC",
            rdata: "37 46 29 N 122 25 10 W 20m 5m 50m 5m",
            latitude: {
                degrees: 37,
                minutes: 46,
                seconds: 29,
                hemisphere: "N",
            },
            longitude: {
                degrees: 122,
                minutes: 25,
                seconds: 10,
                hemisphere: "W",
            },
            altitude: 20,
            size: 5,
            horizPrecision: 50,
            vertPrecision: 5,
        },
        {
            name: "host4.example.com.",
            ttl: 3600,
            class: "IN",
            type: "LOC",
            rdata: "51 30 N 0 7 W",
            latitude: { degrees: 51, minutes: 30, seconds: 0, hemisphere: "N" },
            longitude: { degrees: 0, minutes: 7, seconds: 0, hemisphere: "W" },
            altitude: 0,
            size: 1,
            horizPrecision: 10000,
            vertPrecision: 10,
        },
        {
            name: "example.com.",
            ttl: 3600,
            class: "IN",
            type: "DS",
            rdata: "60485 8 2 49FD46E6C4B45C55D4AC",
            keyTag: 60485,
            algorithm: 8,
            digestType: 2,
            digest: "49FD46E6C4B45C55D4AC",
        },
        {
            name: "sub.example.com.",
            ttl: 3600,
            class: "IN",
            type: "DS",
            rdata: "12345 8 2 5B2E3C4F1D6A7B8C9D0E",
            keyTag: 12345,
            algorithm: 8,
            digestType: 2,
            digest: "5B2E3C4F1D6A7B8C9D0E",
        },
        {
            name: "example.com.",
            ttl: 3600,
            class: "IN",
            type: "DNSKEY",
            rdata: "257 3 8 AwEAAc3dF1Q2gK3v8sX9J1Rk...",
            flags: 257,
            protocol: 3,
            algorithm: 8,
            publicKey: "AwEAAc3dF1Q2gK3v8sX9J1Rk...",
        },
        {
            name: "sub.example.com.",
            ttl: 3600,
            class: "IN",
            type: "DNSKEY",
            rdata: "257 3 8 AwEAAz9vQ8rX1Kj2L7sYpZ...",
            flags: 257,
            protocol: 3,
            algorithm: 8,
            publicKey: "AwEAAz9vQ8rX1Kj2L7sYpZ...",
        },
        {
            name: "_443._tcp.example.com.",
            ttl: 3600,
            class: "IN",
            type: "TLSA",
            rdata:
                "3 1 1 2D3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3",
            usage: 3,
            selector: 1,
            matchingType: 1,
            certificateAssociationData:
                "2D3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3",
        },
        {
            name: "host1.example.com.",
            ttl: 3600,
            class: "IN",
            type: "SSHFP",
            rdata: "1 1 123456789abcdef123456789abcdef12345678",
            algorithm: 1,
            fingerprintType: 1,
            fingerprint: "123456789abcdef123456789abcdef12345678",
        },
        {
            name: "_443._tcp.host1.example.com.",
            ttl: 3600,
            class: "IN",
            type: "HTTPS",
            rdata: '1 1 "https://host1.example.com"',
            priority: 1,
            target: "1",
            params: '"https://host1.example.com"',
        },
        {
            name: "host1.example.com.",
            ttl: 3600,
            class: "IN",
            type: "IPSECKEY",
            rdata: '1 2 1 203.0.113.1 "AwEAAc5kJk3..."',
            precedence: 1,
            gatewayType: 2,
            algorithm: 1,
            gateway: "203.0.113.1",
            publicKey: '"AwEAAc5kJk3..."',
        },
        {
            name: "alias1.example.com.",
            ttl: 3600,
            class: "IN",
            type: "ALIAS",
            rdata: "example.com.",
            target: "example.com.",
        },
        {
            name: "alias3.example.com.",
            ttl: 3600,
            class: "IN",
            type: "ALIAS",
            rdata: "mail.example.com.",
            target: "mail.example.com.",
        },
        {
            name: "sip1.example.com.",
            ttl: 3600,
            class: "IN",
            type: "NAPTR",
            rdata: '100 10 "U" "E2U+sip" "!^.*$!sip:info@example.com!" .',
            order: 100,
            preference: 10,
            flags: "U",
            service: "E2U+sip",
            regexp: "!^.*$!sip:info@example.com!",
            replacement: ".",
        },
        {
            name: "sip2.example.com.",
            ttl: 3600,
            class: "IN",
            type: "NAPTR",
            rdata: '200 20 "U" "E2U+email" "!^.*$!mailto:info@example.com!" .',
            order: 200,
            preference: 20,
            flags: "U",
            service: "E2U+email",
            regexp: "!^.*$!mailto:info@example.com!",
            replacement: ".",
        },
        {
            name: "tel1.example.com.",
            ttl: 3600,
            class: "IN",
            type: "NAPTR",
            rdata: '50 5 "U" "E2U+tel" "!^.*$!tel:+1234567890!" .',
            order: 50,
            preference: 5,
            flags: "U",
            service: "E2U+tel",
            regexp: "!^.*$!tel:+1234567890!",
            replacement: ".",
        },
        {
            name: "voip1.example.com.",
            ttl: 3600,
            class: "IN",
            type: "NAPTR",
            rdata: '10 100 "U" "E2U+sip" "!^.*$!sip:support@example.com!" .',
            order: 10,
            preference: 100,
            flags: "U",
            service: "E2U+sip",
            regexp: "!^.*$!sip:support@example.com!",
            replacement: ".",
        },
        {
            name: "example.com.",
            ttl: 3600,
            class: "IN",
            type: "CERT",
            rdata: "1 5 1 MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt+...",
            certType: 1,
            keyTag: 5,
            algorithm: 1,
            certificate: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt+...",
        },
        {
            name: "sub.example.com.",
            ttl: 3600,
            class: "IN",
            type: "CERT",
            rdata: "2 3 1 MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv...",
            certType: 2,
            keyTag: 3,
            algorithm: 1,
            certificate: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv...",
        },
        {
            name: "secure.example.com.",
            ttl: 3600,
            class: "IN",
            type: "CERT",
            rdata: "1 8 1 MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu...",
            certType: 1,
            keyTag: 8,
            algorithm: 1,
            certificate: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu...",
        },
        {
            name: "user1._smimecert.example.com.",
            ttl: 3600,
            class: "IN",
            type: "SMIMEA",
            rdata: "3 0 1 2A3B4C5D6E7F89ABCDEF...",
            usage: 3,
            selector: 0,
            matchingType: 1,
            certAssociationData: "2A3B4C5D6E7F89ABCDEF...",
        },
        {
            name: "user2._smimecert.example.com.",
            ttl: 3600,
            class: "IN",
            type: "SMIMEA",
            rdata: "1 1 1 A1B2C3D4E5F67890ABCD...",
            usage: 1,
            selector: 1,
            matchingType: 1,
            certAssociationData: "A1B2C3D4E5F67890ABCD...",
        },
        {
            name: "example.com.",
            ttl: 3600,
            class: "IN",
            type: "SVCB",
            rdata: "0 svc1.example.net.",
            priority: 0,
            target: "svc1.example.net.",
            params: "",
        },
        {
            name: "_svc._tcp.example.com.",
            ttl: 3600,
            class: "IN",
            type: "SVCB",
            rdata: "1 target1.example.net. alpn=h2,h3 port=443",
            priority: 1,
            target: "target1.example.net.",
            params: "alpn=h2,h3 port=443",
        },
        {
            name: "_svc._tcp.example.com.",
            ttl: 3600,
            class: "IN",
            type: "SVCB",
            rdata:
                "2 target2.example.net. alpn=h2 mandatory=alpn ipv4hint=192.0.2.1,192.0.2.2",
            priority: 2,
            target: "target2.example.net.",
            params: "alpn=h2 mandatory=alpn ipv4hint=192.0.2.1,192.0.2.2",
        },
        {
            name: "_svc._tcp.example.com.",
            ttl: 3600,
            class: "IN",
            type: "SVCB",
            rdata:
                '3 target3.example.net. alpn=h3 ipv6hint=2001:db8::1,2001:db8::2 echconfig="ABC123..."',
            priority: 3,
            target: "target3.example.net.",
            params:
                'alpn=h3 ipv6hint=2001:db8::1,2001:db8::2 echconfig="ABC123..."',
        },
        {
            name: "_service1._tcp.example.com.",
            ttl: 3600,
            class: "IN",
            type: "URI",
            rdata: '10 1 "https://service1.example.com/api"',
            priority: 10,
            weight: 1,
            target: "https://service1.example.com/api",
        },
        {
            name: "_service2._tcp.example.com.",
            ttl: 3600,
            class: "IN",
            type: "URI",
            rdata: '20 1 "https://backup.example.com/"',
            priority: 20,
            weight: 1,
            target: "https://backup.example.com/",
        },
        {
            name: "_service3._udp.example.com.",
            ttl: 3600,
            class: "IN",
            type: "URI",
            rdata: '5 10 "ftp://ftp.example.com/files"',
            priority: 5,
            weight: 10,
            target: "ftp://ftp.example.com/files",
        },
        {
            name: "_sip._tcp.example.com.",
            ttl: 3600,
            class: "IN",
            type: "URI",
            rdata: '0 1 "sip:alice@example.com"',
            priority: 0,
            weight: 1,
            target: "sip:alice@example.com",
        },
        {
            name: "_xmpp._tcp.example.com.",
            ttl: 3600,
            class: "IN",
            type: "URI",
            rdata: '50 5 "xmpp:chat.example.com"',
            priority: 50,
            weight: 5,
            target: "xmpp:chat.example.com",
        },
        {
            name: "sub.example.com.",
            ttl: 3600,
            class: "IN",
            type: "DNAME",
            rdata: "example.com.",
            target: "example.com.",
        },
        {
            name: "sub2.example.com.",
            ttl: 3600,
            class: "IN",
            type: "DNAME",
            rdata: "www.example.com.",
            target: "www.example.com.",
        },
        {
            name: "nested.sub.example.com.",
            ttl: 3600,
            class: "IN",
            type: "DNAME",
            rdata: "sub.example.com.",
            target: "sub.example.com.",
        },
        {
            name: "host1.example.com.",
            ttl: 3600,
            class: "IN",
            type: "HINFO",
            rdata: '"Intel Core i7" "Windows 11"',
            cpu: "Intel Core i7",
            os: "Windows 11",
        },
        {
            name: "host2.example.com.",
            ttl: 3600,
            class: "IN",
            type: "HINFO",
            rdata: '"AMD Ryzen 9" "Linux"',
            cpu: "AMD Ryzen 9",
            os: "Linux",
        },
        {
            name: "host3.example.com.",
            ttl: 3600,
            class: "IN",
            type: "HINFO",
            rdata: 'Intel "MacOS Monterey"',
            cpu: "Intel",
            os: "MacOS Monterey",
        },
        {
            name: "host4.example.com.",
            ttl: 3600,
            class: "IN",
            type: "HINFO",
            rdata: '"ARM Cortex-A72" Linux',
            cpu: "ARM Cortex-A72",
            os: "Linux",
        },
        {
            name: "host5.example.com.",
            ttl: 3600,
            class: "IN",
            type: "HINFO",
            rdata: '"M1" "macOS Big Sur"',
            cpu: "M1",
            os: "macOS Big Sur",
        },
        {
            name: "pgp1.example.com.",
            ttl: 3600,
            class: "IN",
            type: "OPENPGPKEY",
            rdata: "mQENBF1EXAMPLEKEY123",
            publicKey: "mQENBF1EXAMPLEKEY123",
        },
        {
            name: "pgp2.example.com.",
            ttl: 3600,
            class: "IN",
            type: "OPENPGPKEY",
            rdata: "mQENBF2EXAMPLEKEY456",
            publicKey: "mQENBF2EXAMPLEKEY456",
        },
        {
            name: "pgp3.example.com.",
            ttl: 3600,
            class: "IN",
            type: "OPENPGPKEY",
            rdata: '"mQENBF3EXAMPLEKEY789"',
            publicKey: "mQENBF3EXAMPLEKEY789",
        },
        {
            name: "admin1.example.com.",
            ttl: 3600,
            class: "IN",
            type: "RP",
            rdata: "hostmaster.example.com. admin.example.com.",
            mailbox: "hostmaster.example.com.",
            txtDomain: "admin.example.com.",
        },
        {
            name: "admin2.example.com.",
            ttl: 3600,
            class: "IN",
            type: "RP",
            rdata: "postmaster.example.net. info.example.net.",
            mailbox: "postmaster.example.net.",
            txtDomain: "info.example.net.",
        },
        {
            name: "admin3.example.com.",
            ttl: 3600,
            class: "IN",
            type: "RP",
            rdata: "hostmaster.example.org. .",
            mailbox: "hostmaster.example.org.",
            txtDomain: ".",
        },
        {
            name: "admin4.example.com.",
            ttl: 3600,
            class: "IN",
            type: "RP",
            rdata: '"admin@example.com." "txt.example.com."',
            mailbox: "admin@example.com.",
            txtDomain: "txt.example.com.",
        },
    ];
}

function expected(): string {
    return `;;
;; Domain:     example.com.
;; Exported:   [DATE REMOVED]
;;
;; Generated using: ZoneX
;; NPM Package: https://github.com/thedeepakcodes/zonex-dns.git
;; 
;; ==================================================
;;
;; This file is intended for informational and archival
;; purposes ONLY and MUST be reviewed and edited before use
;; on a production DNS server.
;;
;; For further information, please consult the BIND documentation:
;;   https://www.isc.org/bind/
;;
;; And RFC 1035:
;;   https://www.rfc-editor.org/rfc/rfc1035.txt
;;
;; Disclaimer:
;;   We do NOT provide support for any use of this zone data,
;;   the BIND name server, or any other third-party DNS software.
;;
;; Use at your own risk.
;;
;; ==================================================

$ORIGIN example.com.
$TTL 3500

;; SOA records
example.com	3500	IN	SOA	martha.ns.cloudflare.com. dns.cloudflare.com. 2050976517 10000 2400 604800 3600

;; NS records
example.com.	86400	IN	NS	marth.ns.cloudflare.com.
example.com.	86400	IN	NS	ridg.ns.cloudflare.com.

;; A records
example.com.	1	IN	A	192.168.1.36

;; MX records
example.com.	3600	IN	MX	10 mail1.example.com.

;; AAAA records
www.example.com.	3600	IN	AAAA	2001:db8::1
api.example.com.	3600	IN	AAAA	2001:db8::2

;; CNAME records
ftp.example.com.	3600	IN	CNAME	www.example.com.

;; TXT records
example.com.	3600	IN	TXT	"v=spf1 include:_spf.example.com ~all"
_dmarc.example.com.	3600	IN	TXT	"v=DMARC1; p=none; rua=mailto:dmarc@example.com"

;; SRV records
_sip._tcp.example.com.	3600	IN	SRV	10 60 5060 sipserver.example.com.

;; CAA records
example.com.	3600	IN	CAA	0 issue "letsencrypt.org"
example.com.	3600	IN	CAA	0 issuewild "comodoca.com"
example.com.	3600	IN	CAA	0 iodef "mailto:security@example.com"
www.example.com.	3600	IN	CAA	0 issue "digicert.com"
api.example.com.	3600	IN	CAA	0 issue "sectigo.com"

;; SPF records
example.com.	3600	IN	SPF	v=spf1 include:_spf.google.com ~all

;; LOC records
host1.example.com.	3600	IN	LOC	37 46 29 N 122 25 10 W 1 10000 10
host2.example.com.	3600	IN	LOC	37 46 29 N 122 25 10 W 15 1 10000 10
host3.example.com.	3600	IN	LOC	37 46 29 N 122 25 10 W 20 5 50 5
host4.example.com.	3600	IN	LOC	51 30 0 N 0 7 0 W 1 10000 10

;; DS records
example.com.	3600	IN	DS	60485 8 2 49FD46E6C4B45C55D4AC
sub.example.com.	3600	IN	DS	12345 8 2 5B2E3C4F1D6A7B8C9D0E

;; DNSKEY records
example.com.	3600	IN	DNSKEY	257 3 8 AwEAAc3dF1Q2gK3v8sX9J1Rk...
sub.example.com.	3600	IN	DNSKEY	257 3 8 AwEAAz9vQ8rX1Kj2L7sYpZ...

;; TLSA records
_443._tcp.example.com.	3600	IN	TLSA	3 1 1 2D3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3

;; SSHFP records
host1.example.com.	3600	IN	SSHFP	1 1 123456789abcdef123456789abcdef12345678

;; HTTPS records
_443._tcp.host1.example.com.	3600	IN	HTTPS	1 1 "https://host1.example.com"

;; IPSECKEY records
host1.example.com.	3600	IN	IPSECKEY	1 2 1 203.0.113.1 "AwEAAc5kJk3..."

;; ALIAS records
alias1.example.com.	3600	IN	ALIAS	example.com.
alias3.example.com.	3600	IN	ALIAS	mail.example.com.

;; NAPTR records
sip1.example.com.	3600	IN	NAPTR	100 10 "U" "E2U+sip" "!^.*$!sip:info@example.com!" .
sip2.example.com.	3600	IN	NAPTR	200 20 "U" "E2U+email" "!^.*$!mailto:info@example.com!" .
tel1.example.com.	3600	IN	NAPTR	50 5 "U" "E2U+tel" "!^.*$!tel:+1234567890!" .
voip1.example.com.	3600	IN	NAPTR	10 100 "U" "E2U+sip" "!^.*$!sip:support@example.com!" .

;; CERT records
example.com.	3600	IN	CERT	1 5 1 MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt+...
sub.example.com.	3600	IN	CERT	2 3 1 MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv...
secure.example.com.	3600	IN	CERT	1 8 1 MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu...

;; SMIMEA records
user1._smimecert.example.com.	3600	IN	SMIMEA	3 1 2A3B4C5D6E7F89ABCDEF...
user2._smimecert.example.com.	3600	IN	SMIMEA	1 1 1 A1B2C3D4E5F67890ABCD...

;; SVCB records
example.com.	3600	IN	SVCB	svc1.example.net.
_svc._tcp.example.com.	3600	IN	SVCB	1 target1.example.net. alpn=h2,h3 port=443
_svc._tcp.example.com.	3600	IN	SVCB	2 target2.example.net. alpn=h2 mandatory=alpn ipv4hint=192.0.2.1,192.0.2.2
_svc._tcp.example.com.	3600	IN	SVCB	3 target3.example.net. alpn=h3 ipv6hint=2001:db8::1,2001:db8::2 echconfig="ABC123..."

;; URI records
_service1._tcp.example.com.	3600	IN	URI	10 1 https://service1.example.com/api
_service2._tcp.example.com.	3600	IN	URI	20 1 https://backup.example.com/
_service3._udp.example.com.	3600	IN	URI	5 10 ftp://ftp.example.com/files
_sip._tcp.example.com.	3600	IN	URI	1 sip:alice@example.com
_xmpp._tcp.example.com.	3600	IN	URI	50 5 xmpp:chat.example.com

;; DNAME records
sub.example.com.	3600	IN	DNAME	example.com.
sub2.example.com.	3600	IN	DNAME	www.example.com.
nested.sub.example.com.	3600	IN	DNAME	sub.example.com.

;; HINFO records
host1.example.com.	3600	IN	HINFO	"Intel Core i7" "Windows 11"
host2.example.com.	3600	IN	HINFO	"AMD Ryzen 9" "Linux"
host3.example.com.	3600	IN	HINFO	"Intel" "MacOS Monterey"
host4.example.com.	3600	IN	HINFO	"ARM Cortex-A72" "Linux"
host5.example.com.	3600	IN	HINFO	"M1" "macOS Big Sur"

;; OPENPGPKEY records
pgp1.example.com.	3600	IN	OPENPGPKEY	mQENBF1EXAMPLEKEY123
pgp2.example.com.	3600	IN	OPENPGPKEY	mQENBF2EXAMPLEKEY456
pgp3.example.com.	3600	IN	OPENPGPKEY	mQENBF3EXAMPLEKEY789

;; RP records
admin1.example.com.	3600	IN	RP	hostmaster.example.com. admin.example.com.
admin2.example.com.	3600	IN	RP	postmaster.example.net. info.example.net.
admin3.example.com.	3600	IN	RP	hostmaster.example.org. .
admin4.example.com.	3600	IN	RP	admin@example.com. txt.example.com.
`;
}
