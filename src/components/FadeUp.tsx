import useInView from "../hooks/useInView";

interface FadeUpProps {
	children: React.ReactNode;
	className?: string;
	delay?: number;
}

export default function FadeUp({ children, className = "", delay = 0 }: FadeUpProps) {
	const { ref, inView } = useInView();

	return (
		<div
			ref={ref as React.RefObject<HTMLDivElement>}
			className={`animate-fade-up ${inView ? "in-view" : ""} ${className}`}
			style={{ transitionDelay: `${delay}ms` }}
		>
			{children}
		</div>
	);
}
