# ITOSS Supplies & Services — Sitio web corporativo

Sitio 100% estático (HTML5 + Tailwind CSS por CDN + Alpine.js por CDN), sin build, listo para GitHub Pages:
https://kitikazis.github.io/itoss-web/

## Estructura

```
index.html                 Inicio
productos.html             Catálogo con filtro por categoría y marca
alquiler.html              Equipos en alquiler + reparación multimarca + cotización
proyectos.html             Todos los proyectos
politica-privacidad.html   Política de privacidad
terminos.html              Términos y condiciones
admin.html                 Panel de administración DEMO (ver más abajo)
data/*.json                Contenido editable del sitio (fuente inicial de los datos)
assets/css/styles.css      Estilos custom mínimos
assets/js/store.js         Capa de datos (localStorage con respaldo en data/*.json)
assets/js/main.js          Lógica del sitio público (lee el contenido desde Store)
assets/js/admin.js         Lógica del panel
assets/js/iconos.js        Iconos disponibles para beneficios y "¿Por qué elegirnos?"
img/                       Logo, favicon y placeholders
docs/brochure-itoss.pdf    Brochure (placeholder)
.nojekyll                  Desactiva Jekyll en GitHub Pages
```

Todas las rutas son relativas (`./img/...`, `./productos.html`) para funcionar bajo `/itoss-web/`.

## Contenido editable (`data/*.json`)

Todo el contenido variable vive en `data/`:

| Archivo | Contenido |
|---|---|
| `settings.json` | WhatsApp, teléfonos, correo, dirección, RUC, redes, logo, brochure |
| `home.json` | Portada, beneficios, "¿Por qué elegirnos?", misión, visión, texto del pie |
| `servicios.json` | Tarjetas de servicios del inicio |
| `productos.json` | Catálogo (nombre, categoría, marca, imagen, specs, destacado, activo) |
| `alquiler.json` | Equipos de alquiler (nombre, imagen, specs, disponible, activo) |
| `proyectos.json` | Proyectos (título, foto, ubicación, categoría, destacado, activo) |
| `clientes.json` | Logos de clientes |
| `seo.json` | Título y descripción por página |

Cada elemento tiene `id` (uuid) y `orden`. El sitio muestra solo los elementos con `activo: true`; los proyectos con
`destacado: true` salen en el carrusel del inicio y los productos destacados se listan primero.

Puedes editar estos archivos a mano o desde el panel (ver abajo) y pasar los cambios con **Exportar datos**.
El HTML conserva el texto inicial de cada sección (SEO y respaldo si los datos no cargan).

## Panel de administración (demo)

- **URL:** https://kitikazis.github.io/itoss-web/admin.html (tiene `noindex`, no aparece en Google)
- **Acceso demo:** `admin@itoss.pe` / `itoss2026` (login simulado; la sesión dura mientras la pestaña esté abierta)

### Cómo funciona

Es una demostración **sin backend**: todo se guarda en el `localStorage` del navegador (claves `itoss_*`). Por eso:

- Los cambios solo los ve **quien los hace, en ese navegador**. Los demás visitantes siguen viendo `data/*.json`.
- El sitio público se actualiza al instante, incluso en otras pestañas abiertas (evento `storage`).
- Las imágenes subidas se comprimen (máx. 1200 px, calidad 0.7) y se guardan en base64. El límite del navegador
  es ~5 MB: el panel avisa cuando se llega al 70 %. Para no llenarlo, prefiere pegar URLs.
- **Restablecer demo** (en *Configuración*) borra las claves `itoss_*` y el sitio vuelve a leer `data/*.json`.
- Si `localStorage` está bloqueado (modo privado, etc.), el sitio sigue funcionando con los JSON.

Módulos: Dashboard, Configuración, Inicio, Servicios, Productos, Alquiler, Proyectos, Clientes, ¿Por qué elegirnos?,
Brochure y SEO. Funciona en celular (menú hamburguesa, listas como tarjetas, formularios a pantalla completa).

### Pasar los cambios de la demo al sitio real

1. Entra al panel → **Configuración** → **Exportar datos**: descarga `itoss-datos-AAAAMMDD.zip`.
2. Descomprime el zip: contiene la carpeta `data/` con los 8 JSON.
3. Copia los archivos sobre `data/` del repositorio (reemplazando los existentes), haz commit y push.
4. Las imágenes subidas desde el panel van incrustadas (base64) en esos JSON. Para producción conviene guardarlas como
   archivos en `img/` y poner su ruta (`./img/foto.jpg`) en el JSON.

### Migrar `store.js` a una API REST (Laravel) o Supabase

El panel (`admin.js`) y las páginas públicas (`main.js`) **solo** hablan con `window.Store`. La interfaz es:

```js
Store.get(clave)                     // "settings", "home.hero", "seo.index.title"
Store.set(clave, valor)
Store.list(clave, { activos: true }) // colecciones ordenadas por `orden`
Store.create(clave, item)  Store.update(clave, id, cambios)  Store.remove(clave, id)  Store.move(clave, id, ±1)
Store.upload(file)                   // devuelve la URL/base64 de la imagen
Store.reset()  Store.exportAll()  Store.usage()  Store.onChange(cb)
```

Para migrar, reemplaza el bloque `ALMACENAMIENTO` de `assets/js/store.js` (`loadRoot` / `saveRoot`) o cada método,
sin tocar `admin.js` ni las páginas:

- **API REST (Laravel):** `GET /api/{coleccion}` para `get`/`list`; `POST /api/{coleccion}`, `PUT /api/{coleccion}/{id}`,
  `DELETE /api/{coleccion}/{id}` para `create`/`update`/`remove`; `POST /api/{coleccion}/{id}/mover` para `move`;
  `POST /api/upload` (multipart) para `upload`, devolviendo la URL pública. Proteger las rutas de escritura con
  Sanctum (reemplazando el login simulado de `admin.js`).
- **Supabase:** una tabla por colección (`productos`, `proyectos`, …) con `id uuid`, `orden int` y las columnas del JSON;
  `settings`, `home` y `seo` como tablas de una fila (o JSONB). Usa `supabase.from(tabla).select/insert/update/delete`
  y `supabase.storage.from('img').upload()` para `upload`. Activa RLS: lectura pública, escritura solo autenticada
  (con Supabase Auth en lugar del login simulado).
- `Store.onChange` puede apoyarse en Supabase Realtime o en *polling* para refrescar el sitio.

> Seguridad: el login de la demo es solo de muestra (las credenciales están en el JavaScript). No lo uses en producción.

## Cambiar WhatsApp, teléfono y correo

Desde el panel: **Configuración → Datos de contacto**. O edita `data/settings.json`:

```json
"whatsapp": "51902752445",           // código de país + número, sin + ni espacios
"telefono": "(+511) 710 6880",       // el que aparece en la barra superior
"telefonos_footer": ["(+511) 710 6880", "(+511) 710 6888"],
"correo": "comercial@itoss.pe"
```

Todos los enlaces `wa.me`, `tel:` y `mailto:` y los textos visibles (barra superior y pie) se generan desde ahí.

## Configurar el formulario (Formspree)

1. Crea una cuenta en https://formspree.io y un formulario nuevo.
2. Copia su ID (la parte final de `https://formspree.io/f/xxxxxxx`).
3. En `index.html` y `alquiler.html` reemplaza `FORM_ID` en `action="https://formspree.io/f/FORM_ID"`.

## Reemplazar imágenes, logos y brochure

Todo se cambia desde el panel o en `data/*.json` (cada campo de imagen acepta una URL o una ruta como `./img/mi-foto.jpg`):

- **Logo:** `settings.json → logo` (por defecto `img/logo-itoss.svg`).
- **Fotos de productos, alquiler y proyectos:** `productos.json`, `alquiler.json`, `proyectos.json`.
- **Portada, servicios y brochure:** `home.json → hero.imagen`, `servicios.json`, `settings.json → brochure_portada`.
- **Logos de clientes:** `clientes.json` (por defecto `img/clientes/cliente-N.svg`).
- **Brochure:** sustituye `docs/brochure-itoss.pdf` o cambia `settings.json → brochure_pdf`.
- **Redes sociales:** `settings.json` (hoy apuntan a las portadas de cada red).
- **RUC:** verifica `settings.json → ruc` y el texto de la política de privacidad (`VERIFICAR RUC`).
- **Banners de las páginas internas e imagen Open Graph:** siguen en el HTML (busca `<!-- REEMPLAZAR -->`).

> Header y footer se repiten en cada HTML; si cambias su estructura, aplica el cambio en todas las páginas.
