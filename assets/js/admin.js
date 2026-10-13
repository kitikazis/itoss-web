/* ============================================================
   PANEL DE ADMINISTRACIÓN (DEMO) — ITOSS
   Toda la persistencia pasa por Store (assets/js/store.js): este archivo no
   sabe si los datos viven en localStorage, una API REST o Supabase.
   Los módulos se describen como configuración (VISTAS); el componente
   Alpine `admin()` los dibuja de forma genérica.
   ============================================================ */
(function () {
  "use strict";

  var USUARIO = "admin@itoss.pe", CLAVE = "itoss2026", SESION = "itoss_admin_sesion";
  var OP = Store.OPCIONES;

  /* ---------- iconos de la interfaz ---------- */
  var IC = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    editar: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    borrar: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
    arriba: '<path d="m6 15 6-6 6 6"/>',
    abajo: '<path d="m6 9 6 6 6-6"/>',
    mas: '<path d="M12 5v14M5 12h14"/>',
    salir: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    ver: '<path d="M14 3h7v7M10 14 21 3M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/>',
    subir: '<path d="M12 16V4m0 0-4 4m4-4 4 4M5 20h14"/>',
    buscar: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    alerta: '<path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
    descargar: '<path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/>',
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    configuracion: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    inicio: '<path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    servicios: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    productos: '<path d="m21 8-9-5-9 5 9 5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/>',
    alquiler: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    proyectos: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    clientes: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14a5 5 0 0 1 4 5"/>',
    razones: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    brochure: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    seo: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6M11 8v6"/>'
  };
  function ic(n, c) {
    return '<svg class="' + (c || "w-5 h-5") + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[n] || "") + "</svg>";
  }

  /* ---------- descripción de los módulos ---------- */
  function opts(arr) { return arr.map(function (x) { return { v: x, l: x }; }); }
  var COLORES = [{ v: "marino", l: "Azul ITOSS" }, { v: "naranja", l: "Naranja" }, { v: "turquesa", l: "Turquesa" }, { v: "oscuro", l: "Azul oscuro" }];
  var ICONOS = Object.keys(window.ITOSS_ICONOS).map(function (k) { return { v: k, l: window.ITOSS_ICONOS[k].label }; });

  var T_ACTIVO = { n: "activo", l: "Visible en la web" };

  var VISTAS = [
    { id: "dashboard", label: "Dashboard", titulo: "Resumen", bloques: [] },
    { id: "configuracion", label: "Configuración", titulo: "Configuración general", bloques: [
      { id: "cfg-contacto", tipo: "form", titulo: "Datos de contacto", clave: "settings", campos: [
        { n: "whatsapp", l: "WhatsApp", t: "wa", req: true, ayuda: "Con código de país y sin el signo +. Ejemplo: 51902752445" },
        { n: "telefono", l: "Teléfono principal (barra superior)", t: "tel", req: true, ayuda: "Ejemplo: (+511) 710 6880" },
        { n: "telefonos_footer", l: "Teléfonos del pie de página", t: "lista", vt: "tel", ayuda: "Uno por línea." },
        { n: "correo", l: "Correo comercial", t: "email", req: true },
        { n: "direccion", l: "Dirección", t: "text", req: true },
        { n: "ruc", l: "RUC", t: "ruc", ayuda: "11 dígitos." }
      ] },
      { id: "cfg-redes", tipo: "form", titulo: "Redes sociales", clave: "settings", campos: [
        { n: "facebook", l: "Facebook", t: "url", ayuda: "Enlace completo, empieza con https://" },
        { n: "instagram", l: "Instagram", t: "url" },
        { n: "linkedin", l: "LinkedIn", t: "url" },
        { n: "youtube", l: "YouTube", t: "url" }
      ] },
      { id: "cfg-logo", tipo: "form", titulo: "Logo", clave: "settings", campos: [
        { n: "logo", l: "Logo de la empresa", t: "imagen", req: true, ayuda: "Se muestra arriba y en el pie de página. Funciona mejor con fondo transparente (PNG o SVG)." }
      ] },
      { id: "cfg-datos", tipo: "acciones", titulo: "Datos de esta demostración" }
    ] },
    { id: "inicio", label: "Inicio", titulo: "Página de inicio", bloques: [
      { id: "ini-hero", tipo: "form", titulo: "Portada (parte superior)", clave: "home.hero", campos: [
        { n: "eyebrow", l: "Texto pequeño superior", t: "text", req: true },
        { n: "titulo", l: "Título principal", t: "textarea", req: true, max: 120 },
        { n: "subtitulo", l: "Subtítulo", t: "textarea", req: true, max: 220 },
        { n: "imagen", l: "Imagen de fondo", t: "imagen", req: true },
        { n: "boton_principal", l: "Texto del botón naranja", t: "text", req: true, mitad: true },
        { n: "boton_secundario", l: "Texto del botón blanco", t: "text", req: true, mitad: true }
      ] },
      { id: "ini-beneficios", tipo: "lista", titulo: "Beneficios (franja bajo la portada)", clave: "home.beneficios", singular: "beneficio", genero: "o",
        campos: [{ n: "icono", l: "Icono", t: "icono", req: true }, { n: "texto", l: "Texto", t: "text", req: true, max: 80 }],
        defaults: { icono: "escudo", activo: true }, buscar: ["texto"], toggles: [T_ACTIVO],
        fila: { icono: function (i) { i = i || {}; return i.icono; }, titulo: function (i) { i = i || {}; return i.texto; } } },
      { id: "ini-pie", tipo: "form", titulo: "Textos del pie de página", clave: "home", campos: [
        { n: "descripcion_footer", l: "Descripción de la empresa", t: "textarea", req: true, max: 260 },
        { n: "mision", l: "Misión", t: "textarea", req: true, max: 400 },
        { n: "vision", l: "Visión", t: "textarea", req: true, max: 400 }
      ] }
    ] },
    { id: "servicios", label: "Servicios", titulo: "Servicios", bloques: [
      { id: "servicios", tipo: "lista", titulo: "Tarjetas de servicios (inicio)", clave: "servicios", singular: "servicio", genero: "o",
        campos: [
          { n: "titulo", l: "Nombre del servicio", t: "text", req: true, max: 80 },
          { n: "descripcion", l: "Descripción corta", t: "textarea", req: true, max: 200 },
          { n: "imagen", l: "Imagen", t: "imagen", req: true },
          { n: "enlace", l: "Enlace al hacer clic", t: "url", req: true, ayuda: "Por ejemplo ./productos.html" },
          { n: "color", l: "Color de la tarjeta", t: "select", req: true, opciones: COLORES }
        ],
        defaults: { color: "marino", enlace: "./productos.html", activo: true }, buscar: ["titulo", "descripcion"], toggles: [T_ACTIVO],
        fila: { imagen: function (i) { i = i || {}; return i.imagen; }, titulo: function (i) { i = i || {}; return i.titulo; }, sub: function (i) { i = i || {}; return i.descripcion; } } }
    ] },
    { id: "productos", label: "Productos", titulo: "Productos", bloques: [
      { id: "productos", tipo: "lista", titulo: "Catálogo de productos", clave: "productos", singular: "producto", genero: "o",
        campos: [
          { n: "nombre", l: "Nombre del producto", t: "text", req: true, max: 100 },
          { n: "categoria", l: "Categoría", t: "select", req: true, opciones: opts(OP.categoriasProducto), mitad: true },
          { n: "marca", l: "Marca", t: "select", req: true, opciones: opts(OP.marcas), mitad: true },
          { n: "imagen", l: "Imagen", t: "imagen", req: true },
          { n: "specs", l: "Características (opcional)", t: "lista", ayuda: "Una por línea. Ejemplo: 10 HP" }
        ],
        defaults: { categoria: OP.categoriasProducto[0], marca: OP.marcas[0], specs: [], destacado: false, activo: true },
        buscar: ["nombre", "marca", "categoria"],
        toggles: [{ n: "destacado", l: "Destacado" }, T_ACTIVO],
        fila: { imagen: function (i) { i = i || {}; return i.imagen; }, titulo: function (i) { i = i || {}; return i.nombre; }, sub: function (i) { i = i || {}; return i.marca + " · " + i.categoria; } } }
    ] },
    { id: "alquiler", label: "Alquiler", titulo: "Equipos de alquiler", bloques: [
      { id: "alquiler", tipo: "lista", titulo: "Equipos para alquiler", clave: "alquiler", singular: "equipo", genero: "o",
        campos: [
          { n: "nombre", l: "Nombre del equipo", t: "text", req: true, max: 100 },
          { n: "imagen", l: "Imagen", t: "imagen", req: true },
          { n: "specs", l: "Características", t: "lista", ayuda: "Una por línea. Ejemplo: Hasta 120 m³/h" }
        ],
        defaults: { specs: [], disponible: true, activo: true }, buscar: ["nombre"],
        toggles: [{ n: "disponible", l: "Disponible" }, T_ACTIVO],
        fila: { imagen: function (i) { i = i || {}; return i.imagen; }, titulo: function (i) { i = i || {}; return i.nombre; }, sub: function (i) { i = i || {}; return (i.specs || []).join(" · "); } } }
    ] },
    { id: "proyectos", label: "Proyectos", titulo: "Proyectos", bloques: [
      { id: "proyectos", tipo: "lista", titulo: "Portafolio de proyectos", clave: "proyectos", singular: "proyecto", genero: "o",
        campos: [
          { n: "titulo", l: "Nombre del proyecto", t: "text", req: true, max: 100 },
          { n: "foto", l: "Foto", t: "imagen", req: true },
          { n: "ubicacion", l: "Ubicación", t: "text", req: true, mitad: true },
          { n: "categoria", l: "Categoría", t: "select", req: true, opciones: opts(OP.categoriasProyecto), mitad: true }
        ],
        defaults: { categoria: OP.categoriasProyecto[0], ubicacion: "Perú", destacado: false, activo: true }, buscar: ["titulo", "ubicacion", "categoria"],
        toggles: [{ n: "destacado", l: "Mostrar en inicio" }, T_ACTIVO],
        fila: { imagen: function (i) { i = i || {}; return i.foto; }, titulo: function (i) { i = i || {}; return i.titulo; }, sub: function (i) { i = i || {}; return i.ubicacion + " · " + i.categoria; } } }
    ] },
    { id: "clientes", label: "Clientes", titulo: "Clientes", bloques: [
      { id: "clientes", tipo: "lista", titulo: "Logos de clientes", clave: "clientes", singular: "cliente", genero: "o",
        campos: [
          { n: "nombre", l: "Nombre de la empresa", t: "text", req: true, max: 80 },
          { n: "logo", l: "Logo", t: "imagen", req: true }
        ],
        defaults: { activo: true }, buscar: ["nombre"], toggles: [T_ACTIVO],
        fila: { imagen: function (i) { i = i || {}; return i.logo; }, titulo: function (i) { i = i || {}; return i.nombre; } } }
    ] },
    { id: "razones", label: "¿Por qué elegirnos?", titulo: "¿Por qué elegirnos?", bloques: [
      { id: "razones", tipo: "lista", titulo: "Razones para elegir a ITOSS", clave: "home.razones", singular: "razón", genero: "a",
        campos: [{ n: "icono", l: "Icono", t: "icono", req: true }, { n: "texto", l: "Texto", t: "text", req: true, max: 80 }],
        defaults: { icono: "escudo", activo: true }, buscar: ["texto"], toggles: [T_ACTIVO],
        fila: { icono: function (i) { i = i || {}; return i.icono; }, titulo: function (i) { i = i || {}; return i.texto; } } }
    ] },
    { id: "brochure", label: "Brochure", titulo: "Brochure corporativo", bloques: [
      { id: "brochure", tipo: "form", titulo: "Archivo y portada del brochure", clave: "settings", campos: [
        { n: "brochure_pdf", l: "Enlace del PDF", t: "url", req: true, ayuda: "Dirección del archivo PDF (por ejemplo ./docs/brochure-itoss.pdf o un enlace https://…)." },
        { n: "brochure_portada", l: "Imagen de portada", t: "imagen", req: true }
      ] }
    ] },
    { id: "seo", label: "SEO", titulo: "Títulos y descripciones para Google", bloques: [
      ["index", "Inicio"], ["productos", "Productos"], ["alquiler", "Alquiler"], ["proyectos", "Proyectos"]
    ].map(function (p) {
      return { id: "seo-" + p[0], tipo: "form", titulo: "Página: " + p[1], clave: "seo." + p[0], campos: [
        { n: "title", l: "Título (pestaña del navegador y Google)", t: "text", req: true, max: 70, ayuda: "Ideal: hasta 60 caracteres." },
        { n: "description", l: "Descripción (resumen en Google)", t: "textarea", req: true, max: 200, ayuda: "Ideal: entre 120 y 160 caracteres." }
      ] };
    }) }
  ];

  /* ---------- validación y conversión de formularios ---------- */
  var RE_URL = /^(https?:\/\/\S+|data:image\/\S+|[^\s:]+)$/i;
  function mensajeCampo(c, v) {
    var vacio = v == null || (typeof v === "string" && !v.trim());
    if (vacio) return c.req ? "Este campo es obligatorio." : "";
    v = String(v).trim();
    var t = c.vt || c.t;
    if (t === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Escribe un correo válido, por ejemplo nombre@empresa.pe";
    if (t === "wa" && !(/^\+?[\d\s-]+$/.test(v) && v.replace(/\D/g, "").length >= 8 && v.replace(/\D/g, "").length <= 15)) return "Escribe solo números con código de país, por ejemplo 51902752445.";
    if (t === "tel" && !(/^[\d\s()+\-]{6,25}$/.test(v) && v.replace(/\D/g, "").length >= 6)) return "Escribe un teléfono válido, por ejemplo (+511) 710 6880.";
    if (t === "ruc" && !/^\d{11}$/.test(v.replace(/\s/g, ""))) return "El RUC debe tener 11 dígitos.";
    if ((t === "url" || t === "imagen") && !RE_URL.test(v)) return "Escribe un enlace válido (https://…) o una ruta como ./img/foto.jpg";
    if (c.max && v.length > c.max) return "Máximo " + c.max + " caracteres.";
    return "";
  }
  function validar(campos, valores) {
    var errores = {};
    campos.forEach(function (c) {
      if (c.t === "toggle") return;
      var v = valores[c.n];
      if (c.t === "lista") {
        var lineas = String(v || "").split("\n").map(function (x) { return x.trim(); }).filter(Boolean);
        if (c.req && !lineas.length) errores[c.n] = "Agrega al menos una línea.";
        else for (var i = 0; i < lineas.length; i++) { var m = mensajeCampo({ t: c.vt || "text", max: 120 }, lineas[i]); if (m) { errores[c.n] = "Línea " + (i + 1) + ": " + m; break; } }
        return;
      }
      var msg = mensajeCampo(c, v);
      if (msg) errores[c.n] = msg;
    });
    return errores;
  }
  /* objeto guardado -> valores de formulario (listas como texto) */
  function aEdicion(campos, obj) {
    var v = Object.assign({}, obj);
    campos.forEach(function (c) {
      if (c.t === "lista") v[c.n] = Array.isArray(obj[c.n]) ? obj[c.n].join("\n") : "";
      else if (v[c.n] == null && c.t !== "toggle") v[c.n] = "";
    });
    return v;
  }
  /* valores de formulario -> objeto a guardar */
  function deEdicion(campos, valores) {
    var o = Object.assign({}, valores);
    campos.forEach(function (c) {
      var v = o[c.n];
      if (c.t === "lista") o[c.n] = String(v || "").split("\n").map(function (x) { return x.trim(); }).filter(Boolean);
      else if (typeof v === "string") o[c.n] = v.trim();
      if (c.t === "wa") o[c.n] = String(o[c.n]).replace(/\D/g, "");
      if (c.t === "ruc") o[c.n] = String(o[c.n]).replace(/\s/g, "");
    });
    return o;
  }
  function slug(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
  }

  /* ---------- componente Alpine ---------- */
  document.addEventListener("alpine:init", function () {
    Alpine.data("admin", function () {
      var estado = {};
      VISTAS.forEach(function (v) {
        v.bloques.forEach(function (b) { estado[b.id] = { items: [], q: "", valores: {}, errores: {}, guardando: false }; });
      });

      return {
        VISTAS: VISTAS, estado: estado,
        sesion: false, login: { email: "", clave: "", error: "" },
        vista: "dashboard", menu: false,
        toasts: [], uso: { usado: 0, limite: 1, porcentaje: 0 },
        conteos: { productos: 0, proyectos: 0, clientes: 0, alquiler: 0 },
        modal: { abierto: false, modo: "crear", bloque: null, valores: {}, errores: {}, guardando: false, id: null },
        conf: { abierto: false, titulo: "", texto: "", ok: "", peligro: true, resolver: null },
        subiendo: false,

        ic: ic,
        itossIcono: window.itossIcono,
        iconos: ICONOS,

        init: function () {
          var self = this;
          try { this.sesion = sessionStorage.getItem(SESION) === "1"; } catch (e) {}
          window.addEventListener("hashchange", function () { if (self.sesion) self.abrirVista(location.hash.slice(1), true); });
          if (this.sesion) this.abrirVista(location.hash.slice(1), true);
          Store.onChange(function () { if (self.sesion) { self.cargarListas(); self.cargarResumen(); } });
        },

        /* ----- sesión ----- */
        entrar: function () {
          var l = this.login;
          if (l.email.trim().toLowerCase() === USUARIO && l.clave === CLAVE) {
            try { sessionStorage.setItem(SESION, "1"); } catch (e) {}
            this.sesion = true; l.error = ""; l.clave = "";
            this.abrirVista(location.hash.slice(1), true);
          } else {
            l.error = "El correo o la contraseña no son correctos. Revisa los datos de acceso de la demostración.";
          }
        },
        salir: function () {
          try { sessionStorage.removeItem(SESION); } catch (e) {}
          this.sesion = false; this.menu = false;
        },

        /* ----- navegación ----- */
        get vistaActual() { var id = this.vista; return VISTAS.filter(function (v) { return v.id === id; })[0] || VISTAS[0]; },
        ir: function (id) { location.hash = id; this.menu = false; },
        abrirVista: function (id, sinHash) {
          if (!VISTAS.some(function (v) { return v.id === id; })) id = "dashboard";
          this.vista = id; this.menu = false;
          if (!sinHash) location.hash = id;
          window.scrollTo(0, 0);
          this.cargarVista();
        },
        cargarVista: function () {
          var self = this;
          this.cargarResumen();
          this.vistaActual.bloques.forEach(function (b) {
            if (b.tipo === "form") {
              Store.get(b.clave).then(function (obj) {
                var e = self.estado[b.id];
                e.valores = aEdicion(b.campos, obj || {}); e.errores = {};
              }).catch(function () { self.toast("No pudimos cargar esta sección. Recarga la página.", "error"); });
            }
          });
          this.cargarListas();
        },
        cargarListas: function () {
          var self = this;
          this.vistaActual.bloques.forEach(function (b) {
            if (b.tipo !== "lista") return;
            Store.list(b.clave).then(function (arr) { self.estado[b.id].items = arr; })
              .catch(function () { self.toast("No pudimos cargar la lista. Recarga la página.", "error"); });
          });
        },
        cargarResumen: function () {
          var self = this;
          this.uso = Store.usage();
          ["productos", "proyectos", "clientes", "alquiler"].forEach(function (k) {
            Store.list(k).then(function (a) { self.conteos[k] = a.length; }).catch(function () {});
          });
        },

        /* Accesos rápidos del dashboard: abre la sección y el formulario de alta */
        agregarRapido: function (id) {
          var self = this;
          this.abrirVista(id);
          var b = this.vistaActual.bloques.filter(function (x) { return x.tipo === "lista"; })[0];
          if (b) this.$nextTick(function () { self.nuevo(b); });
        },

        /* ----- avisos ----- */
        toast: function (texto, tipo) {
          var self = this, t = { id: Date.now() + Math.random(), texto: texto, tipo: tipo || "ok" };
          this.toasts.push(t);
          setTimeout(function () { self.toasts = self.toasts.filter(function (x) { return x.id !== t.id; }); }, tipo === "error" ? 6000 : 3500);
        },
        errorGuardar: function (e) {
          this.toast(e && e.codigo === "cuota" ? e.message : "No se pudo guardar. Inténtalo de nuevo.", "error");
        },
        confirmar: function (titulo, texto, ok, peligro) {
          var self = this;
          return new Promise(function (resolver) {
            self.conf = { abierto: true, titulo: titulo, texto: texto, ok: ok || "Aceptar", peligro: peligro !== false, resolver: resolver };
          });
        },
        responderConf: function (r) { var f = this.conf.resolver; this.conf.abierto = false; if (f) f(r); },

        /* ----- formularios de una sola pieza (configuración, portada, SEO…) ----- */
        guardarForm: function (b) {
          var self = this, e = this.estado[b.id];
          e.errores = validar(b.campos, e.valores);
          if (Object.keys(e.errores).length) { this.toast("Revisa los campos marcados en rojo.", "error"); return; }
          e.guardando = true;
          var nuevos = deEdicion(b.campos, e.valores), cambios = {};
          b.campos.forEach(function (c) { cambios[c.n] = nuevos[c.n]; });
          Store.get(b.clave).then(function (actual) {
            return Store.set(b.clave, Object.assign({}, actual || {}, cambios));
          }).then(function () {
            self.toast("Cambios guardados. Ya se ven en el sitio.");
            self.cargarResumen();
          }).catch(function (err) { self.errorGuardar(err); })
            .then(function () { e.guardando = false; });
        },

        /* ----- listas ----- */
        filtrados: function (b) {
          var q = this.estado[b.id].q.trim().toLowerCase();
          if (!q) return this.estado[b.id].items;
          return this.estado[b.id].items.filter(function (it) {
            return b.buscar.some(function (k) { return String(it[k] || "").toLowerCase().indexOf(q) >= 0; });
          });
        },
        nuevo: function (b) {
          var d = Object.assign({}, b.defaults);
          this.modal = { abierto: true, modo: "crear", bloque: b, valores: aEdicion(b.campos, d), errores: {}, guardando: false, id: null };
          this.enfocarModal();
        },
        editar: function (b, it) {
          this.modal = { abierto: true, modo: "editar", bloque: b, valores: aEdicion(b.campos, it), errores: {}, guardando: false, id: it.id };
          this.enfocarModal();
        },
        enfocarModal: function () {
          var self = this;
          this.$nextTick(function () { var el = self.$root.querySelector("#modal-campos input, #modal-campos select, #modal-campos textarea"); if (el) el.focus(); });
        },
        cerrarModal: function () { this.modal.abierto = false; },
        guardarModal: function () {
          var self = this, m = this.modal, b = m.bloque;
          m.errores = validar(b.campos, m.valores);
          if (Object.keys(m.errores).length) { this.toast("Revisa los campos marcados en rojo.", "error"); return; }
          m.guardando = true;
          var datos = deEdicion(b.campos, m.valores);
          delete datos.id; delete datos.orden;
          if (b.clave === "servicios" && !datos.ancla) datos.ancla = "srv-" + (slug(datos.titulo) || Date.now());
          var op = m.modo === "crear" ? Store.create(b.clave, datos) : Store.update(b.clave, m.id, datos);
          op.then(function () {
            self.modal.abierto = false;
            self.toast(m.modo === "crear" ? "Listo, se agregó " + (b.genero === "a" ? "la " : "el ") + b.singular + "." : "Cambios guardados.");
            self.cargarListas(); self.cargarResumen();
          }).catch(function (err) { self.errorGuardar(err); })
            .then(function () { m.guardando = false; });
        },
        eliminar: function (b, it) {
          var self = this, nombre = b.fila.titulo(it);
          this.confirmar("¿Eliminar " + (b.genero === "a" ? "esta " : "este ") + b.singular + "?",
            "Se eliminará «" + nombre + "». Esta acción no se puede deshacer.", "Sí, eliminar").then(function (ok) {
            if (!ok) return;
            Store.remove(b.clave, it.id).then(function () {
              self.toast("Se eliminó " + (b.genero === "a" ? "la " : "el ") + b.singular + ".");
              self.cargarListas(); self.cargarResumen();
            }).catch(function (err) { self.errorGuardar(err); });
          });
        },
        alternar: function (b, it, campo) {
          var self = this, cambio = {}; cambio[campo] = !it[campo];
          Store.update(b.clave, it.id, cambio).then(function () { self.cargarListas(); self.cargarResumen(); })
            .catch(function (err) { self.errorGuardar(err); });
        },
        mover: function (b, it, dir) {
          var self = this;
          Store.move(b.clave, it.id, dir).then(function () { self.cargarListas(); })
            .catch(function (err) { self.errorGuardar(err); });
        },
        esPrimero: function (b, it) { var a = this.estado[b.id].items; return a.length && a[0].id === it.id; },
        esUltimo: function (b, it) { var a = this.estado[b.id].items; return a.length && a[a.length - 1].id === it.id; },

        /* ----- imágenes ----- */
        esData: function (v) { return typeof v === "string" && v.indexOf("data:") === 0; },
        kb: function (v) { return Math.round(String(v || "").length * 0.75 / 1024); },
        subirImagen: function (ev, valores, campo) {
          var self = this, input = ev.target, f = input.files && input.files[0];
          if (!f) return;
          this.subiendo = true;
          Store.upload(f).then(function (data) {
            valores[campo] = data;
            var u = Store.usage();
            if (u.porcentaje >= 70) self.toast("Ojo: ya usas el " + u.porcentaje + "% del espacio del navegador. Prefiere enlaces (URL) o imágenes más livianas.", "aviso");
          }).catch(function (e) { self.toast(e.message || "No se pudo subir la imagen.", "error"); })
            .then(function () { self.subiendo = false; input.value = ""; });
        },
        quitarImagen: function (valores, campo) { valores[campo] = ""; },

        /* ----- datos de la demo ----- */
        exportar: function () {
          var self = this;
          Store.exportAll().then(function () { self.toast("Descargamos un .zip con todos tus datos (carpeta data/)."); })
            .catch(function () { self.toast("No se pudo exportar. Inténtalo de nuevo.", "error"); });
        },
        restablecer: function () {
          var self = this;
          this.confirmar("¿Restablecer la demostración?",
            "Se borrarán todos los cambios hechos en este navegador y el sitio volverá a su contenido original.", "Sí, restablecer").then(function (ok) {
            if (!ok) return;
            Store.reset().then(function () { self.cargarVista(); self.toast("Listo, la demostración volvió a su estado original."); });
          });
        }
      };
    });
  });
})();
