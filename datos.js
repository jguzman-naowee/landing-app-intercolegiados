/**
 * Datos del prototipo.
 *
 * Es JSON con una sola línea de JavaScript alrededor: `window.DATOS =`.
 * Va así y no como .json porque el navegador bloquea `fetch` cuando la página
 * se abre con doble clic (file://), y este archivo tiene que servir igual en
 * el escritorio, en un servidor y publicado como artifact.
 *
 * entidad  = quién firma el prototipo (hoy solo Naowee; al recibir un cliente
 *            se agrega aquí su sigla/logo).
 * roles    = perfiles del selector. Cada rol: id, rol, nombre, iniciales,
 *            organizacion, portal, theme, color, descripcion, inicio (hash).
 * menus    = { [rolId]: [{ section, id, label, icon, route }] } para los roles
 *            que usan el shell con sidebar (los fullscreen no lo necesitan).
 *
 * landing  = contenido de la landing pública de Intercolegiados (perfil Sin
 *            login). Copia del Figma «JIN Landing y App», frame 153
 *            (node 10185:14357). Las imágenes viven en assets/landing/.
 *            landing.app = lo propio de la app (Figma frame 13004:13907):
 *            portada, menú, pestañas inferiores, mosaico de la galería.
 *            `resumen` de cada noticia = TEXTO DE EJEMPLO (el Figma no lo
 *            trae): reemplazar por el resumen real de la nota.
 *
 * TODO ES DE DEMOSTRACIÓN. Ningún dato sale de un sistema real.
 */
window.DATOS = {
  "entidad": {
    "sigla": "Naowee",
    "nombre": "Naowee",
    "plataforma": "Naowee Suite",
    "fecha": "martes 17 de septiembre"
  },
  "roles": [
    {
      "id": "conductor",
      "rol": "Sin login",
      "nombre": "C. Mendoza",
      "iniciales": "CM",
      "organizacion": "Cliente demo · Camión 12",
      "portal": "App móvil",
      "theme": "primary",
      "color": "orange",
      "descripcion": "Recorre la ruta y marca cada punto.",
      "inicio": "#/conductor"
    }
  ],
  "menus": {},
  "conductorApp": {
    "ruta": {
      "codigo": "R-2406 · Sector B",
      "camion": "Camión 12",
      "zona": "Zona Norte"
    },
    "cuadrilla": [
      {
        "id": "r1",
        "nombre": "J. Ariza"
      },
      {
        "id": "r2",
        "nombre": "D. Pérez"
      }
    ],
    "jornada": {
      "desde": "06:00",
      "hasta": "14:00"
    },
    "programada": {
      "codigo": "R-2412 · Sector D",
      "unidades": 28,
      "zona": "Zona Norte",
      "cuando": "Hoy 13:30"
    },
    "completada": {
      "codigo": "R-2391 · Bahía",
      "horario": "05:40 — 08:05",
      "unidades": 36,
      "fotos": 36
    },
    "paradas": [
      {
        "dir": "Cra 45 #72-10",
        "tipo": "Residencial",
        "uid": "U-04818",
        "hora": "08:14",
        "m": 180,
        "min": 3,
        "g": "u",
        "gt": "Siga derecho por Cra 45",
        "gm": "la parada queda a la derecha"
      },
      {
        "dir": "Cra 45 #72-24",
        "tipo": "Comercial",
        "uid": "U-04819",
        "hora": "08:17",
        "m": 140,
        "min": 2,
        "g": "u",
        "gt": "Siga derecho por Cra 45",
        "gm": "costado oriental, frente al 72-24"
      },
      {
        "dir": "Cra 45 #72-38",
        "tipo": "Residencial",
        "uid": "U-04821",
        "hora": "08:23",
        "m": 210,
        "min": 4,
        "g": "u",
        "gt": "Siga derecho por Cra 45",
        "gm": "antes de llegar a Cll 76"
      },
      {
        "dir": "Cra 45 #72-52",
        "tipo": "Residencial",
        "uid": "U-04824",
        "hora": "08:29",
        "m": 160,
        "min": 3,
        "g": "r",
        "gt": "Gire a la derecha en Cll 76",
        "gm": "la parada está a 40 m del cruce"
      },
      {
        "dir": "Cll 72 #45-03",
        "tipo": "Comercial",
        "uid": "U-04831",
        "hora": "08:36",
        "m": 240,
        "min": 5,
        "g": "r",
        "gt": "Gire a la derecha en Cll 72",
        "gm": "bahía de cargue, costado sur"
      },
      {
        "dir": "Cll 72 #45-19",
        "tipo": "Residencial",
        "uid": "U-04833",
        "hora": "08:41",
        "m": 130,
        "min": 2,
        "g": "u",
        "gt": "Siga derecho por Cll 72",
        "gm": "shut del conjunto, sobre andén"
      },
      {
        "dir": "Cra 46 #72-08",
        "tipo": "Industrial",
        "uid": "U-04840",
        "hora": "08:49",
        "m": 260,
        "min": 5,
        "g": "l",
        "gt": "Gire a la izquierda en Cra 46",
        "gm": "contenedor industrial · 2 unidades"
      },
      {
        "dir": "Cra 46 #72-22",
        "tipo": "Comercial",
        "uid": "U-04842",
        "hora": "08:55",
        "m": 150,
        "min": 3,
        "g": "f",
        "gt": "Última parada de la ruta",
        "gm": "al marcarla podés cerrar la R-2406"
      }
    ],
    "causales": [
      {
        "id": "sin",
        "txt": "Sin basuras",
        "rec": false,
        "obs": "Sin residuos dispuestos en el punto al momento del paso."
      },
      {
        "id": "limpio",
        "txt": "Punto limpio",
        "rec": false,
        "obs": "Punto encontrado limpio, no requirió recolección."
      },
      {
        "id": "inacc",
        "txt": "Inaccesible",
        "rec": false,
        "obs": "Punto inaccesible: vía obstruida, el vehículo no pudo acercarse."
      },
      {
        "id": "casas",
        "txt": "Casas cerradas",
        "rec": false,
        "obs": "Predios sin residuos en fachada al momento del paso."
      },
      {
        "id": "mald",
        "txt": "Mal dispuestos",
        "rec": true,
        "obs": "Residuos fuera del contenedor / en horario no autorizado. Se recolecta y se reporta."
      },
      {
        "id": "cont",
        "txt": "Contenedor dañado",
        "rec": true,
        "obs": "Contenedor averiado. Se recolecta y se reporta para reposición."
      }
    ],
    "evidencia": {
      "hora": "08:42:11",
      "coordenada": "10.9878, −74.7889"
    },
    "historial": [
      {
        "codigo": "R-2391 · Bahía",
        "dia": "hoy",
        "horario": "05:40 — 08:05",
        "unidades": 36,
        "novedades": 0
      },
      {
        "codigo": "R-2388 · Sector B",
        "dia": "ayer",
        "horario": "06:10 — 09:02",
        "unidades": 41,
        "novedades": 2
      },
      {
        "codigo": "R-2384 · Sector D",
        "dia": "dom 15",
        "horario": "05:55 — 08:40",
        "unidades": 28,
        "novedades": 1
      },
      {
        "codigo": "R-2379 · Bahía",
        "dia": "sáb 14",
        "horario": "05:45 — 08:10",
        "unidades": 36,
        "novedades": 0
      },
      {
        "codigo": "R-2371 · Sector B",
        "dia": "vie 13",
        "horario": "06:05 — 08:58",
        "unidades": 41,
        "novedades": 3
      }
    ]
  },
  "landing": {
    "hora": "9:30",
    "hero": {
      "img": "assets/landing/hero-edicion-2026.jpg",
      "alt": "La edición 2026 de los Juegos Intercolegiados Nacionales ¡ya arranca! · Inscríbete",
      "accion": "Inscríbete"
    },
    "conoce": {
      "titulo": "Conoce más",
      "bajada": "sobre el desarrollo de los juegos",
      "accesos": [
        {
          "id": "calendario",
          "icono": "calendar",
          "titulo": "Calendario",
          "texto": "Sigue el paso de los eventos."
        },
        {
          "id": "resultados",
          "icono": "mercado-lider",
          "titulo": "Resultados y medallas",
          "texto": "Conoce a los ganadores"
        }
      ]
    },
    "novedad": {
      "img": "assets/landing/novedad-principal.jpg",
      "titulo": "Más de 1600 colombianos participaron en la consulta ciudadana que define los criterios de selección de deportes y Para deportes en los Juegos Intercolegiados",
      "fecha": "Bogotá, 24 de febrero de 2026",
      "resumen": "Desde los patios escolares de los municipios más apartados hasta los escenarios internacionales, la consulta ciudadana recogió los aportes de más de 1600 colombianos.",
      "autoria": "Autoría: Miguel Guavita, prensa Ministerio del Deporte",
      "fechaCorta": "24 feb 2026",
      "lugar": "Bogotá",
      "corto": "Más de 1600 colombianos participaron en la consulta ciudadana",
      "cuerpo": "Desde los patios escolares de los municipios más apartados hasta los escenarios internacionales, el Deporte Escolar se consolidó en 2025 como uno de los pilares estratégicos del Ministerio del Deporte para la formación integral de niñas, niños y jóvenes en Colombia. A través de dos programas bandera, la Jornada Deportiva Escolar Complementaria y los Juegos Intercolegiados, el país fortaleció no solo la práctica deportiva, sino también los procesos de inclusión, equidad, permanencia escolar y proyección del talento joven en el deporte nacional e internacional."
    },
    "noticias": [
      {
        "img": "assets/landing/noticia-1.jpg",
        "titulo": "Abierta la consulta ciudadana con el proyecto de resolución que define los criterios de selección de deportes",
        "fecha": "Bogotá, 24 de febrero de 2026",
        "resumen": "Ya puedes revisar el proyecto de resolución y dejar tus comentarios sobre los criterios de selección de deportes.",
        "fechaCorta": "24 feb 2026",
        "lugar": "Bogotá",
        "categoria": "recientes"
      },
      {
        "img": "assets/landing/noticia-2.jpg",
        "titulo": "Este 12 de marzo se abren las inscripciones para los Juegos Intercolegiados Nacionales 2026",
        "fecha": "Bogotá, 24 de febrero de 2026",
        "resumen": "Colegios de todo el país podrán inscribir a sus deportistas desde el 12 de marzo. Te contamos cómo hacerlo.",
        "fechaCorta": "24 feb 2026",
        "lugar": "Bogotá",
        "categoria": "inscripciones"
      }
    ],
    "galeria": {
      "titulo": "Galería multimedia",
      "bajada": "explora las imágenes de la competencia",
      "fotos": [
        {
          "img": "assets/landing/galeria-a.jpg",
          "pos": "38% 50%"
        },
        {
          "img": "assets/landing/galeria-b.jpg",
          "pos": "55% 50%"
        },
        {
          "img": "assets/landing/galeria-c.jpg",
          "pos": "67% 50%"
        }
      ]
    },
    "herramientas": {
      "titulo": "Nuestras herramientas",
      "piezas": [
        {
          "img": "assets/landing/herramientas-videotutoriales.jpg",
          "alt": "¿Tienes dudas sobre algún proceso? Consulta nuestros videotutoriales"
        }
      ],
      "paginas": 2
    },
    "sitio": "juegosintercolegiados.com.co",
    "redes": [
      {
        "id": "facebook",
        "nombre": "Facebook"
      },
      {
        "id": "instagram",
        "nombre": "Instagram"
      },
      {
        "id": "youtube",
        "nombre": "YouTube"
      },
      {
        "id": "xing",
        "nombre": "Xing"
      },
      {
        "id": "tiktok",
        "nombre": "TikTok"
      }
    ],
    "app": {
      "tabs": [
        {
          "id": "inicio",
          "icono": "home",
          "label": "Inicio"
        },
        {
          "id": "calendario",
          "icono": "calendar",
          "label": "Calendario"
        },
        {
          "id": "resultados",
          "icono": "mercado-lider",
          "label": "Resultados"
        }
      ],
      "cuenta": {
        "nombre": "Juegos Intercolegiados",
        "lugar": "Bogotá"
      },
      "categorias": [
        {
          "id": "recientes",
          "label": "Recientes"
        },
        {
          "id": "inscripciones",
          "label": "Inscripciones"
        },
        {
          "id": "regionales",
          "label": "Regionales"
        }
      ],
      "splash": {
        "img": "assets/landing/splash-2026.jpg",
        "alt": "Juegos Intercolegiados 2026 · Ministerio del Deporte",
        "ms": 2200
      },
      "portada": {
        "img": "assets/landing/portada-2026.jpg",
        "titular": [
          "En este 2026",
          "vamos por más"
        ],
        "alt": "Juegos Intercolegiados 2026"
      },
      "menu": [
        {
          "id": "medallas",
          "icono": "mercado-lider",
          "label": "Medallas"
        },
        {
          "id": "tutoriales",
          "icono": "play",
          "label": "Videos tutoriales"
        },
        {
          "id": "certificados",
          "icono": "file",
          "label": "Certificados"
        }
      ],
      "mosaico": [
        {
          "img": "assets/landing/galeria-a.jpg",
          "pos": "38% 30%",
          "alto": "alto"
        },
        {
          "img": "assets/landing/noticia-1.jpg",
          "pos": "50% 50%",
          "alto": "bajo"
        },
        {
          "img": "assets/landing/novedad-principal.jpg",
          "pos": "50% 50%",
          "alto": "bajo"
        },
        {
          "img": "assets/landing/galeria-b.jpg",
          "pos": "55% 30%",
          "alto": "alto"
        },
        {
          "img": "assets/landing/galeria-c.jpg",
          "pos": "67% 50%",
          "alto": "alto"
        },
        {
          "img": "assets/landing/noticia-2.jpg",
          "pos": "50% 40%",
          "alto": "bajo"
        }
      ]
    }
  }
};
