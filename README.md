# sales-scraper

Web scraper configurable para monitorear cambios de precios y ofertas en sitios web. Extrae datos con selectores CSS, cachea resultados y notifica cambios mediante webhooks.

## Características

- **Scraping configurable**: Define selectores CSS y atributos por sitio
- **Caché inteligente**: Evita requests repetidas con TTL configurable (por defecto 2 días)
- **Base de datos SQLite**: Guarda histórico de cambios
- **Notificaciones extensibles**: Sistema de handlers con patrón Factory para alertas (webhooks implementado)
- **Configuración YAML**: Fácil setup de sitios, URLs y campos a monitorear
- **Validación con Zod**: Asegura integridad de configuración

## Instalación

```bash
bun install
```

## Uso

1. Copia y edita el archivo de configuración:

```bash
cp config/config.example.yml config/config.yml
```

2. Ejecuta el scraper:

```bash
bun run src/index.ts -c ./config/config.yml
```

O en modo desarrollo con configuración de ejemplo:

```bash
bun run dev
```

## Estructura del Proyecto

- **config/**: Archivos de configuración YAML
- **src/cache/**: Sistema de caché para fragmentos HTML
- **src/config/**: Cargador y schema de configuración
- **src/db/**: Persistencia en SQLite
- **src/delivery/**: Servicio de notificaciones
- **src/scraper/**: Motor de scraping y parser HTML

## Configuración

Ver `config/config.example.yml` para estructura completa. Elementos principales:

- `app_name`: Nombre de la aplicación
- `storage.table_name`: Tabla SQLite para guardar datos
- `delivery`: Canales de notificación con soporte para webhooks y extensible para otros tipos
- `sites`: Lista de sitios a scrapear con selectores CSS

## Tecnologías

- [Bun](https://bun.com): Runtime JavaScript
- [Cheerio](https://cheerio.js.org/): Parser HTML
- [Zod](https://zod.dev/): Validación de esquemas
