import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/zoom";
import { Zoom } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { driveImageUrl } from "../hooks/useDriveFolder";
import useIsMobile from "../hooks/useIsMobile";
import type { DriveImage } from "../types";
import { cn } from "../utils/cn";
import ImagePlaceholder from "./ImagePlaceholder";

const ZOOM = 2;

interface ImageCarouselProps {
	images: DriveImage[];
	productName: string;
	className?: string;
}

export default function ImageCarousel({
	images,
	productName,
	className,
}: ImageCarouselProps) {
	const isMobile = useIsMobile();
	const [isZoomed, setIsZoomed] = useState(false);
	const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
	const [activeIndex, setActiveIndex] = useState(0);
	const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	if (images.length === 0) return null;

	const hasMultiple = images.length > 1;
	const canZoom = !isMobile && !images[activeIndex]?.placeholder;

	const handleMouseEnter = () => {
		if (canZoom) setIsZoomed(true);
	};
	const handleMouseLeave = () => setIsZoomed(false);
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!canZoom || !containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		setZoomOrigin({
			x: ((e.clientX - rect.left) / rect.width) * 100,
			y: ((e.clientY - rect.top) / rect.height) * 100,
		});
	};

	return (
		<div className={className}>
			{/* Relative wrapper: nav arrows are positioned here, outside Swiper's overflow-hidden */}
			<div className="relative">
				{/* Mouse event boundary for desktop hover zoom */}
				<div
					ref={containerRef}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onMouseMove={handleMouseMove}
					className={cn(isZoomed ? "cursor-crosshair" : "")}
				>
					<Swiper
						modules={[Zoom]}
						zoom={isMobile ? { maxRatio: 3 } : false}
						loop={hasMultiple}
						allowTouchMove={!isZoomed}
						onSwiper={setSwiperInstance}
						onRealIndexChange={(swiper) => {
							setActiveIndex(swiper.realIndex);
							setIsZoomed(false);
						}}
						className="rounded-xl overflow-hidden aspect-4/3 bg-cream"
					>
						{images.map((image, i) => {
							const imgSrc = image.url ?? driveImageUrl(image.id);
							const isActive = i === activeIndex;
							return (
								<SwiperSlide
									key={image.id || i}
									className="flex items-center justify-center bg-cream"
								>
									{image.placeholder ? (
										<ImagePlaceholder />
									) : (
										<>
											{/* swiper-zoom-container: Swiper Zoom module targets this on mobile */}
											<div className="swiper-zoom-container w-full h-full flex items-center justify-center">
												<img
													src={imgSrc}
													alt={`${productName} ${i + 1}`}
													className={cn("w-full h-full object-contain", {
														"opacity-0": isZoomed && isActive,
													})}
												/>
											</div>
											{/* Desktop-only hover zoom overlay — always opacity-0 on mobile */}
											{!isMobile && (
												<img
													src={imgSrc}
													alt=""
													aria-hidden={true}
													className={cn(
														"absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-200 opacity-0",
														{ "opacity-100": isZoomed && isActive },
													)}
													style={
														isZoomed && isActive
															? {
																	transform: `scale(${ZOOM})`,
																	transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
																}
															: undefined
													}
												/>
											)}
										</>
									)}
								</SwiperSlide>
							);
						})}
					</Swiper>
				</div>

				{/* Nav arrows: siblings of the zoom area so hovering them doesn't trigger zoom */}
				{hasMultiple && (
					<>
						<button
							type="button"
							onClick={() => swiperInstance?.slidePrev()}
							className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center transition cursor-pointer"
						>
							<svg className="w-4 h-4 text-dark-text" viewBox="0 0 24 24" fill="none">
								<path
									d="M15 19l-7-7 7-7"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
						<button
							type="button"
							onClick={() => swiperInstance?.slideNext()}
							className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center transition cursor-pointer"
						>
							<svg className="w-4 h-4 text-dark-text" viewBox="0 0 24 24" fill="none">
								<path
									d="M9 5l7 7-7 7"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</>
				)}
			</div>

			{/* Pagination dots: below the image, never inside the zoom area */}
			{hasMultiple && (
				<div className="flex justify-center gap-1.5 mt-3">
					{images.map((_, i) => (
						<button
							// biome-ignore lint/suspicious/noArrayIndexKey: index is stable for a static images array
							key={i}
							type="button"
							onClick={() => swiperInstance?.slideToLoop(i)}
							className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
								i === activeIndex
									? "bg-denim-blue"
									: "bg-denim-blue/25 hover:bg-denim-blue/40"
							}`}
						/>
					))}
				</div>
			)}
		</div>
	);
}
