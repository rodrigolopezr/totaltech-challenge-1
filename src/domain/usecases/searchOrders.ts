import { listPedidos } from "@/api/pedido.service";

export interface SearchFilters {
  year?: string;
  folio?: string;
  supplierId?: string;
  budgetKey?: string;
  type?: string | number;
  dateFrom?: string;
  dateTo?: string;
  status?: string | number;

  // Avanzados
  amountFrom?: string | number;
  amountTo?: string | number;
  iniciales?: string;
  departamento?: string;
  keywords?: string;
  prioridad?: string;
  deliveryStatus?: string;
}

const esc = (s: string) => String(s).replace(/'/g, "''").trim();
const has = (v: unknown) =>
  v !== undefined && v !== null && String(v).trim() !== "";
const isNum = (v: unknown) => /^\d+$/.test(String(v).trim());

export const buildWhere = (f: SearchFilters) => {
  const w: string[] = [];

  // Básicos
  if (has(f.year) && isNum(f.year))
    w.push(`YEAR(pedido.fecha_pedido)=${Number(f.year)}`);
  if (has(f.folio)) w.push(`pedido.folio like '%25${esc(f.folio!)}%25'`);

  if (has(f.supplierId)) {
    if (isNum(f.supplierId))
      w.push(`pedido.id_proveedor=${Number(f.supplierId)}`);
    else w.push(`pedido.id_proveedor='${esc(f.supplierId as string)}'`);
  }

  if (has(f.budgetKey)) {
    if (isNum(f.budgetKey))
      w.push(`pedido.id_clave_presupuestal=${Number(f.budgetKey)}`);
    else w.push(`pedido.id_clave_presupuestal='${esc(f.budgetKey as string)}'`);
  }

  // type y status: si son IDs numéricos, agrega como número; si no, cítalos o salta
  if (has(f.type)) {
    if (isNum(f.type)) w.push(`pedido.id_tipo_pedido=${Number(f.type)}`);
    // si tu columna es textual, usa esta: else w.push(`pedido.tipo='${esc(f.type as string)}'`)
  }

  if (has(f.status)) {
    if (isNum(f.status)) w.push(`pedido.id_estado_pedido=${Number(f.status)}`);
    // si tu columna es textual, usa esta: else w.push(`pedido.estado='${esc(f.status as string)}'`)
  }

  if (has(f.dateFrom)) w.push(`pedido.fecha_pedido>='${esc(f.dateFrom!)}'`);
  if (has(f.dateTo)) w.push(`pedido.fecha_pedido<='${esc(f.dateTo!)}'`);

  // Avanzados
  if (has(f.amountFrom) && isNum(f.amountFrom))
    w.push(`pedido.monto_total>=${Number(f.amountFrom)}`);
  if (has(f.amountTo) && isNum(f.amountTo))
    w.push(`pedido.monto_total<=${Number(f.amountTo)}`);
  if (has(f.iniciales)) w.push(`pedido.iniciales='${esc(f.iniciales!)}'`);
  if (has(f.departamento))
    w.push(`pedido.departamento='${esc(f.departamento!)}'`);
  if (has(f.keywords))
    w.push(`pedido.descripcion like '%25${esc(f.keywords!)}%25'`);
  if (has(f.prioridad)) w.push(`pedido.prioridad='${esc(f.prioridad!)}'`);
  if (has(f.deliveryStatus))
    w.push(`pedido.estado_entrega='${esc(f.deliveryStatus!)}'`);

  return w.join(" AND ");
};

export const searchOrders = async (filters: SearchFilters) => {
  const Where = buildWhere(filters);
  // console.log('WHERE =>', Where)   // <- útil para depurar
  return await listPedidos({
    startRowIndex: 1,
    maximumRows: 100,
    Where,
    Order: "pedido.id_pedido ASC", // OJO: tu backend usa "Order"
  });
};
