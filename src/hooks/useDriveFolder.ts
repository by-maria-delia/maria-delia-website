import { useEffect, useState } from "react";
import {
	BORDER_COLORS_DRIVE_FOLDER_ID,
	GALLERY_DRIVE_FOLDER_ID,
	STAMPS_DRIVE_FOLDER_ID,
} from "../config";
import type { DriveFolderType, DriveImage } from "../types";

const FOLDER_IDS: Record<DriveFolderType, string> = {
	gallery: GALLERY_DRIVE_FOLDER_ID,
	stamps: STAMPS_DRIVE_FOLDER_ID,
	borderColors: BORDER_COLORS_DRIVE_FOLDER_ID,
};

interface UseDriveFolderResult {
	images: DriveImage[];
	loading: boolean;
	error: string | null;
}

const apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;

export default function useDriveFolder(
	type: DriveFolderType | null,
): UseDriveFolderResult {
	const [images, setImages] = useState<DriveImage[]>([]);
	const [loading, setLoading] = useState(type !== null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!type || !apiKey) {
			setLoading(false);
			return;
		}

		const folderId = FOLDER_IDS[type];
		let cancelled = false;

		async function fetchFolder() {
			try {
				const params = new URLSearchParams({
					q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
					key: apiKey,
					fields: "files(id,name)",
					pageSize: "50",
					orderBy: "name",
				});

				const response = await fetch(
					`https://www.googleapis.com/drive/v3/files?${params}`,
				);

				if (!response.ok) throw new Error(`HTTP ${response.status}`);

				const json = await response.json();

				if (!cancelled) {
					console.log("Fetched Drive folder data:", json);
					setImages(json.files ?? []);
					setLoading(false);
				}
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : String(err));
					setLoading(false);
				}
			}
		}

		fetchFolder();
		return () => {
			cancelled = true;
		};
	}, [type]);

	return { images, loading, error };
}

/** Builds a direct-display URL for a publicly shared Drive image. */
export function driveImageUrl(fileId: string): string {
	// if instead of a fileId is passed a full URL, extract the ID
	if (fileId.startsWith("http")) {
		// full url example https://drive.google.com/file/d/1o32KQ5ABnS-xBnSJ3tLNd5QcHGRyC-8d/view?usp=drive_link
		// get the id part between /d/ and the next /
		const match = fileId.match(/\/d\/([^/]+)/);
		if (match) fileId = match[1];
		else {
			// TODO: add a placeholder image for these cases
			console.warn("Could not extract file ID from URL:", fileId);
			return "";
		}
	}
	return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${import.meta.env.VITE_GOOGLE_DRIVE_API_KEY}`;
}
