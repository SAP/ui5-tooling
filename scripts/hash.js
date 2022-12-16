/**
 * Utility to resolve hash of a file
 * Used to check whether Dockerfile has been changed and if we need to rebuild it
 *
 * Usage:
 * node hash.js /path/to/file
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";

const filename = path.resolve(process.argv[2]);

const fileBuffer = fs.readFileSync(filename);
const hashSum = crypto.createHash("md5");
hashSum.update(fileBuffer);

console.log(hashSum.digest("hex"));
