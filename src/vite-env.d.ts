interface ImportMetaEnv {
	readonly VITE_WHATSAPP_NUMBER: string;
	readonly VITE_PRODUCTS_SHEET_CSV_URL: string;
}

// biome-ignore lint/correctness/noUnusedVariables: this is needed for TypeScript to recognize import.meta.env
interface ImportMeta {
	readonly env: ImportMetaEnv;
}
