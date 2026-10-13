/* ============================================================
   CONFIGURACIÓN CENTRAL — editar aquí
   ============================================================ */
const WHATSAPP = "51902752445";      // Código de país + número, sin + ni espacios
const TELEFONO = "+5117106880";      // Teléfono fijo (topbar)
const CORREO = "comercial@itoss.pe"; // Correo comercial

function waLink(mensaje) {
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(mensaje || "Hola, quiero información");
}
window.waLink = waLink;

/* ============================================================
   DATOS EDITABLES
   Las imágenes son placeholders de Unsplash. REEMPLAZAR por fotos reales
   (colocarlas en /img y usar rutas relativas, p. ej. "./img/bomba-1.jpg").
   ============================================================ */
const img = (id, w) => "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=" + (w || 700) + "&q=70";
const FOTOS = {
  bomba: "photo-1513828583688-c52646db42da",
  planta: "photo-1504917595217-d4dc5ebe6122",
  tuberias: "photo-1513828583688-c52646db42da",
  operarios: "photo-1504917595217-d4dc5ebe6122",
  industria: "photo-1621905252507-b35492cc74b4",
  agua: "photo-1513828583688-c52646db42da",
  mina: "photo-1621905252507-b35492cc74b4",
  fabrica: "photo-1621905252507-b35492cc74b4",
  maquinaria: "photo-1530124566582-a618bc2615dc",
  obra: "photo-1504917595217-d4dc5ebe6122"
};

/* Marcas que comercializa ITOSS (se usan como etiqueta/filtro en Productos) */
const MARCAS = ["MEUDY", "Goodwin", "HCP", "OKFLOW", "NASSAR Electronics", "ITOFLOT"];

const CATEGORIAS = ["Bombas sumergibles", "Centrífugas", "Motores eléctricos", "Tableros", "Accesorios"];

/* REEMPLAZAR: productos de ejemplo — editar nombre, marca, categoría e imagen */
const PRODUCTOS = [
  { nombre: "Bomba sumergible para lodos 10 HP", marca: "MEUDY", categoria: "Bombas sumergibles", imagen: img(FOTOS.bomba) },
  { nombre: "Bomba sumergible de drenaje 5 HP", marca: "Goodwin", categoria: "Bombas sumergibles", imagen: img(FOTOS.agua) },
  { nombre: "Bomba centrífuga de alta presión", marca: "HCP", categoria: "Centrífugas", imagen: img(FOTOS.planta) },
  { nombre: "Bomba centrífuga horizontal", marca: "OKFLOW", categoria: "Centrífugas", imagen: img(FOTOS.industria) },
  { nombre: "Motor eléctrico trifásico 15 HP", marca: "NASSAR Electronics", categoria: "Motores eléctricos", imagen: img(FOTOS.fabrica) },
  { nombre: "Motor eléctrico sumergible", marca: "Goodwin", categoria: "Motores eléctricos", imagen: img(FOTOS.maquinaria) },
  { nombre: "Tablero de control y arranque", marca: "NASSAR Electronics", categoria: "Tableros", imagen: img(FOTOS.fabrica) },
  { nombre: "Tablero de protección para bombas", marca: "HCP", categoria: "Tableros", imagen: img(FOTOS.industria) },
  { nombre: "Flotadores para tuberías", marca: "ITOFLOT", categoria: "Accesorios", imagen: img(FOTOS.tuberias) },
  { nombre: "Kit de mangueras y acoples", marca: "OKFLOW", categoria: "Accesorios", imagen: img(FOTOS.tuberias) },
  { nombre: "Válvulas y accesorios de descarga", marca: "MEUDY", categoria: "Accesorios", imagen: img(FOTOS.obra) },
  { nombre: "Pasarela flotante modular", marca: "ITOFLOT", categoria: "Accesorios", imagen: img(FOTOS.agua) }
];

/* REEMPLAZAR: equipos de alquiler de ejemplo */
const ALQUILER = [
  { nombre: "Bomba sumergible para lodos", specs: ["10 HP", "Hasta 120 m³/h", "Trifásica 440 V"], imagen: img(FOTOS.bomba) },
  { nombre: "Bomba centrífuga autocebante", specs: ["Motor diésel", "Hasta 200 m³/h", "Descarga 6\""], imagen: img(FOTOS.planta) },
  { nombre: "Sistema de dragado portátil", specs: ["Para pozas y lagunas", "Operación continua", "Con operador"], imagen: img(FOTOS.mina) },
  { nombre: "Barcaza de servicio", specs: ["Plataforma modular", "Capacidad a medida", "Transportable"], imagen: img(FOTOS.agua) },
  { nombre: "Pasarela y flotadores", specs: ["Módulos ITOFLOT", "Ensamble rápido", "Alta resistencia"], imagen: img(FOTOS.tuberias) },
  { nombre: "Generador y tablero de fuerza", specs: ["Hasta 150 kVA", "Insonoro", "Arranque automático"], imagen: img(FOTOS.maquinaria) }
];

/* Proyectos destacados. REEMPLAZAR UBICACIÓN y fotos reales */
const PROYECTOS = [
  { nombre: "Sistema flotante ITOFLOT", categoria: "Industria", ubicacion: "Perú", imagen: img(FOTOS.agua, 800) },
  { nombre: "Dragado y limpieza de pozas", categoria: "Minería", ubicacion: "Perú", imagen: img(FOTOS.mina, 800) },
  { nombre: "Instalación de sistema de bombeo", categoria: "Industria", ubicacion: "Perú", imagen: img(FOTOS.planta, 800) }
];

/* ============================================================
   LÓGICA
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = waLink(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-tel]").forEach(function (a) { a.href = "tel:" + TELEFONO; });
  document.querySelectorAll("[data-mail]").forEach(function (a) { a.href = "mailto:" + CORREO; });
});

document.addEventListener("alpine:init", function () {
  /* Carrusel con flechas; el swipe táctil lo da el scroll-snap nativo */
  var carrusel = {
    paso: function () {
      var c = this.$refs.pista.firstElementChild;
      return c ? c.getBoundingClientRect().width + 16 : 300;
    },
    anterior: function () { this.$refs.pista.scrollBy({ left: -this.paso(), behavior: "smooth" }); },
    siguiente: function () { this.$refs.pista.scrollBy({ left: this.paso(), behavior: "smooth" }); }
  };

  Alpine.data("proyectos", function () { return Object.assign({ items: PROYECTOS }, carrusel); });
  Alpine.data("alquiler", function () { return { items: ALQUILER }; });

  Alpine.data("productos", function () {
    return {
      categorias: CATEGORIAS,
      marcas: MARCAS,
      items: PRODUCTOS,
      categoria: "Todas",
      marca: "",
      filtrados: function () {
        var self = this;
        return this.items.filter(function (p) {
          return (self.categoria === "Todas" || p.categoria === self.categoria) &&
                 (!self.marca || p.marca === self.marca);
        });
      }
    };
  });
});
