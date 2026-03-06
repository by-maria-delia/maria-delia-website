import { WHATSAPP_NUMBER } from '../config'
import type { WhatsAppParams } from '../types'

export function buildWhatsAppURL({ model_name, size, border_color, tipo_de_estampado, extra_comments }: WhatsAppParams): string {
  const lines = [
    'Hola! Quiero consultar por este guardapolvo:',
    `Modelo: ${model_name}`,
    `Talle: ${size}`,
    `Borde: ${border_color}`,
    `Estampado: ${tipo_de_estampado}`,
  ]

  if (extra_comments) {
    lines.push(`Comentarios: ${extra_comments}`)
  }

  const message = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}
