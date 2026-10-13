/* ============================================================
   CAPA DE DATOS — ITOSS
   Todo el sitio y el panel leen/escriben contenido SOLO a través de `Store`.
   Interfaz (todas async): get, set, list, create, update, remove, move, upload.
   Implementación DEMO: localStorage ("itoss_<archivo>") con respaldo en ./data/*.json.
   Para migrar a una API REST o Supabase, reemplaza el bloque "ALMACENAMIENTO"
   (loadRoot / saveRoot) manteniendo la misma interfaz pública. Ver README.
   ============================================================ */
(function (global) {
  "use strict";

  var PREFIX = "itoss_";
  var BASE = "./data/";
  var ARCHIVOS = ["settings", "home", "servicios", "productos", "alquiler", "proyectos", "clientes", "seo"];
  var LIMITE = 5 * 1024 * 1024; // ~5 MB que ofrece localStorage

  var OPCIONES = {
    marcas: ["MEUDY", "Goodwin", "HCP", "OKFLOW", "NASSAR Electronics", "ITOFLOT"],
    categoriasProducto: ["Bombas sumergibles", "Centrífugas", "Motores eléctricos", "Tableros", "Accesorios"],
    categoriasProyecto: ["Industria", "Minería"]
  };

  var mem = {};      // caché en memoria: archivo -> contenido
  var lsDisponible = true;

  /* ---------- utilidades ---------- */
  function clonar(v) { return v === undefined ? v : JSON.parse(JSON.stringify(v)); }
  function uuid() {
    if (global.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === "x" ? r : (r & 3 | 8)).toString(16);
    });
  }
  function error(mensaje, codigo) { var e = new Error(mensaje); e.codigo = codigo; return e; }

  /* ---------- ALMACENAMIENTO (reemplazable por API / Supabase) ---------- */
  function lsGet(archivo) {
    try {
      var v = localStorage.getItem(PREFIX + archivo);
      return v == null ? null : JSON.parse(v);
    } catch (e) { lsDisponible = false; return null; }
  }
  function lsSet(archivo, valor) {
    try { localStorage.setItem(PREFIX + archivo, JSON.stringify(valor)); }
    catch (e) {
      if (e && (e.name === "QuotaExceededError" || e.code === 22 || e.code === 1014)) {
        throw error("No hay más espacio en el navegador. Usa imágenes más livianas o elimina algunas.", "cuota");
      }
      lsDisponible = false; // modo privado / bloqueado: sigue funcionando solo en memoria
    }
  }

  function loadRoot(archivo) {
    if (mem[archivo] !== undefined) return Promise.resolve(mem[archivo]);
    var local = lsGet(archivo);
    if (local !== null) { mem[archivo] = local; return Promise.resolve(local); }
    return fetch(BASE + archivo + ".json?v=" + Date.now()).then(function (r) {
      if (!r.ok) throw error("No se pudo cargar " + archivo, "red");
      return r.json();
    }).then(function (json) {
      if (mem[archivo] === undefined) mem[archivo] = json;
      return mem[archivo];
    });
  }
  function saveRoot(archivo, valor) {
    mem[archivo] = valor;
    lsSet(archivo, valor);
    avisar(archivo);
    return Promise.resolve();
  }
  /* --------------------------------------------------------------- */

  function avisar(archivo) {
    // Otras pestañas reciben el evento nativo 'storage'; esta pestaña recibe uno propio.
    try { global.dispatchEvent(new CustomEvent("itoss:change", { detail: { archivo: archivo } })); } catch (e) {}
  }

  /* "home.razones" -> { archivo: "home", ruta: ["razones"] } */
  function partir(clave) {
    var p = String(clave).split(".");
    return { archivo: p[0], ruta: p.slice(1) };
  }
  function navegar(obj, ruta) {
    for (var i = 0; i < ruta.length; i++) {
      if (obj == null) return undefined;
      obj = obj[ruta[i]];
    }
    return obj;
  }
  function asignar(obj, ruta, valor) {
    for (var i = 0; i < ruta.length - 1; i++) {
      if (obj[ruta[i]] == null || typeof obj[ruta[i]] !== "object") obj[ruta[i]] = {};
      obj = obj[ruta[i]];
    }
    obj[ruta[ruta.length - 1]] = valor;
  }
  function ordenar(arr) {
    return arr.slice().sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); });
  }
  function renumerar(arr) { ordenar(arr).forEach(function (it, i) { it.orden = i + 1; }); }

  /* Obtiene el arreglo editable (en memoria) de una colección */
  function coleccion(clave) {
    var k = partir(clave);
    return loadRoot(k.archivo).then(function (root) {
      var arr = k.ruta.length ? navegar(root, k.ruta) : root;
      if (!Array.isArray(arr)) throw error("'" + clave + "' no es una lista", "tipo");
      return { root: root, arr: arr, archivo: k.archivo };
    });
  }

  var Store = {
    OPCIONES: OPCIONES,
    ARCHIVOS: ARCHIVOS,

    /** Valor completo de un archivo o de una ruta ("settings", "home.hero", "seo.index.title") */
    get: function (clave) {
      var k = partir(clave);
      return loadRoot(k.archivo).then(function (root) { return clonar(navegar(root, k.ruta)); });
    },

    /** Reemplaza el valor de un archivo o ruta */
    set: function (clave, valor) {
      var k = partir(clave);
      return loadRoot(k.archivo).then(function (root) {
        var copia = clonar(root);
        if (k.ruta.length) asignar(copia, k.ruta, clonar(valor)); else copia = clonar(valor);
        return saveRoot(k.archivo, copia);
      });
    },

    /** Lista ordenada por `orden`. opciones: { activos: true } filtra activo !== false */
    list: function (clave, opciones) {
      return coleccion(clave).then(function (c) {
        var out = ordenar(c.arr);
        if (opciones && opciones.activos) out = out.filter(function (x) { return x.activo !== false; });
        return clonar(out);
      });
    },

    create: function (clave, item) {
      return coleccion(clave).then(function (c) {
        var copia = clonar(c.root);
        var arr = c.archivo === clave ? copia : navegar(copia, partir(clave).ruta);
        var max = arr.reduce(function (m, x) { return Math.max(m, x.orden || 0); }, 0);
        var nuevo = Object.assign({}, clonar(item), { id: uuid(), orden: max + 1 });
        arr.push(nuevo);
        return saveRoot(c.archivo, copia).then(function () { return clonar(nuevo); });
      });
    },

    update: function (clave, id, cambios) {
      return coleccion(clave).then(function (c) {
        var copia = clonar(c.root);
        var arr = c.archivo === clave ? copia : navegar(copia, partir(clave).ruta);
        var it = arr.filter(function (x) { return x.id === id; })[0];
        if (!it) throw error("No se encontró el elemento", "noexiste");
        Object.assign(it, clonar(cambios), { id: id });
        return saveRoot(c.archivo, copia).then(function () { return clonar(it); });
      });
    },

    remove: function (clave, id) {
      return coleccion(clave).then(function (c) {
        var copia = clonar(c.root);
        var arr = c.archivo === clave ? copia : navegar(copia, partir(clave).ruta);
        var i = arr.findIndex(function (x) { return x.id === id; });
        if (i < 0) throw error("No se encontró el elemento", "noexiste");
        arr.splice(i, 1);
        renumerar(arr);
        return saveRoot(c.archivo, copia);
      });
    },

    /** Sube (-1) o baja (+1) un elemento en el orden */
    move: function (clave, id, direccion) {
      return coleccion(clave).then(function (c) {
        var copia = clonar(c.root);
        var arr = c.archivo === clave ? copia : navegar(copia, partir(clave).ruta);
        renumerar(arr);
        var ord = ordenar(arr);
        var i = ord.findIndex(function (x) { return x.id === id; });
        var j = i + direccion;
        if (i < 0 || j < 0 || j >= ord.length) return Promise.resolve();
        var t = ord[i].orden; ord[i].orden = ord[j].orden; ord[j].orden = t;
        return saveRoot(c.archivo, copia);
      });
    },

    /** Comprime una imagen (máx. 1200 px, calidad 0.7) y devuelve un data URL base64 */
    upload: function (archivo) {
      return new Promise(function (resolve, reject) {
        if (!archivo || !/^image\//.test(archivo.type)) return reject(error("Elige un archivo de imagen (JPG, PNG, WebP o SVG).", "tipo"));
        if (archivo.size > 10 * 1024 * 1024) return reject(error("La imagen pesa más de 10 MB. Elige una más liviana.", "tamano"));
        var lector = new FileReader();
        lector.onerror = function () { reject(error("No se pudo leer la imagen.", "lectura")); };
        lector.onload = function () {
          if (archivo.type === "image/svg+xml") return resolve(lector.result);
          var im = new Image();
          im.onerror = function () { reject(error("La imagen está dañada o no es compatible.", "imagen")); };
          im.onload = function () {
            var max = 1200, esc = Math.min(1, max / Math.max(im.width, im.height));
            var cv = document.createElement("canvas");
            cv.width = Math.round(im.width * esc); cv.height = Math.round(im.height * esc);
            var cx = cv.getContext("2d");
            var png = archivo.type === "image/png" || archivo.type === "image/webp";
            if (!png) { cx.fillStyle = "#fff"; cx.fillRect(0, 0, cv.width, cv.height); }
            cx.drawImage(im, 0, 0, cv.width, cv.height);
            resolve(cv.toDataURL(png ? "image/webp" : "image/jpeg", 0.7));
          };
          im.src = lector.result;
        };
        lector.readAsDataURL(archivo);
      });
    },

    /** Borra todo lo guardado en este navegador: el sitio vuelve a leer ./data/*.json */
    reset: function () {
      try {
        Object.keys(localStorage).filter(function (k) { return k.indexOf(PREFIX) === 0; })
          .forEach(function (k) { localStorage.removeItem(k); });
      } catch (e) {}
      mem = {};
      avisar("*");
      return Promise.resolve();
    },

    /** Datos actuales de todos los archivos: { settings: {...}, productos: [...], ... } */
    snapshot: function () {
      return Promise.all(ARCHIVOS.map(function (a) { return loadRoot(a); })).then(function (vals) {
        var o = {}; ARCHIVOS.forEach(function (a, i) { o[a] = clonar(vals[i]); }); return o;
      });
    },

    /** Descarga un .zip con data/*.json listos para copiar al repositorio */
    exportAll: function () {
      return Store.snapshot().then(function (datos) {
        var enc = new TextEncoder();
        var archivos = ARCHIVOS.map(function (a) {
          return { nombre: "data/" + a + ".json", bytes: enc.encode(JSON.stringify(datos[a], null, 2) + "\n") };
        });
        var f = new Date(), pad = function (n) { return String(n).padStart(2, "0"); };
        descargar(zip(archivos), "itoss-datos-" + f.getFullYear() + pad(f.getMonth() + 1) + pad(f.getDate()) + ".zip");
      });
    },

    /** Uso del almacenamiento del navegador (en caracteres ≈ bytes) */
    usage: function () {
      var total = 0;
      try {
        Object.keys(localStorage).forEach(function (k) {
          if (k.indexOf(PREFIX) === 0) total += k.length + (localStorage.getItem(k) || "").length;
        });
      } catch (e) {}
      return { usado: total, limite: LIMITE, porcentaje: Math.min(100, Math.round(total / LIMITE * 100)) };
    },

    /** Ejecuta cb cuando cambian los datos (esta pestaña u otra) */
    onChange: function (cb) {
      var t;
      function disparar(archivo) {
        if (archivo && archivo !== "*") delete mem[archivo]; else mem = {};
        clearTimeout(t); t = setTimeout(cb, 80);
      }
      global.addEventListener("storage", function (e) {
        if (e.key === null) return disparar("*");
        if (e.key.indexOf(PREFIX) === 0) disparar(e.key.slice(PREFIX.length));
      });
      // Los cambios de esta misma pestaña ya están en memoria: solo se notifica
      global.addEventListener("itoss:change", function () { clearTimeout(t); t = setTimeout(cb, 80); });
    },

    guardadoLocal: function () { return lsDisponible; }
  };

  /* ---------- descarga y ZIP mínimo (sin compresión) ---------- */
  function descargar(blob, nombre) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = nombre;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }
  var TABLA_CRC = (function () {
    var t = [], c, n, k;
    for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    return t;
  })();
  function crc32(b) { var c = 0xFFFFFFFF; for (var i = 0; i < b.length; i++) c = TABLA_CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function zip(archivos) {
    var enc = new TextEncoder(), partes = [], central = [], offset = 0;
    var d = new Date();
    var hora = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
    var fecha = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    archivos.forEach(function (f) {
      var nombre = enc.encode(f.nombre), crc = crc32(f.bytes);
      var h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true);
      h.setUint16(8, 0, true); h.setUint16(10, hora, true); h.setUint16(12, fecha, true);
      h.setUint32(14, crc, true); h.setUint32(18, f.bytes.length, true); h.setUint32(22, f.bytes.length, true);
      h.setUint16(26, nombre.length, true); h.setUint16(28, 0, true);
      partes.push(h.buffer, nombre, f.bytes);
      var c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true);
      c.setUint16(10, 0, true); c.setUint16(12, hora, true); c.setUint16(14, fecha, true);
      c.setUint32(16, crc, true); c.setUint32(20, f.bytes.length, true); c.setUint32(24, f.bytes.length, true);
      c.setUint16(28, nombre.length, true); c.setUint32(42, offset, true);
      central.push(c.buffer, nombre);
      offset += 30 + nombre.length + f.bytes.length;
    });
    var tamCentral = central.reduce(function (s, p) { return s + (p.byteLength || p.length); }, 0);
    var fin = new DataView(new ArrayBuffer(22));
    fin.setUint32(0, 0x06054b50, true); fin.setUint16(8, archivos.length, true); fin.setUint16(10, archivos.length, true);
    fin.setUint32(12, tamCentral, true); fin.setUint32(16, offset, true);
    return new Blob(partes.concat(central, [fin.buffer]), { type: "application/zip" });
  }

  global.Store = Store;
})(window);
