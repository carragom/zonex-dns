import type { RecordType } from "./parser.types.ts";

export interface GenerateOptions {
    origin?: string;
    ttl?: number;
    fieldMap?: {
        [rrType: string]: Record<string, string>;
    };
    keepComments?: boolean;
    keepHeaders?: boolean;
}

export interface InputRecord {
    name: string;
    type: RecordType;
    ttl?: number;
    class?: string;
}
