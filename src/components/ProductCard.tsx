import type { Product } from "../types";

interface ProductCardProps {
	product: Product;
	onCustomize: (product: Product) => void;
}

export default function ProductCard({
	product,
	onCustomize,
}: ProductCardProps) {
	return (
		<div className="flex flex-col overflow-hidden transition-all border group bg-soft-white rounded-2xl border-denim-blue/8 hover:border-school-blue/25 hover:shadow-lg hover:shadow-school-blue/8">
			<div className="overflow-hidden aspect-3/4 bg-cream">
				{product.imagen ? (
					<img
						src={product.imagen}
						alt={product.nombre}
						className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
					/>
				) : (
					<div className="flex items-center justify-center w-full h-full text-soft-gray/50">
						<svg
							className="w-16 h-16"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
				)}
			</div>

			<div className="flex flex-col flex-1 p-5">
				<h3 className="mb-1 text-lg font-semibold tracking-tight text-dark-text">
					{product.nombre}
				</h3>
				<span className="inline-block mb-3 text-sm font-handwritten text-teacher-pink">
					Personalizable
				</span>

				<div className="mt-auto">
					{product.precio && (
						<p className="mb-4 text-xl font-bold text-denim-blue tabular-nums">
							{product.precio}
						</p>
					)}
					<button
						type="button"
						onClick={() => onCustomize(product)}
						className="btn-press w-full bg-denim-blue text-white font-semibold py-2.5 rounded-lg hover:bg-denim-blue/90 hover:shadow-md hover:shadow-denim-blue/15 transition-all cursor-pointer"
					>
						Ver y personalizar
					</button>
				</div>
			</div>
		</div>
	);
}
