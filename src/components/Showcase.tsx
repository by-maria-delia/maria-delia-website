import { GALLERY_SHEET_CSV_URL } from "../config";
import useGoogleSheet from "../hooks/useGoogleSheet";
import type { GalleryPhoto } from "../types";
import FadeUp from "./FadeUp";

export default function Showcase() {
	const { data, loading, error } = useGoogleSheet<GalleryPhoto>(
		GALLERY_SHEET_CSV_URL,
	);

	const photos = data
		.filter((row) => row.visible?.toUpperCase() === "TRUE")
		.slice(0, 6);

	if (!GALLERY_SHEET_CSV_URL || error) return null;
	if (loading) return null;
	if (photos.length === 0) return null;

	return (
		<section id="galeria" className="px-4 py-24 bg-soft-white">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-14">
					<h2 className="mb-3 text-4xl tracking-tight font-display md:text-5xl text-denim-blue">
						Nuestros trabajos
					</h2>
					<p className="max-w-md mx-auto text-soft-gray">
						Algunos modelos personalizados que ya entregamos
					</p>
				</div>

				{/* Masonry-style grid with varied aspect ratios */}
				<div className="gap-4 space-y-4 columns-2 md:columns-3">
					{photos.map((photo, idx) => (
						<FadeUp
							key={photo.id || idx}
							delay={Math.min(idx, 4) * 80}
							className="group relative break-inside-avoid rounded-xl overflow-hidden bg-cream"
						>
							<img
								src={photo.imagen}
								alt={photo.descripcion || "Guardapolvo personalizado"}
								className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
							/>
							{photo.descripcion && (
								<div className="absolute inset-0 flex items-end p-4 transition-opacity duration-300 opacity-0 bg-linear-to-t from-dark-text/60 via-transparent to-transparent group-hover:opacity-100">
									<p className="text-sm font-medium text-white">
										{photo.descripcion}
									</p>
								</div>
							)}
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}
