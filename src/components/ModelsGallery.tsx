import { useState } from "react";
import { PRODUCTS_SHEET_CSV_URL } from "../config";
import useGoogleSheet from "../hooks/useGoogleSheet";
import type { Product } from "../types";
import Customizer from "./Customizer";
import FadeUp from "./FadeUp";
import ProductCard from "./ProductCard";

export default function ModelsGallery() {
	const { data, loading, error } = useGoogleSheet<Product>(
		PRODUCTS_SHEET_CSV_URL,
	);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	const products = data.filter(
		(row) => row.disponible?.toUpperCase() === "TRUE",
	);

	return (
		<section id="modelos" className="px-4 py-24 bg-cream/50">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-14">
					<h2 className="mb-3 text-4xl tracking-tight font-display md:text-5xl text-denim-blue">
						Nuestros modelos
					</h2>
					<p className="max-w-md mx-auto text-soft-gray">
						Cada uno se puede personalizar con tu talle, color y estampado
						favorito
					</p>
				</div>

				{loading && (
					<div className="flex flex-col items-center justify-center gap-4 py-20">
						{/* Skeleton loader instead of spinner */}
						<div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="overflow-hidden border rounded-2xl border-denim-blue/8"
								>
									<div className="aspect-3/4 bg-denim-blue/5 animate-pulse" />
									<div className="p-5 space-y-3">
										<div className="w-2/3 h-5 rounded bg-denim-blue/5 animate-pulse" />
										<div className="w-1/3 h-4 rounded bg-denim-blue/5 animate-pulse" />
										<div className="h-10 mt-4 rounded-lg bg-denim-blue/5 animate-pulse" />
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{error && (
					<div className="py-12 text-center">
						<p className="mb-2 text-soft-gray">
							No pudimos cargar los modelos.
						</p>
						<p className="text-sm text-soft-gray/70">
							Intentá nuevamente más tarde.
						</p>
					</div>
				)}

				{!loading &&
					!error &&
					products.length === 0 &&
					!PRODUCTS_SHEET_CSV_URL && (
						<div className="py-12 text-center text-soft-gray">
							<p className="mb-2">No hay una hoja de cálculo configurada.</p>
							<p className="text-sm">
								Configurá la URL en{" "}
								<code className="px-2 py-1 text-xs rounded bg-cream text-denim-blue">
									src/config.ts
								</code>
							</p>
						</div>
					)}

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{products.map((product, idx) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: index is fine here since products won't be reordered or filtered
						<FadeUp key={product.nombre + idx} delay={Math.min(idx, 4) * 80}>
							<ProductCard product={product} onCustomize={setSelectedProduct} />
						</FadeUp>
					))}
				</div>
			</div>

			{selectedProduct && (
				<Customizer
					product={selectedProduct}
					onClose={() => setSelectedProduct(null)}
				/>
			)}
		</section>
	);
}
