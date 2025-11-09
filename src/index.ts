import { generate, toZoneFile } from "./generator.ts";
import { parse } from "./parser.ts";

const zonex = { parse, generate, toZoneFile };

export default zonex;