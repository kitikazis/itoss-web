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
assets/css/styles.css      Estilos custom mínimos
assets/js/main.js          Configuración, datos (productos, alquiler, proyectos) y lógica
img/                       Logo, favicon y placeholders
docs/brochure-itoss.pdf    Brochure (placeholder)
.nojekyll                  Desactiva Jekyll en GitHub Pages
```

Todas las rutas son relativas (`./img/...`, `./productos.html`) para funcionar bajo `/itoss-web/`.

## Cambiar WhatsApp, teléfono y correo

Edita las tres constantes al inicio de `assets/js/main.js`:

```js
const WHATSAPP = "51902752445";      // código de país + número, sin + ni espacios
const TELEFONO = "+5117106880";
const CORREO = "comercial@itoss.pe";
```

Todos los enlaces `wa.me`, `tel:` y `mailto:` se generan desde ahí. Los textos visibles de teléfonos/correo (topbar y footer)
están escritos en el HTML de cada página; si cambian, actualízalos también (busca `710 6880`, `902 752 445`, `comercial@itoss.pe`).

## Configurar el formulario (Formspree)

1. Crea una cuenta en https://formspree.io y un formulario nuevo.
2. Copia su ID (la parte final de `https://formspree.io/f/xxxxxxx`).
3. En `index.html` y `alquiler.html` reemplaza `FORM_ID` en `action="https://formspree.io/f/FORM_ID"`.

## Reemplazar imágenes, logos y brochure

- **Logo:** sustituye `img/logo-itoss.png` (el actual es un placeholder generado). Opcional: `img/favicon.svg`.
- **Fotos de productos, alquiler y proyectos:** edita los arrays `PRODUCTOS`, `ALQUILER` y `PROYECTOS` en `assets/js/main.js`
  (cambia `imagen` por `"./img/mi-foto.jpg"`). La ubicación de cada proyecto también está ahí.
- **Hero, tarjetas de servicios y banners:** busca los comentarios `<!-- REEMPLAZAR -->` en los HTML.
- **Logos de clientes:** reemplaza `img/clientes/cliente-1.svg` … `cliente-6.svg` (busca `REEMPLAZAR LOGO CLIENTE` en `index.html`).
- **Brochure:** sustituye `docs/brochure-itoss.pdf` manteniendo el nombre.
- **Redes sociales:** actualiza las URLs del footer (hoy apuntan a las portadas de cada red).
- **RUC:** verifica el RUC del footer y de la política de privacidad (`VERIFICAR RUC`).

> Header y footer se repiten en cada HTML; si los cambias, aplica el cambio en todas las páginas.
