import { useState, useEffect } from "react";
import Papa from "papaparse";

interface UseGoogleSheetResult<T> {
	data: T[];
	loading: boolean;
	error: string | null;
}

export default function useGoogleSheet<T = Record<string, string>>(
	csvUrl: string,
): UseGoogleSheetResult<T> {
	const [data, setData] = useState<T[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!csvUrl) {
			setLoading(false);
			return;
		}

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
	}, [csvUrl]);

	return { data, loading, error };
}
