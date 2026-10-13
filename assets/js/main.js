/* ============================================================
   SITIO PÚBLICO — lee todo su contenido desde Store (assets/js/store.js)
   El contenido se edita desde /admin.html (demo) o en data/*.json.
   El HTML conserva el texto inicial (SEO y respaldo si algo falla).
   ============================================================ */

/* Valores por defecto; se reemplazan al cargar settings */
var CFG = { whatsapp: "51902752445", telefono: "+5117106880", correo: "comercial@itoss.pe" };

function waLink(mensaje) {
  return "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(mensaje || "Hola, quiero información");
}
window.waLink = waLink;

/* ---------- utilidades ---------- */
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
/* Solo permite rutas relativas, http(s), data:image, mailto y tel */
function url(u) {
  u = String(u == null ? "" : u).trim();
  if (!/^[a-z][a-z0-9+.\-]*:/i.test(u)) return u;             // ruta relativa
  return /^(https?:|mailto:|tel:|data:image\/)/i.test(u) ? u : "";
}
function digitos(s) { return String(s || "").replace(/\D/g, ""); }
function formatoWa(n) {
  var d = digitos(n);
  return d.length === 11 && d.indexOf("51") === 0
    ? "(+51) " + d.slice(2, 5) + " " + d.slice(5, 8) + " " + d.slice(8)
    : (d ? "+" + d : "");
}
var IMG_ERR = "this.onerror=null;this.src='./img/placeholder.svg'";

/* ---------- datos de configuración (WhatsApp, teléfono, correo) ---------- */
function aplicarContacto() {
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = waLink(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-tel]").forEach(function (a) { a.href = "tel:" + CFG.telefono; });
  document.querySelectorAll("[data-mail]").forEach(function (a) { a.href = "mailto:" + CFG.correo; });
}

/* ---------- enlaces declarativos: data-bind="archivo.ruta" ---------- */
function valorDe(datos, ruta) {
  return ruta.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, datos);
}
function archivosUsados() {
  var set = {};
  document.querySelectorAll("[data-bind],[data-bind-src],[data-bind-href],[data-render]").forEach(function (el) {
    ["bind", "bindSrc", "bindHref"].forEach(function (a) { if (el.dataset[a]) set[el.dataset[a].split(".")[0]] = 1; });
    if (el.dataset.render) set[RENDERERS[el.dataset.render].archivo] = 1;
  });
  return Object.keys(set);
}

var RENDERERS = {
  beneficios: { archivo: "home", fuente: "home.beneficios", html: function (b) {
    return '<li class="flex items-center gap-3 p-4"><span class="shrink-0 w-12 h-12 rounded-full bg-turquesa/10 text-turquesa flex items-center justify-center">' + itossIcono(b.icono, "w-6 h-6") +
      '</span><span class="font-titulo font-semibold text-sm text-marino leading-snug">' + esc(b.texto) + "</span></li>";
  } },
  razones: { archivo: "home", fuente: "home.razones", html: function (r) {
    return '<li class="bg-white rounded-xl p-6 text-center shadow-sm"><span class="mx-auto w-14 h-14 rounded-full bg-marino text-white flex items-center justify-center">' + itossIcono(r.icono, "w-7 h-7") +
      '</span><p class="mt-4 font-titulo font-bold text-marino">' + esc(r.texto) + "</p></li>";
  } },
  servicios: { archivo: "servicios", fuente: "servicios", html: function (s) {
    var color = { marino: "bg-marino", naranja: "bg-naranja", turquesa: "bg-turquesa", oscuro: "bg-oscuro" }[s.color] || "bg-marino";
    return '<a ' + (s.ancla ? 'id="' + esc(s.ancla) + '" ' : "") + 'href="' + esc(url(s.enlace) || "#") + '" class="group flex flex-col rounded-2xl overflow-hidden text-white shadow-lg hover:-translate-y-1 transition-transform scroll-mt-28 ' + color + '">' +
      '<img src="' + esc(url(s.imagen)) + '" alt="' + esc(s.titulo) + '" class="w-full h-44 object-cover" loading="lazy" onerror="' + IMG_ERR + '">' +
      '<div class="p-5 flex flex-col flex-1"><h3 class="font-titulo font-bold text-base leading-snug uppercase">' + esc(s.titulo) + "</h3>" +
      '<p class="mt-2 text-sm text-white/90 flex-1">' + esc(s.descripcion) + "</p>" +
      '<span class="mt-4 inline-flex w-11 h-11 items-center justify-center rounded-full bg-white/20 group-hover:bg-white group-hover:text-marino transition"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></div></a>';
  } },
  clientes: { archivo: "clientes", fuente: "clientes", html: function (c) {
    return '<li class="flex items-center justify-center h-24 rounded-xl border border-slate-100 bg-fondo p-4"><img src="' + esc(url(c.logo)) + '" alt="Logo de ' + esc(c.nombre) +
      '" class="logo-cliente max-h-14 w-auto object-contain" loading="lazy" width="160" height="56" onerror="' + IMG_ERR + '"></li>';
  } },
  telefonos: { archivo: "settings", fuente: "settings.telefonos_footer", simple: true, html: function (t) {
    return '<a href="tel:+' + digitos(t) + '" class="hover:text-turquesa">' + esc(t) + "</a>";
  }, unir: " / " }
};

function renderListas() {
  document.querySelectorAll("[data-render]").forEach(function (el) {
    var r = RENDERERS[el.dataset.render];
    if (!r) return;
    var ruta = r.fuente;
    (r.simple ? Store.get(ruta) : Store.list(ruta, { activos: true })).then(function (items) {
      if (!items || !items.length) return;        // sin datos: se conserva el HTML inicial
      el.innerHTML = items.map(r.html).join(r.unir || "");
    }).catch(function () {});                       // si falla, queda el HTML inicial
  });
}

function enlazar() {
  var archivos = archivosUsados();
  return Promise.all(archivos.map(function (a) { return Store.get(a).catch(function () { return null; }); })).then(function (vals) {
    var datos = {};
    archivos.forEach(function (a, i) { datos[a] = vals[i]; });

    if (datos.settings) {
      CFG.whatsapp = digitos(datos.settings.whatsapp) || CFG.whatsapp;
      if (datos.settings.telefono) CFG.telefono = "+" + digitos(datos.settings.telefono);
      CFG.correo = datos.settings.correo || CFG.correo;
    }
    aplicarContacto();

    function poner(sel, attr, fn) {
      document.querySelectorAll(sel).forEach(function (el) {
        var v = valorDe(datos, el.getAttribute(attr));
        if (v == null || v === "") return;
        fn(el, v);
      });
    }
    poner("[data-bind]", "data-bind", function (el, v) {
      var t = el.dataset.bindFormat === "wa" ? formatoWa(v) : String(v);
      el.textContent = (el.dataset.bindPrefix || "") + t;
    });
    poner("[data-bind-src]", "data-bind-src", function (el, v) { if (url(v)) el.src = url(v); });
    poner("[data-bind-href]", "data-bind-href", function (el, v) { if (url(v)) el.href = url(v); });
  }).then(renderListas);
}

/* ---------- SEO: título y descripción editables por página ---------- */
function aplicarSeo() {
  var pagina = document.body.dataset.pagina;
  if (!pagina) return;
  Store.get("seo." + pagina).then(function (s) {
    if (!s) return;
    if (s.title) {
      document.title = s.title;
      var og = document.querySelector('meta[property="og:title"]'); if (og) og.content = s.title;
    }
    if (s.description) {
      var d = document.querySelector('meta[name="description"]'); if (d) d.content = s.description;
      var ogd = document.querySelector('meta[property="og:description"]'); if (ogd) ogd.content = s.description;
    }
  }).catch(function () {});
}

function iniciar() { enlazar().then(aplicarSeo); }

document.addEventListener("DOMContentLoaded", function () {
  aplicarContacto();
  iniciar();
  Store.onChange(iniciar);   // el panel cambió datos (esta u otra pestaña)
});

/* ---------- componentes Alpine ---------- */
document.addEventListener("alpine:init", function () {
  /* Carga una lista del Store y se actualiza sola cuando el panel cambia datos */
  function listaViva(clave, filtro) {
    return {
      items: [], cargando: true, error: false,
      init: function () {
        var self = this;
        function cargar() {
          Store.list(clave, { activos: true }).then(function (arr) {
            self.items = filtro ? filtro(arr) : arr; self.error = false;
          }).catch(function () { self.error = true; }).then(function () { self.cargando = false; });
        }
        cargar();
        Store.onChange(cargar);
      }
    };
  }

  /* Carrusel con flechas; el swipe táctil lo da el scroll-snap nativo */
  var carrusel = {
    paso: function () {
      var c = this.$refs.pista.firstElementChild;
      return c ? c.getBoundingClientRect().width + 16 : 300;
    },
    anterior: function () { this.$refs.pista.scrollBy({ left: -this.paso(), behavior: "smooth" }); },
    siguiente: function () { this.$refs.pista.scrollBy({ left: this.paso(), behavior: "smooth" }); }
  };

  /* soloDestacados: en el inicio se muestran solo los marcados como destacados */
  Alpine.data("proyectos", function (soloDestacados) {
    return Object.assign(listaViva("proyectos", soloDestacados ? function (a) {
      return a.filter(function (p) { return p.destacado; });
    } : null), carrusel);
  });

  Alpine.data("alquiler", function () { return listaViva("alquiler"); });

  Alpine.data("productos", function () {
    return Object.assign(listaViva("productos", function (a) {
      // los destacados van primero; dentro de cada grupo se respeta el orden del panel
      return a.filter(function (p) { return p.destacado; }).concat(a.filter(function (p) { return !p.destacado; }));
    }), {
      categorias: Store.OPCIONES.categoriasProducto,
      marcas: Store.OPCIONES.marcas,
      categoria: "Todas",
      marca: "",
      filtrados: function () {
        var self = this;
        return this.items.filter(function (p) {
          return (self.categoria === "Todas" || p.categoria === self.categoria) &&
                 (!self.marca || p.marca === self.marca);
        });
      }
    });
  });
});
