import { getPedido } from '@/api/pedido.service'

export const getPedidoDetalle = async (id: number) => {
  const data = await getPedido(id)
  return data
}
