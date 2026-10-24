import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/comment-date.ts", import.meta.url), "utf8");
const exports = {};
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports });
const { formatCommentDate, formatCommentTimestamp } = exports;
const now = Date.parse("2026-10-25T12:00:00Z");
const ago = (minutes) => new Date(now - minutes * 60_000).toISOString();

test("French relative dates cover minutes, hours, days, weeks and one month", () => {
  for (const [minutes, expected] of [
    [0, "maintenant"], [1, "il y a 1 minute"], [59, "il y a 59 minutes"],
    [60, "il y a 1 heure"], [120, "il y a 2 heures"], [23 * 60, "il y a 23 heures"],
    [24 * 60, "hier"], [2 * 1440, "il y a 2 jours"], [7 * 1440, "il y a 7 jours"],
    [8 * 1440, "il y a 1 semaine"], [14 * 1440, "il y a 2 semaines"],
    [29 * 1440, "il y a 4 semaines"], [30 * 1440, "il y a 1 mois"], [59 * 1440, "il y a 1 mois"],
  ]) assert.equal(formatCommentDate(ago(minutes), "fr", now), expected);
  assert.equal(formatCommentDate(ago(60 * 1440), "fr", now), formatCommentTimestamp(ago(60 * 1440), "fr"));
});

test("English and fallback values stay supported", () => {
  assert.equal(formatCommentDate(ago(2), "en", now), "2 minutes ago");
  assert.equal(formatCommentDate(ago(1440), "en", now), "yesterday");
  assert.equal(formatCommentDate("", "fr", now), "");
  assert.equal(formatCommentDate("il y a 2 h", "fr", now), "il y a 2 h");
  assert.equal(formatCommentDate(new Date(now + 30_000).toISOString(), "fr", now), "maintenant");
});

test("exact timestamps use Paris time in winter and summer", () => {
  assert.match(formatCommentTimestamp("2026-01-15T12:00:00Z", "fr"), /13:00/);
  assert.match(formatCommentTimestamp("2026-07-15T12:00:00Z", "fr"), /14:00/);
  assert.match(formatCommentTimestamp("2026-10-25T00:30:00Z", "fr"), /02:30/);
  assert.match(formatCommentTimestamp("2026-10-25T01:30:00Z", "fr"), /02:30/);
});