import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import Papa from "papaparse";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_DIR = join(ROOT, "src", "data");

// ── Env vars ──────────────────────────────────────────────────────────
// CI provides env vars directly; locally fall back to .env file
function loadEnv() {
	if (!process.env.VITE_SHEET_CSV_URL) {
		try {
			const envFile = readFileSync(join(ROOT, ".env"), "utf-8");
			for (const line of envFile.split("\n")) {
				const trimmed = line.trim();
				if (!trimmed || trimmed.startsWith("#")) continue;
				const eqIdx = trimmed.indexOf("=");
				if (eqIdx === -1) continue;
				const key = trimmed.slice(0, eqIdx);
				const value = trimmed.slice(eqIdx + 1);
				if (!process.env[key]) process.env[key] = value;
			}
		} catch {
			// .env may not exist in CI
		}
	}
}
loadEnv();

const SHEET_CSV_URL = process.env.VITE_SHEET_CSV_URL;
const DRIVE_API_KEY = process.env.VITE_GOOGLE_DRIVE_API_KEY;

if (!SHEET_CSV_URL) {
	console.error("Missing VITE_SHEET_CSV_URL");
	process.exit(1);
}
if (!DRIVE_API_KEY) {
	console.error("Missing VITE_GOOGLE_DRIVE_API_KEY");
	process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────────────
async function fetchWithRetry(url, retries = 3) {
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const res = await fetch(url);
			if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
			return res;
		} catch (err) {
			if (attempt === retries) throw err;
			const delay = 1000 * 2 ** (attempt - 1);
			console.warn(`  Attempt ${attempt} failed, retrying in ${delay}ms...`);
			await new Promise((r) => setTimeout(r, delay));
		}
	}
}

function sheetUrl(gid) {
	return `${SHEET_CSV_URL}?gid=${gid}&single=true&output=csv`;
}

function writeData(filename, data) {
	const output = {
		meta: { fetchedAt: new Date().toISOString() },
		data,
	};
	const path = join(DATA_DIR, filename);
	writeFileSync(path, JSON.stringify(output, null, "\t") + "\n");
	console.log(`  ✓ ${filename} (${data.length} items)`);
}

// ── Fetch Google Sheet (CSV) ──────────────────────────────────────────
async function fetchSheet(gid, filename) {
	const url = sheetUrl(gid);
	const res = await fetchWithRetry(url);
	const text = await res.text();
	const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });
	writeData(filename, data);
}

// ── Fetch Google Drive folder (all pages) ─────────────────────────────
const FOLDER_IDS = {
	gallery: "1A5Wa_M-i2aXM4BCLA-xvLgzzGriQ3Na1",
	stamps: "1oM-E5h_3KE63q5l3-_x3nYBeVCN6SE2k",
	"border-colors": "1GFqc4b_f0AOx77SctLcDIlVSSwSlxkQX",
};

async function fetchDriveFolder(folderKey, filename) {
	const folderId = FOLDER_IDS[folderKey];
	let allFiles = [];
	let pageToken = undefined;

	do {
		const params = new URLSearchParams({
			q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
			key: DRIVE_API_KEY,
			fields: "nextPageToken,files(id,name)",
			pageSize: "100",
			orderBy: "name",
		});
		if (pageToken) params.set("pageToken", pageToken);

		const res = await fetchWithRetry(
			`https://www.googleapis.com/drive/v3/files?${params}`,
		);
		const json = await res.json();
		allFiles = allFiles.concat(json.files ?? []);
		pageToken = json.nextPageToken;
	} while (pageToken);

	writeData(filename, allFiles);
}

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
	console.log("Prefetching data...\n");

	await Promise.all([
		fetchSheet(0, "products.json"),
		fetchSheet(210216102, "smocks.json"),
		fetchDriveFolder("gallery", "gallery.json"),
		fetchDriveFolder("stamps", "stamps.json"),
		fetchDriveFolder("border-colors", "border-colors.json"),
	]);

	console.log("\nDone!");
}

main().catch((err) => {
	console.error("Prefetch failed:", err);
	process.exit(1);
});
