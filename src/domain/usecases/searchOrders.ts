import { listPedidos } from "@/api/pedido.service";

export interface SearchFilters {
  year?: string;
  folio?: string;
  supplierId?: string;
  budgetKey?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;

  // --- Filtros Avanzados ---
  amountFrom?: string | number;
  amountTo?: string | number;
  iniciales?: string; // responsable
  departamento?: string; // departamento
  keywords?: string; // en descripción
  prioridad?: string; // prioridad
  deliveryStatus?: string; // estado de entrega
}

const esc = (s: string) => s.replace(/'/g, "''");

export const buildWhere = (f: SearchFilters) => {
  const clauses: string[] = [];

  // Básicos
  if (f.year) clauses.push(`YEAR(pedido.fecha_pedido)=${Number(f.year)}`);
  if (f.folio) clauses.push(`pedido.folio like '%25${esc(f.folio)}%25'`);
  if (f.supplierId) clauses.push(`pedido.id_proveedor=${Number(f.supplierId)}`);
  if (f.budgetKey)
    clauses.push(`pedido.id_clave_presupuestal=${Number(f.budgetKey)}`);
  if (f.type) clauses.push(`pedido.id_tipo_pedido='${esc(f.type)}'`);
  if (f.status) clauses.push(`pedido.id_estado_pedido='${esc(f.status)}'`);
  if (f.dateFrom) clauses.push(`pedido.fecha_pedido>='${esc(f.dateFrom)}'`);
  if (f.dateTo) clauses.push(`pedido.fecha_pedido<='${esc(f.dateTo)}'`);

  // Avanzados
  if (
    f.amountFrom !== undefined &&
    f.amountFrom !== "" &&
    f.amountFrom !== null
  )
    clauses.push(`pedido.monto_total>=${Number(f.amountFrom)}`);
  if (f.amountTo !== undefined && f.amountTo !== "" && f.amountTo !== null)
    clauses.push(`pedido.monto_total<=${Number(f.amountTo)}`);
  if (f.iniciales) clauses.push(`pedido.iniciales='${esc(f.iniciales)}'`);
  if (f.departamento)
    clauses.push(`pedido.departamento='${esc(f.departamento)}'`);
  if (f.keywords)
    clauses.push(`pedido.descripcion like '%25${esc(f.keywords)}%25'`);
  if (f.prioridad) clauses.push(`pedido.prioridad='${esc(f.prioridad)}'`);
  if (f.deliveryStatus)
    clauses.push(`pedido.estado_entrega='${esc(f.deliveryStatus)}'`);

  return clauses.join(" AND ");
};

export const searchOrders = async (filters: SearchFilters) => {
  const Where = buildWhere(filters);
  // DEBUG opcional: inspecciona el WHERE que se va a enviar
  // console.log('WHERE =>', Where)

  const data = await listPedidos({
    startRowIndex: 1,
    maximumRows: 100,
    Where,
    OrderBy: "pedido.id_pedido ASC",
  });
  return data;
};
