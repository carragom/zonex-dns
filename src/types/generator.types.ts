import type { RecordType } from "./parser.types.ts";

/** Options for {@linkcode generate}. */
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
    type: keyof typeof RecordType;
    ttl?: number;
    class?: string;
    [key: string]: string | number | undefined;
}
