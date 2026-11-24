// Alien Field Notes: The Two Day Earth Review — writes the entry to /output/entry.txt.
// Node 22, stdlib only. The entry is one line, 1-200 characters.
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const text = readFileSync(join(here, "entry.txt"), "utf8");

// Gate (mirrors the competition gate): 1-200 chars, not only whitespace, single line.
// Returns the trimmed entry text, or exits with an error.
function validateEntry(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length < 1 || trimmed.length > 200) {
    console.error(`entry must be 1-200 characters, got ${trimmed.length}`);
    process.exit(1);
  }
  if (trimmed.includes("\n")) {
    console.error("entry must be a single line");
    process.exit(1);
  }
  return trimmed;
}

const trimmed = validateEntry(text);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
// Write the entry bytes exactly as they are in entry.txt: no added
// trailing newline, so the graded file is byte-identical to the source.
writeFileSync(join(outDir, "entry.txt"), text, "utf8");
// Verify the written file is byte-identical to entry.txt before reporting
// success: a silent write error must fail loudly, not ship a wrong file.
const written = readFileSync(join(outDir, "entry.txt"), "utf8");
if (written !== text) {
  throw new Error("written entry.txt is not byte-identical to entry.txt");
}
console.log(`wrote ${trimmed.length}-character entry to ${join(outDir, "entry.txt")}`);
