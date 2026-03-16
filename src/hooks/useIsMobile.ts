import { useEffect, useState } from "react";

const SCREEN_MD_QUERY = "(max-width: 768px)";

const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState(
		() => window.matchMedia(SCREEN_MD_QUERY).matches,
	);

	useEffect(() => {
		const checkIsMobile = () => {
			const mql = window.matchMedia(SCREEN_MD_QUERY);
			setIsMobile(mql.matches);
		};
		checkIsMobile();

		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

		const mql = window.matchMedia(SCREEN_MD_QUERY);
		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	}, []);

	return isMobile;
};

export default useIsMobile;
