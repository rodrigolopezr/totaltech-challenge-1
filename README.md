# CAASIM Orders (Vue 3 + TypeScript)

Proyecto de ejemplo con patrón **API Services + UseCases (Reglas de negocio)** y componente que replica el HTML proporcionado.

## Requisitos
- Node.js 18+
- pnpm, npm o yarn

## Configuración
Copia `.env.example` a `.env` y ajusta las variables:
```bash
cp .env.example .env
```

**Aviso:** Endpoints y parámetros derivados de la Postman collection y diccionario adjuntos.

## Ejecutar
```bash
npm install
npm run dev
```

## Estructura
- `src/api`: Cliente HTTP (Axios) y servicios REST (pedido, auth)
- `src/domain/usecases`: Casos de uso donde se arma el `Where` y la lógica de búsqueda
- `src/components/ConsultaPedidos.vue`: Componente que conserva estilos/botones del HTML
