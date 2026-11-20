// gta6-clipper-01 entry program (Node 22, standard library only).
//
// The entry is a YouTube video: our AI agent cut a 26-second vertical clip from Rockstar's
// Grand Theft Auto VI Trailer 2 (Lucia's convertible ride through Vice City, the trailer's
// vehicle-chase crescendo, and a make.fun pitch card), and the clip lives in this repository
// as clip.mp4 until it is uploaded to YouTube as a public Short. This program's one job is to
// hand the video's address to the grader: it validates VIDEO.json at the repository root and
// copies it, byte for byte, into the output directory, where the gate reads it and the house
// then reads the video itself through the YouTube Data API.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// MAKEFUN_BOT_DIR names the repository root when it is not this file's own directory
// (in the grader's container the repository is mounted apart from /output).

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_DIR = process.env.MAKEFUN_BOT_DIR ?? dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const VIDEO_JSON = join(REPO_DIR, 'VIDEO.json');

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

// --- read and parse VIDEO.json -------------------------------------------------------------
let raw: string;
try {
  raw = readFileSync(VIDEO_JSON, 'utf8');
} catch {
  fail(`VIDEO.json is missing at ${VIDEO_JSON}`);
}

let data: unknown;
try {
  data = JSON.parse(raw!);
} catch {
  fail('VIDEO.json is not valid JSON');
}

if (typeof data !== 'object' || data === null || Array.isArray(data)) {
  fail('VIDEO.json must be a JSON object like {"url": "https://www.youtube.com/shorts/<id>"}');
}

const url = (data as { url?: unknown }).url;
if (typeof url !== 'string' || url.length === 0) {
  fail('VIDEO.json must carry a non-empty string "url"');
}

// --- validate the url's shape ---------------------------------------------------------------
// Accepted: https://www.youtube.com/shorts/<id>, https://www.youtube.com/watch?v=<id> and
// https://youtu.be/<id> (www. or m. before youtube.com read too), the id 11 characters of
// letters, digits, _ and -, a query or fragment after it read past. The starter's literal
// placeholder segment "<id>" is accepted as a shape so the repository runs before the video
// is uploaded; the gate itself refuses a placeholder, which is the point of it.
const ID = /^[A-Za-z0-9_-]{11}$/;

function videoIdOf(u: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(u);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:') return null;
  const segment = (s: string): string | null => {
    if (!s) return null;
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };
  const host = parsed.hostname;
  if (host === 'youtu.be' || host === 'www.youtu.be' || host === 'm.youtu.be') {
    return segment(parsed.pathname.slice(1).split('/')[0]);
  }
  if (host === 'youtube.com' || host === 'www.youtube.com' || host === 'm.youtube.com') {
    if (parsed.pathname.startsWith('/shorts/')) {
      return segment(parsed.pathname.slice('/shorts/'.length).split('/')[0]);
    }
    if (parsed.pathname === '/watch') {
      return parsed.searchParams.get('v');
    }
  }
  return null;
}

const id = videoIdOf(url!);
if (id === null || (id !== '<id>' && !ID.test(id))) {
  fail(`VIDEO.json url is not a YouTube video address: ${url}`);
}

// --- hand it over ----------------------------------------------------------------------------
mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(VIDEO_JSON, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  fail(`VIDEO.json could not be copied to ${OUTPUT_DIR}: ${(err as Error).message}`);
}
