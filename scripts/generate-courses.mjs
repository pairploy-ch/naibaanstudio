// Generates future `courses` rows (dated class instances) from the current
// weekly_template + course_time_slot schedule.
//
// Usage:
//   node scripts/generate-courses.mjs [weeks]
//
// `weeks` (default 13, ~3 months) controls how far ahead to generate.
// Safe to re-run: it only inserts dates that don't already have a course row
// for that weekly_template_id, so running it weekly (e.g. via a cron job) to
// keep the calendar topped up will never create duplicates or touch classes
// that already have bookings.
//
// If the weekly schedule changes again (new day, new type_of_course, new
// course_time_slot rows), just update the mapping below to match, then run
// this script — it will only affect *future, unbooked* dates.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnvLocal();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// day-of-week (JS getUTCDay: 0=Sun..6=Sat) -> { weekly_template_id, time_slot_ids }
const SCHEDULE = {
  1: { weeklyTemplateId: 3, slotIds: [14, 15, 16] }, // Monday
  2: { weeklyTemplateId: 7, slotIds: [17, 18, 19] }, // Tuesday
  // 3: Wednesday - closed
  4: { weeklyTemplateId: 5, slotIds: [4, 5] }, // Thursday
  5: { weeklyTemplateId: 6, slotIds: [1, 2, 3] }, // Friday
  6: { weeklyTemplateId: 1, slotIds: [20, 21, 22, 23] }, // Saturday
  0: { weeklyTemplateId: 2, slotIds: [10, 11, 12, 13] }, // Sunday
};

const DEFAULT_CAPACITY = 8;

async function main() {
  const weeks = Number(process.argv[2]) || 13;

  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + weeks * 7);

  const { data: existing, error: existingErr } = await supabase
    .from("courses")
    .select("date, weekly_template_id, time_slot_id")
    .gte("date", start.toISOString().slice(0, 10))
    .lte("date", end.toISOString().slice(0, 10));
  if (existingErr) throw existingErr;

  const existingKeys = new Set(
    existing.map((c) => `${c.date}|${c.weekly_template_id}|${c.time_slot_id}`),
  );

  const rows = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const dow = d.getUTCDay();
    const dayConfig = SCHEDULE[dow];
    if (!dayConfig) continue;

    const dateStr = d.toISOString().slice(0, 10);
    for (const slotId of dayConfig.slotIds) {
      const key = `${dateStr}|${dayConfig.weeklyTemplateId}|${slotId}`;
      if (existingKeys.has(key)) continue;
      rows.push({
        date: dateStr,
        weekly_template_id: dayConfig.weeklyTemplateId,
        time_slot_id: slotId,
        capacity: DEFAULT_CAPACITY,
        status: "open",
      });
    }
  }

  if (rows.length === 0) {
    console.log("Nothing to generate — all dates in range already exist.");
    return;
  }

  const { error: insertErr } = await supabase.from("courses").insert(rows);
  if (insertErr) throw insertErr;

  console.log(`Generated ${rows.length} new course rows through ${end.toISOString().slice(0, 10)}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
