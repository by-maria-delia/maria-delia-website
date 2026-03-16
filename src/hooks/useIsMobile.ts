import { useEffect, useState } from "react";

// pointer: coarse = touch screen (mobile/tablet), pointer: fine = mouse (desktop)
const TOUCH_QUERY = "(pointer: coarse)";

const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState(() => window.matchMedia(TOUCH_QUERY).matches);

	useEffect(() => {
		const mql = window.matchMedia(TOUCH_QUERY);
		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	}, []);

	return isMobile;
};

export default useIsMobile;
