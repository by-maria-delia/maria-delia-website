import Papa from "papaparse";
import { useEffect, useState } from "react";
import { PRODUCTS_SHEET_CSV_URL, SMOCKS_DATA_SHEET_CSV_URL } from "../config";
import type { SheetType } from "../types";

interface UseGoogleSheetResult<T> {
	data: T[];
	loading: boolean;
	error: string | null;
}
const SHEET_GIDS: Record<SheetType, string> = {
	products: PRODUCTS_SHEET_CSV_URL,
	details: SMOCKS_DATA_SHEET_CSV_URL,
};

export default function useGoogleSheet<T = Record<string, string>>(
	type: SheetType | null,
): UseGoogleSheetResult<T> {
	const [data, setData] = useState<T[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!type) {
			setLoading(false);
			return;
		}

		const csvUrl = SHEET_GIDS[type];
		let cancelled = false;

		async function fetchSheet() {
			try {
				const response = await fetch(csvUrl);
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				const text = await response.text();
				const result = Papa.parse<T>(text, {
					header: true,
					skipEmptyLines: true,
				});
				if (!cancelled) {
					setData(result.data);
					setLoading(false);
				}
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : String(err));
					setLoading(false);
				}
			}
		}

		fetchSheet();
		return () => {
			cancelled = true;
		};
	}, [type]);

	return { data, loading, error };
}
