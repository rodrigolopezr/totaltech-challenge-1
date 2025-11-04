import { http, paths } from './http'

export interface Pedido {
  id_pedido?: number
  folio: string
  consecutivo_completo?: string | null
  id_tipo_documento_pedido: number
  id_tipo_pedido?: number | null
  id_proveedor: number
  id_procedimiento_adquisicion?: number | null
  fecha_pedido: string
  numero_contrato?: string | null
  destinatario_factura?: string | null
  direccion_entrega?: string | null
  fecha_entrega?: string | null
  tiempo_entrega?: string | null
  persona_elaboro?: string | null
  persona_autorizo?: string | null
  iniciales?: string | null
  subtotal: number
  total_iva: number
  total_retenciones: number
  monto_total: number
  id_estado_pedido: number
  id_estado_surtido: number
  observaciones?: string | null
  fecha_registro: string
  hora_registro: string
  id_usuario_registro: number
  fecha_modifica?: string | null
  hora_modifica?: string | null
  id_usuario_modifica?: number | null
  fecha_aprueba?: string | null
  hora_aprueba?: string | null
  id_usuario_aprueba?: number | null
  id_archivo_firma?: number | null
}

export interface ListaResponse<T> {
  RowCount: number
  pedidos: T[]
  // shape may differ; adapt as needed in mapping layer
}

// ListaSelAll
export const listPedidos = async (params: {
  startRowIndex?: number
  maximumRows?: number
  Where?: string
  OrderBy?: string
}) => {
  const url = `${paths.PEDIDO_PATH}/ListaSelAll`
  const { data } = await http.get(url, { params })
  return data
}

export const getPedido = async (id: number) => {
  const url = `${paths.PEDIDO_PATH}/Get`
  const { data } = await http.get(url, { params: { id } })
  return data
}

export const createPedido = async (payload: Pedido) => {
  const url = `${paths.PEDIDO_PATH}/Post`
  const { data } = await http.post(url, payload)
  return data
}

export const updatePedido = async (id: number, payload: Pedido) => {
  const url = `${paths.PEDIDO_PATH}/Put`
  const { data } = await http.put(url, payload, { params: { Id: id } })
  return data
}
