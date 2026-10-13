/* Iconos disponibles para beneficios y "¿Por qué elegirnos?" (trazos tipo Lucide, viewBox 24x24).
   Se usa en el sitio público y en el panel. Para agregar uno: nueva clave con etiqueta y trazo. */
window.ITOSS_ICONOS = {
  escudo:      { label: "Escudo / calidad",       d: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>' },
  ajustes:     { label: "A medida / ajustes",      d: '<path d="M4 6h10M18 6h2M4 12h3M11 12h9M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>' },
  soporte:     { label: "Soporte técnico",         d: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1"/><rect x="17" y="14" width="4" height="6" rx="1"/><path d="M19 20c0 1.5-1 2-3 2h-2"/>' },
  herramienta: { label: "Herramienta / reparación", d: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>' },
  maletin:     { label: "Experiencia",             d: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>' },
  capas:       { label: "Soluciones integrales",   d: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>' },
  equipo:      { label: "Equipo / acompañamiento", d: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14a5 5 0 0 1 4 5"/>' },
  lupa:        { label: "Diagnóstico",             d: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>' },
  engranaje:   { label: "Motor / mecánica",        d: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>' },
  gota:        { label: "Agua / bombeo",           d: '<path d="M12 2.7c-4 4.6-6 7.7-6 10.3a6 6 0 0 0 12 0c0-2.6-2-5.7-6-10.3z"/>' },
  camion:      { label: "Entrega / logística",     d: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>' },
  reloj:       { label: "Rapidez / 24 horas",      d: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' },
  estrella:    { label: "Calidad / estrella",      d: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>' },
  rayo:        { label: "Energía",                 d: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>' }
};

/* Devuelve el <svg> completo de un icono (o el de escudo si no existe) */
window.itossIcono = function (nombre, clase) {
  var i = window.ITOSS_ICONOS[nombre] || window.ITOSS_ICONOS.escudo;
  return '<svg class="' + (clase || "w-6 h-6") + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + i.d + "</svg>";
};
