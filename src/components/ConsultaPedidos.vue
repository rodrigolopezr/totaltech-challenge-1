<template>
  <div class="main-container">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-search"></i>
        Consulta de Pedidos
      </h1>
      <p class="page-subtitle">
        Consulte y analice todas las órdenes de pedido de compras con
        información detallada y filtros avanzados
      </p>
    </div>

    <!-- Filtros -->
    <div class="filters-section">
      <h3 class="filters-title">
        <i class="fas fa-filter"></i>
        Filtros de Búsqueda
      </h3>

      <div class="row">
        <div class="col-md-3 mb-3">
          <label class="form-label">Año *</label>
          <select
            class="form-select"
            v-model="filters.year"
            required
            id="yearFilter"
          >
            <option value="">Seleccione un año</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>

        <div class="col-md-3 mb-3">
          <label class="form-label">Folio</label>
          <input
            type="text"
            class="form-control"
            v-model="filters.folio"
            id="folioFilter"
            placeholder="Ej: PED-2024-001"
          />
        </div>

        <div class="col-md-3 mb-3">
          <label class="form-label">Proveedor</label>
          <select
            class="form-select"
            v-model="filters.supplierId"
            id="supplierFilter"
          >
            <option value="">Todos los proveedores</option>
            <option value="Distribuidora Industrial del Centro S.A. de C.V.">
              Distribuidora Industrial del Centro S.A. de C.V.
            </option>
            <option value="Suministros Técnicos Hidalgo S.A. de C.V.">
              Suministros Técnicos Hidalgo S.A. de C.V.
            </option>
            <option value="Comercializadora de Equipos Gubernamentales">
              Comercializadora de Equipos Gubernamentales
            </option>
            <option value="Papelería y Suministros Oficina Total">
              Papelería y Suministros Oficina Total
            </option>
            <option value="Constructora y Servicios Múltiples del Estado">
              Constructora y Servicios Múltiples del Estado
            </option>
          </select>
        </div>

        <div class="col-md-3 mb-3">
          <label class="form-label">Clave Presupuestal</label>
          <select
            class="form-select"
            v-model="filters.budgetKey"
            id="budgetFilter"
          >
            <option value="">Todas las claves</option>
            <option value="2110">2110 - Materiales de Administración</option>
            <option value="2120">
              2120 - Materiales y Artículos de Construcción
            </option>
            <option value="2140">
              2140 - Materiales y Artículos Metálicos
            </option>
            <option value="2150">
              2150 - Material Eléctrico y Electrónico
            </option>
            <option value="2160">2160 - Material de Limpieza</option>
            <option value="2170">
              2170 - Materiales y Útiles de Impresión
            </option>
          </select>
        </div>

        <div class="col-md-3 mb-3">
          <label class="form-label">Tipo de Pedido</label>
          <select class="form-select" v-model="filters.type" id="typeFilter">
            <option value="">Todos los tipos</option>
            <option value="NORMAL">Normal</option>
            <option value="URGENTE">Urgente</option>
            <option value="PROGRAMADO">Programado</option>
            <option value="ESPECIAL">Especial</option>
          </select>
        </div>

        <div class="col-md-3 mb-3">
          <label class="form-label">Fecha Desde</label>
          <input
            type="date"
            class="form-control"
            v-model="filters.dateFrom"
            id="dateFromFilter"
          />
        </div>

        <div class="col-md-3 mb-3">
          <label class="form-label">Fecha Hasta</label>
          <input
            type="date"
            class="form-control"
            v-model="filters.dateTo"
            id="dateToFilter"
          />
        </div>

        <div class="col-md-3 mb-3">
          <label class="form-label">Estado</label>
          <select
            class="form-select"
            v-model="filters.status"
            id="statusFilter"
          >
            <option value="">Todos los estados</option>
            <option value="COMPLETO">Completo</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="PARCIAL">Parcial</option>
          </select>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-12">
          <div class="d-flex gap-3 flex-wrap">
            <button type="button" class="btn btn-primary" @click="onSearch">
              <i class="fas fa-search"></i>
              <span>Buscar</span>
            </button>
            <button type="button" class="btn btn-secondary" @click="onClear">
              <i class="fas fa-eraser"></i>
              <span>Limpiar Filtros</span>
            </button>
            <button
              type="button"
              class="btn btn-info"
              data-bs-toggle="modal"
              data-bs-target="#advancedFiltersModal"
            >
              <i class="fas fa-cog"></i>
              <span>Filtros Avanzados</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-cards" v-show="stats.visible" id="statsSection">
      <div class="stat-card">
        <div class="stat-number">{{ stats.totalOrders.toLocaleString() }}</div>
        <div class="stat-label">Total de Pedidos</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ currency(stats.totalAmount) }}</div>
        <div class="stat-label">Monto Total</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">
          {{ stats.completedOrders.toLocaleString() }}
        </div>
        <div class="stat-label">Pedidos Completos</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">
          {{ stats.pendingOrders.toLocaleString() }}
        </div>
        <div class="stat-label">Pedidos Pendientes</div>
      </div>
    </div>

    <!-- Resultados -->
    <div class="results-section">
      <div class="results-header">
        <h3 class="results-title">
          <i class="fas fa-table"></i>
          Resultados de la Consulta
        </h3>
        <div class="export-buttons">
          <button
            type="button"
            id="exportBtn"
            class="btn btn-success"
            :disabled="rows.length === 0"
            @click="triggerDT('excel')"
          >
            <i class="fas fa-file-excel"></i>
            <span>Exportar a Excel</span>
          </button>
          <button
            type="button"
            class="btn btn-warning"
            @click="triggerDT('pdf')"
          >
            <i class="fas fa-file-pdf"></i>
            <span>Exportar a PDF</span>
          </button>
          <button
            type="button"
            class="btn btn-info"
            @click="triggerDT('print')"
          >
            <i class="fas fa-print"></i>
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      <div class="loading-spinner" v-if="loading" id="loadingSpinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3">Buscando pedidos...</p>
      </div>

      <div
        class="no-results"
        v-if="!loading && rows.length === 0 && !initial"
        id="noResults"
      >
        <i class="fas fa-search fa-3x text-muted mb-3"></i>
        <h4>No se encontraron resultados</h4>
        <p>
          Intente modificar los filtros de búsqueda para obtener resultados.
        </p>
      </div>

      <div class="table-container" v-show="rows.length > 0" id="resultsTable">
        <table
          class="table table-striped table-hover"
          id="ordersTable"
          ref="tableEl"
        >
          <thead>
            <tr>
              <th>Folio</th>
              <th>Partida</th>
              <th>Fecha Pedido</th>
              <th>Tipo</th>
              <th>Iniciales</th>
              <th>Proveedor</th>
              <th>R.F.C</th>
              <th>Clave Presupuestal</th>
              <th>Nombre de Partida</th>
              <th>Cantidad</th>
              <th>Cantidad Surtida</th>
              <th>Precio</th>
              <th>Unidad</th>
              <th>Observaciones</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, idx) in rows" :key="idx">
              <td>{{ r.folio }}</td>
              <td>{{ r.partida }}</td>
              <td>{{ formatDate(r.fechaPedido || r.fecha_pedido) }}</td>
              <td>
                <span class="badge bg-secondary">{{ r.tipo }}</span>
              </td>
              <td>{{ r.iniciales }}</td>
              <td>{{ r.proveedor }}</td>
              <td>{{ r.rfc }}</td>
              <td>{{ r.clavePresupuestal || r.clave_presupuestal }}</td>
              <td>{{ r.nombrePartida || r.nombre_partida }}</td>
              <td>{{ (r.cantidad ?? 0).toLocaleString() }}</td>
              <td>
                {{
                  (
                    r.cantidadSurtida ??
                    r.cantidad_surtida ??
                    0
                  ).toLocaleString()
                }}
              </td>
              <td>{{ currency(r.precio ?? 0) }}</td>
              <td>{{ r.unidad }}</td>
              <td>{{ r.observaciones }}</td>
              <td>{{ r.descripcion }}</td>
              <td>
                <button
                  class="btn btn-info btn-sm"
                  @click="openDetail(r)"
                  title="Ver Detalle"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="alert alert-info" v-if="initial" id="initialMessage">
        <i class="fas fa-info-circle"></i>
        <span
          >Seleccione un año y haga clic en "Buscar" para consultar los
          pedidos.</span
        >
      </div>
    </div>
  </div>

  <!-- Modal Detalle Bootstrap -->
  <div class="modal fade" id="orderDetailModal" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Detalle del Pedido</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <h6 class="text-primary mb-3">Información General</h6>
              <div class="detail-row">
                <span class="detail-label">Folio:</span
                ><span class="detail-value">{{ detail?.folio ?? "—" }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Fecha:</span
                ><span class="detail-value">{{
                  formatDate(detail?.fechaPedido || detail?.fecha_pedido)
                }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tipo:</span
                ><span class="detail-value">{{ detail?.tipo ?? "—" }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Iniciales:</span
                ><span class="detail-value">{{
                  detail?.iniciales ?? "—"
                }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Estado:</span
                ><span class="detail-value">{{ detail?.estado ?? "—" }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <h6 class="text-primary mb-3">Información del Proveedor</h6>
              <div class="detail-row">
                <span class="detail-label">Proveedor:</span
                ><span class="detail-value">{{
                  detail?.proveedor ?? "—"
                }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">R.F.C:</span
                ><span class="detail-value">{{ detail?.rfc ?? "—" }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Contacto:</span
                ><span class="detail-value">{{ detail?.contacto ?? "—" }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Teléfono:</span
                ><span class="detail-value">{{ detail?.telefono ?? "—" }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span
                ><span class="detail-value">{{ detail?.email ?? "—" }}</span>
              </div>
            </div>
          </div>
          <hr class="my-4" />
          <div class="row">
            <div class="col-12">
              <h6 class="text-primary mb-3">Información Presupuestal</h6>
              <div class="row">
                <div class="col-md-4">
                  <div class="detail-row">
                    <span class="detail-label">Clave Presupuestal:</span
                    ><span class="detail-value">{{
                      detail?.clavePresupuestal ??
                      detail?.clave_presupuestal ??
                      "—"
                    }}</span>
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="detail-row">
                    <span class="detail-label">Nombre de Partida:</span
                    ><span class="detail-value">{{
                      detail?.nombrePartida ?? detail?.nombre_partida ?? "—"
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr class="my-4" />
          <div class="row">
            <div class="col-md-3">
              <div class="detail-row">
                <span class="detail-label">Cantidad:</span
                ><span class="detail-value">{{ detail?.cantidad ?? "—" }}</span>
              </div>
            </div>
            <div class="col-md-3">
              <div class="detail-row">
                <span class="detail-label">Cantidad Surtida:</span
                ><span class="detail-value">{{
                  detail?.cantidadSurtida ?? detail?.cantidad_surtida ?? "—"
                }}</span>
              </div>
            </div>
            <div class="col-md-3">
              <div class="detail-row">
                <span class="detail-label">Precio Unitario:</span
                ><span class="detail-value">{{
                  currency(detail?.precio ?? 0)
                }}</span>
              </div>
            </div>
            <div class="col-md-3">
              <div class="detail-row">
                <span class="detail-label">Unidad:</span
                ><span class="detail-value">{{ detail?.unidad ?? "—" }}</span>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-6">
              <div class="detail-row">
                <span class="detail-label">Subtotal:</span
                ><span class="detail-value">{{
                  currency(subtotal(detail))
                }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="detail-row">
                <span class="detail-label">Total:</span
                ><span class="detail-value fw-bold">{{
                  currency(total(detail))
                }}</span>
              </div>
            </div>
          </div>
          <hr class="my-4" />
          <div class="row">
            <div class="col-12">
              <h6 class="text-primary mb-3">Información Adicional</h6>
              <div class="detail-row">
                <span class="detail-label">Descripción:</span
                ><span class="detail-value">{{
                  detail?.descripcion ?? "—"
                }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Observaciones:</span
                ><span class="detail-value">{{
                  detail?.observaciones ?? "—"
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cerrar
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="printOrderDetail"
          >
            Imprimir Detalle
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Filtros Avanzados Bootstrap -->
  <div class="modal fade" id="advancedFiltersModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Filtros Avanzados</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Monto Desde</label>
              <input
                type="number"
                class="form-control"
                v-model="adv.amountFrom"
                step="0.01"
                min="0"
                id="amountFromFilter"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Monto Hasta</label>
              <input
                type="number"
                class="form-control"
                v-model="adv.amountTo"
                step="0.01"
                min="0"
                id="amountToFilter"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Responsable (Iniciales)</label>
              <select
                class="form-select"
                v-model="adv.responsible"
                id="responsibleFilter"
              >
                <option value="">Todos los responsables</option>
                <option value="JGH">JGH - Juan García Hernández</option>
                <option value="MRL">MRL - María Rodríguez López</option>
                <option value="CAM">CAM - Carlos Álvarez Martínez</option>
                <option value="LPV">LPV - Laura Pérez Vázquez</option>
                <option value="RMC">RMC - Roberto Morales Castro</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Departamento</label>
              <select
                class="form-select"
                v-model="adv.department"
                id="departmentFilter"
              >
                <option value="">Todos los departamentos</option>
                <option value="ADMIN">Administración</option>
                <option value="OBRAS">Obras Públicas</option>
                <option value="SALUD">Salud</option>
                <option value="EDUCACION">Educación</option>
                <option value="SEGURIDAD">Seguridad Pública</option>
              </select>
            </div>
            <div class="col-md-12 mb-3">
              <label class="form-label">Palabras Clave en Descripción</label>
              <input
                type="text"
                class="form-control"
                v-model="adv.keywords"
                id="keywordsFilter"
                placeholder="Ej: computadora, papel, construcción"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Prioridad</label>
              <select
                class="form-select"
                v-model="adv.priority"
                id="priorityFilter"
              >
                <option value="">Todas las prioridades</option>
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Estado de Entrega</label>
              <select
                class="form-select"
                v-model="adv.deliveryStatus"
                id="deliveryStatusFilter"
              >
                <option value="">Todos los estados</option>
                <option value="ENTREGADO">Entregado</option>
                <option value="EN_TRANSITO">En Tránsito</option>
                <option value="PENDIENTE_ENTREGA">Pendiente de Entrega</option>
                <option value="RETRASADO">Retrasado</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancelar
          </button>
          <button type="button" class="btn btn-warning" @click="clearAdvanced">
            Limpiar Filtros
          </button>
          <button type="button" class="btn btn-primary" @click="applyAdvanced">
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import {
  searchOrders,
  type SearchFilters,
} from "@/domain/usecases/searchOrders";
import { getToken } from "@/api/http";

declare const bootstrap: any;
declare const $: any;

// Filtros base que viajan al backend
const filters = ref<SearchFilters>({
  year: "2024",
  dateFrom: "2024-01-01",
  dateTo: "2024-12-31",
});

// Filtros Avanzados (UI del modal)
const adv = ref({
  amountFrom: "",
  amountTo: "",
  responsible: "",
  department: "",
  keywords: "",
  priority: "",
  deliveryStatus: "",
});

const loading = ref(false);
const initial = ref(true);
const rows = ref<any[]>([]);
const tableEl = ref<HTMLTableElement | null>(null);
let dt: any = null;

const stats = ref({
  visible: false,
  totalOrders: 0,
  totalAmount: 0,
  completedOrders: 0,
  pendingOrders: 0,
});
const detail = ref<any>(null);

const currency = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
const formatDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const subtotal = (r: any) => (r?.cantidad ?? 0) * (r?.precio ?? 0);
const total = (r: any) => subtotal(r) * 1.16;

const computeStats = () => {
  stats.value.totalOrders = rows.value.length;
  stats.value.totalAmount = rows.value.reduce((acc, r) => acc + subtotal(r), 0);
  stats.value.completedOrders = rows.value.filter(
    (r) => r.estado === "COMPLETO" || r.id_estado_pedido === 1
  ).length;
  stats.value.pendingOrders = rows.value.filter(
    (r) => (r.estado && r.estado !== "COMPLETO") || r.id_estado_pedido !== 1
  ).length;
  stats.value.visible = rows.value.length > 0;
};

const rebuildDataTable = async () => {
  await nextTick();
  if (dt) {
    dt.destroy();
    dt = null;
  }
  if (!tableEl.value) return;
  dt = $(tableEl.value).DataTable({
    responsive: true,
    language: { url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json" },
    dom: "Bfrtip",
    buttons: [
      {
        extend: "excel",
        text: '<i class="fas fa-file-excel"></i> Excel',
        className: "btn btn-success btn-sm",
        filename: `Pedidos_${new Date().getFullYear()}_${
          new Date().getMonth() + 1
        }_${new Date().getDate()}`,
      },
      {
        extend: "pdf",
        text: '<i class="fas fa-file-pdf"></i> PDF',
        className: "btn btn-danger btn-sm",
        filename: `Pedidos_${new Date().getFullYear()}_${
          new Date().getMonth() + 1
        }_${new Date().getDate()}`,
        orientation: "landscape",
        pageSize: "A4",
      },
      {
        extend: "print",
        text: '<i class="fas fa-print"></i> Imprimir',
        className: "btn btn-secondary btn-sm",
      },
    ],
    pageLength: 25,
    order: [[2, "desc"]],
    columnDefs: [{ targets: [15], orderable: false }],
  });
};

const triggerDT = (which: "excel" | "pdf" | "print") => {
  if (!dt) return;
  if (which === "excel") dt.button(".buttons-excel").trigger();
  if (which === "pdf") dt.button(".buttons-pdf").trigger();
  if (which === "print") dt.button(".buttons-print").trigger();
};

const onSearch = async () => {
  if (!filters.value.year) {
    alert("Por favor seleccione un año para realizar la búsqueda.");
    return;
  }
  try {
    loading.value = true;
    initial.value = false;
    const tokenRaw = localStorage.getItem("caasim_token");
    if (!tokenRaw) {
      await getToken("admin", "admin");
    }
    // DEBUG opcional: ver qué WHERE se enviará
    // import { buildWhere } from '@/domain/usecases/searchOrders'
    // console.log('WHERE =>', buildWhere(filters.value))

    const data = await searchOrders(filters.value);
    const items = (
      data?.pedidos ||
      data?.items ||
      data?.Pedido ||
      data?.Rows ||
      data?.rowset ||
      []
    ).map((x: any) => ({ ...x }));
    rows.value = items.length ? items : [];

    computeStats();
    await rebuildDataTable();
  } catch (e) {
    console.error(e);
    alert("Ocurrió un error al consultar los pedidos. Revisa la consola.");
  } finally {
    loading.value = false;
  }
};

const onClear = () => {
  filters.value = {
    year: "",
    folio: "",
    supplierId: "",
    budgetKey: "",
    type: "",
    dateFrom: "",
    dateTo: "",
    status: "",
    amountFrom: "",
    amountTo: "",
    iniciales: "",
    departamento: "",
    keywords: "",
    prioridad: "",
    deliveryStatus: "",
  };
  rows.value = [];
  stats.value = {
    visible: false,
    totalOrders: 0,
    totalAmount: 0,
    completedOrders: 0,
    pendingOrders: 0,
  };
  initial.value = true;
  if (dt) {
    dt.destroy();
    dt = null;
  }
};

const openDetail = (r: any) => {
  detail.value = r;
  const modal = new bootstrap.Modal(
    document.getElementById("orderDetailModal")
  );
  modal.show();
};

const printOrderDetail = () => window.print();

// === Filtros avanzados ===
const clearAdvanced = () => {
  adv.value = {
    amountFrom: "",
    amountTo: "",
    responsible: "",
    department: "",
    keywords: "",
    priority: "",
    deliveryStatus: "",
  };

  // Limpia también en los filtros que viajan al backend
  filters.value.amountFrom = "";
  filters.value.amountTo = "";
  filters.value.iniciales = "";
  filters.value.departamento = "";
  filters.value.keywords = "";
  filters.value.prioridad = "";
  filters.value.deliveryStatus = "";
};

const applyAdvanced = () => {
  // Pasa valores del modal (adv) al objeto de filtros que viaja al backend
  filters.value.amountFrom = adv.value.amountFrom || "";
  filters.value.amountTo = adv.value.amountTo || "";
  filters.value.iniciales = adv.value.responsible || "";
  filters.value.departamento = adv.value.department || "";
  filters.value.keywords = adv.value.keywords || "";
  filters.value.prioridad = adv.value.priority || "";
  filters.value.deliveryStatus = adv.value.deliveryStatus || "";

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("advancedFiltersModal")
  );
  modal?.hide();
  onSearch();
};
</script>

<style scoped>
/* Copia de estilos del HTML original (layout/colores/badges/tablas) */
body {
  overflow-y: auto;
  margin: 0;
  padding: 20px;
  background-color: #f5f7fa;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
}
.main-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(13, 75, 118, 0.1);
  padding: 30px;
  margin-bottom: 20px;
}
.page-header {
  background: linear-gradient(135deg, #0d4b76 0%, #1a6b9f 100%);
  color: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(13, 75, 118, 0.3);
}
.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 15px;
}
.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 10px 0 0 0;
}
.filters-section {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
}
.filters-title {
  color: #0d4b76;
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.form-label {
  font-weight: 600;
  color: #0d4b76;
  margin-bottom: 8px;
}
.form-control,
.form-select {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}
.form-control:focus,
.form-select:focus {
  border-color: #1a6b9f;
  box-shadow: 0 0 0 0.2rem rgba(26, 107, 159, 0.25);
}
.btn-primary {
  background: linear-gradient(135deg, #0d4b76 0%, #1a6b9f 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(13, 75, 118, 0.3);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 75, 118, 0.4);
}
.btn-success {
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  font-weight: 600;
  transition: all 0.3s ease;
}
.btn-warning {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
}
.btn-info {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border: none;
  border-radius: 8px;
  padding: 8px 15px;
  font-weight: 600;
  transition: all 0.3s ease;
}
.results-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}
.results-title {
  color: #0d4b76;
  font-weight: 600;
  font-size: 1.4rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.stat-card {
  background: linear-gradient(135deg, #0d4b76 0%, #1a6b9f 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(13, 75, 118, 0.3);
}
.stat-number {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
}
.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}
.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.table {
  margin: 0;
  font-size: 0.9rem;
}
.table thead th {
  background: linear-gradient(135deg, #0d4b76 0%, #1a6b9f 100%);
  color: white;
  border: none;
  padding: 15px 10px;
  font-weight: 600;
  text-align: center;
  vertical-align: middle;
}
.table tbody td {
  padding: 12px 10px;
  vertical-align: middle;
  border-bottom: 1px solid #e9ecef;
  text-align: center;
}
.table tbody tr:hover {
  background-color: #f8f9fa;
}
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}
.status-completed {
  background: #d4edda;
  color: #155724;
}
.status-pending {
  background: #fff3cd;
  color: #856404;
}
.status-partial {
  background: #cce5ff;
  color: #004085;
}
.modal-header {
  background: linear-gradient(135deg, #0d4b76 0%, #1a6b9f 100%);
  color: white;
  border-bottom: none;
}
.modal-title {
  font-weight: 600;
}
.btn-close {
  filter: invert(1);
}
.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
}
.detail-label {
  font-weight: 600;
  color: #0d4b76;
}
.detail-value {
  color: #2c3e50;
}
.loading-spinner {
  text-align: center;
  padding: 40px;
}
.no-results {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}
.export-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.progress-bar {
  background: linear-gradient(135deg, #0d4b76 0%, #1a6b9f 100%);
}
.alert-info {
  background: #cce5ff;
  border-color: #1a6b9f;
  color: #004085;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }
  .results-header {
    flex-direction: column;
    align-items: stretch;
  }
  .export-buttons {
    justify-content: center;
  }
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>
