export interface Product {
	nombre: string;
	precio?: string;
	imagen?: string;
	descripcion?: string;
	talles?: string;
	disponible?: string;
}

export interface GalleryPhoto {
	id?: string;
	imagen: string;
	descripcion?: string;
	visible?: string;
}

export interface WhatsAppParams {
	model_name: string;
	size: string;
	border_color: string;
	tipo_de_estampado: string;
	extra_comments: string;
}

export interface DriveImage {
	id: string;
	name: string;
}
