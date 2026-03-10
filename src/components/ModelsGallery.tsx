import { useState } from "react";
import { useProducts } from "../data";
import type { Product } from "../types";
import Customizer from "./Customizer";
import FadeUp from "./FadeUp";
import ProductCard from "./ProductCard";

export default function ModelsGallery() {
	const { data } = useProducts();
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
