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
 * roles    = perfil único de la demo (App JIN). Cada rol: id, rol, nombre, iniciales,
 *            organizacion, portal, theme, color, descripcion, inicio (hash).
 * menus    = { [rolId]: [{ section, id, label, icon, route }] } para los roles
 *            que usan el shell con sidebar (los fullscreen no lo necesitan).
 *
 * landing  = contenido de la landing pública de Intercolegiados (App JIN). Copia del Figma «JIN Landing y App», frame 153
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
      "id": "jin",
      "rol": "App JIN",
      "nombre": "Visitante",
      "iniciales": "JIN",
      "organizacion": "Juegos Intercolegiados",
      "portal": "App móvil",
      "theme": "primary",
      "color": "orange",
      "descripcion": "App de Juegos Intercolegiados.",
      "inicio": "#/"
    }
  ],
  "menus": {},
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
      "corto": "Más de 1600 colombianos opinaron en la consulta",
      "cuerpo": "Desde los patios escolares de los municipios más apartados hasta los escenarios internacionales, el Deporte Escolar se consolidó en 2025 como uno de los pilares estratégicos del Ministerio del Deporte para la formación integral de niñas, niños y jóvenes en Colombia. A través de dos programas bandera, la Jornada Deportiva Escolar Complementaria y los Juegos Intercolegiados, el país fortaleció no solo la práctica deportiva, sino también los procesos de inclusión, equidad, permanencia escolar y proyección del talento joven en el deporte nacional e internacional."
    },
    "noticias": [
      {
        "img": "assets/landing/noticia-1.jpg",
        "titulo": "Abierta la consulta ciudadana con el proyecto de resolución que define los criterios de selección de deportes",
        "corto": "Abierta la consulta sobre selección de deportes",
        "fecha": "Bogotá, 24 de febrero de 2026",
        "resumen": "Ya puedes revisar el proyecto de resolución y dejar tus comentarios sobre los criterios de selección de deportes.",
        "fechaCorta": "24 feb 2026",
        "lugar": "Bogotá",
        "categoria": "recientes"
      },
      {
        "img": "assets/landing/noticia-2.jpg",
        "titulo": "Este 12 de marzo se abren las inscripciones para los Juegos Intercolegiados Nacionales 2026",
        "corto": "Inscripciones a los Juegos abren el 12 de marzo",
        "fecha": "Bogotá, 24 de febrero de 2026",
        "resumen": "Colegios de todo el país podrán inscribir a sus deportistas desde el 12 de marzo. Te contamos cómo hacerlo.",
        "fechaCorta": "24 feb 2026",
        "lugar": "Bogotá",
        "categoria": "inscripciones"
      }
    ],
    /* ciudad: TEXTO DE EJEMPLO salvo Florencia (camiseta Caquetá); confirmar con Mindeporte */
    "galeria": {
      "titulo": "Galería multimedia",
      "bajada": "explora las imágenes de la competencia",
      "fotos": [
        {
          "img": "assets/landing/galeria-a.jpg",
          "ciudad": "Florencia",
          "pos": "38% 50%"
        },
        {
          "img": "assets/landing/galeria-b.jpg",
          "ciudad": "Bogotá",
          "pos": "55% 50%"
        },
        {
          "img": "assets/landing/galeria-c.jpg",
          "ciudad": "Cali",
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
      "salidas": false,
      "flujos": {
        "_ejemplo": "Todos los nombres, sedes, instituciones, marcas y resultados son ficticios. Estado congelado de ejemplo; no es información oficial.",
        "aviso": "Datos de ejemplo · Sin actualización en vivo",
        "ilustracionVacio": "assets/landing/sin-contenido.jpg",
        "regionalTabs": ["Calendario", "Sedes", "Info. logística"],
        "deportes": ["Baloncesto", "Atletismo"],
        "categorias": ["Juvenil · Femenino", "Juvenil · Masculino"],
        "dias": ["2026-10-26", "2026-10-27"],
        "sedes": [
          {"nombre": "Unidad deportiva Brisa Clara", "departamento": "Valle de los Vientos", "municipio": "Villa Aurora", "direccion": "Sector deportivo de Villa Aurora · ubicación de ejemplo", "zonas": ["Cancha múltiple", "Graderías", "Vestidores"], "img": "assets/landing/galeria-b.jpg"},
          {"nombre": "Pista Horizonte", "departamento": "Valle de los Vientos", "municipio": "Villa Aurora", "direccion": "Parque del Horizonte · ubicación de ejemplo", "zonas": ["Pista", "Zona de calentamiento"], "img": "assets/landing/galeria-c.jpg"}
        ],
        "competencias": [
          {"id": "baloncesto", "deporte": "Baloncesto", "prueba": "Baloncesto 5 × 5", "categoria": "Juvenil · Femenino", "tipo": "equipo", "dias": ["2026-10-26", "2026-10-27"], "hora": "9:00 a. m.", "estado": "Finalizado", "sede": 0, "rondas": ["Fase de grupos"], "grupos": ["Grupo A", "Grupo B"]},
          {"id": "atletismo", "deporte": "Atletismo", "prueba": "Combinada escolar", "categoria": "Juvenil · Masculino", "tipo": "individual", "dias": ["2026-10-26", "2026-10-27"], "hora": "10:00 a. m.", "estado": "Finalizado", "sede": 1, "rondas": ["Final"], "subpruebas": ["80 metros", "Salto largo"]},
          {"id": "futbol-salon", "deporte": "Fútbol de salón", "prueba": "Campeonato de Fútbol de Salón", "categoria": "Juvenil · Mujer", "tipo": "equipo", "dias": ["2026-10-26", "2026-10-27"], "hora": "7:00 a. m.", "estado": "En curso", "sede": 0, "sedes": [0, 1], "rondas": ["Grupo A - Fecha 3"], "enCursoRondas": ["Grupo A - Fecha 3"], "grupos": ["Grupo A", "Grupo B"]}
        ],
        "equipos": [
          {"nombre": "Instituto Brisa Clara", "departamento": "Valle de los Vientos", "grupo": "Grupo A", "pj": 2, "pg": 2, "pp": 0, "pf": 88, "pc": 70, "puntos": 4},
          {"nombre": "Colegio Sendero Azul", "departamento": "Sierra del Alba", "grupo": "Grupo A", "pj": 2, "pg": 1, "pp": 1, "pf": 76, "pc": 78, "puntos": 3},
          {"nombre": "Liceo Horizonte Nuevo", "departamento": "Llanura del Sol", "grupo": "Grupo B", "pj": 2, "pg": 2, "pp": 0, "pf": 92, "pc": 80, "puntos": 4},
          {"nombre": "Instituto Nube Dorada", "departamento": "Sierra del Alba", "grupo": "Grupo B", "pj": 2, "pg": 1, "pp": 1, "pf": 80, "pc": 84, "puntos": 3}
        ],
        "deportistas": [
          {"nombre": "Elian Brisaclara", "institucion": "Instituto Brisa Clara", "departamento": "Valle de los Vientos", "municipio": "Villa Aurora", "categoria": "Juvenil · Masculino", "deporte": "Atletismo", "numero": 101, "marcas": ["10,80 s", "5,35 m"], "total": "820", "medallas": [1, 1, 0]},
          {"nombre": "Nicolás Senderoluz", "institucion": "Colegio Sendero Azul", "departamento": "Sierra del Alba", "municipio": "Villa Aurora", "categoria": "Juvenil · Masculino", "deporte": "Atletismo", "numero": 102, "marcas": ["11,10 s", "5,12 m"], "total": "780", "medallas": [0, 1, 1]},
          {"nombre": "Darío Nubecalma", "institucion": "Liceo Horizonte Nuevo", "departamento": "Llanura del Sol", "municipio": "Villa Aurora", "categoria": "Juvenil · Masculino", "deporte": "Atletismo", "numero": 103, "marcas": ["11,30 s", "5,02 m"], "total": "740", "medallas": [0, 0, 1]},
          {"nombre": "Lía Claraviento", "institucion": "Instituto Brisa Clara", "departamento": "Valle de los Vientos", "municipio": "Villa Aurora", "categoria": "Juvenil · Femenino", "deporte": "Baloncesto", "numero": 7},
          {"nombre": "Alina Solsendero", "institucion": "Colegio Sendero Azul", "departamento": "Sierra del Alba", "municipio": "Villa Aurora", "categoria": "Juvenil · Femenino", "deporte": "Baloncesto", "numero": 12}
        ],
        "partido": {"ronda": "Fase de grupos", "fecha": "26 oct 2026", "hora": "9:00 a. m.", "estado": "Finalizado", "equipos": [0, 1], "marcador": [48, 42], "parciales": [[12, 10], [10, 12], [14, 8], [12, 12]], "nominas": [[3], [4]]},
        "logistica": {"texto": "Si eres familiar o entrenador, ¡encuentra aquí la información que necesitas sobre pólizas y demás, durante el desarrollo de estos juegos!", "documentos": ["Instructivo de pólizas · ejemplo"]}
      },
      "quote": {
        "texto": "“Juegos Intercolegiados es una iniciativa del Ministerio del Deporte de Colombia.”"
      },
      "footer": {
        "legal1": "© 2026 Ministerio del Deporte.",
        "legal2": "Todos los derechos reservados."
      },
      /* DC-088: VALOR DE EJEMPLO, no hay número de versión oficial; confirmar con Mindeporte. */
      "version": "App JIN · v1.0.0 · prototipo",
      "tabs": [
        {
          "id": "inicio",
          "icono": "home",
          "label": "Juegos"
        },
        {
          "id": "medallas",
          "icono": "mercado-lider",
          "label": "Medallas",
          "toast": {
            "_ejemplo": "TEXTO DE EJEMPLO: fecha tomada del calendario de ejemplo (inicio de la fase nacional)",
            "titulo": "Medallería disponible en la fase nacional",
            "desde": "Disponible desde el 26 de octubre de 2026"
          }
        },
        {
          "id": "certificados",
          "icono": "file",
          "label": "Certificados",
          "toast": {
            "_ejemplo": "TEXTO DE EJEMPLO: fecha tomada del calendario de ejemplo (ceremonia de clausura)",
            "titulo": "Disponible próximamente",
            "desde": ""
          }
        }
      ],
      "calendario": {
        "_ejemplo": "TEXTO DE EJEMPLO: eventos de demostración, no el calendario oficial",
        "titulo": "Calendario",
        "hoy": "2026-09-30",
        "meses": [
          "2026-09",
          "2026-10"
        ],
        "diasSemana": [
          "L",
          "M",
          "M",
          "J",
          "V",
          "S",
          "D"
        ],
        "vacio": "No hay eventos este día.",
        "agregar": "Agregar a mi calendario",
        "eventos": [
          {
            "id": "ev01",
            "fecha": "2026-09-02",
            "hora": "8:00 a. m.",
            "titulo": "Cierre de inscripciones institucionales",
            "lugar": "Plataforma de inscripciones",
            "tipo": "Inscripciones",
            "detalle": "Último día para que las instituciones educativas completen el registro de sus deportistas y delegados."
          },
          {
            "id": "ev02",
            "fecha": "2026-09-08",
            "hora": "8:00 a. m.",
            "titulo": "Fase municipal · Atletismo",
            "lugar": "Unidad deportiva, Bogotá",
            "tipo": "Fase municipal",
            "detalle": "Pruebas de pista y campo de la fase municipal. Llega con tu carné y documento de identidad."
          },
          {
            "id": "ev03",
            "fecha": "2026-09-12",
            "hora": "9:00 a. m.",
            "titulo": "Fase municipal · Baloncesto",
            "lugar": "Coliseo cubierto, Medellín",
            "tipo": "Fase municipal",
            "detalle": "Partidos de la fase municipal en las categorías convocadas."
          },
          {
            "id": "ev04",
            "fecha": "2026-09-15",
            "hora": "3:00 p. m.",
            "titulo": "Sorteo de grupos de la fase departamental",
            "lugar": "Transmisión en línea",
            "tipo": "Organización",
            "detalle": "Se definen los grupos y los cruces de la fase departamental."
          },
          {
            "id": "ev05",
            "fecha": "2026-09-19",
            "hora": "8:30 a. m.",
            "titulo": "Fase municipal · Voleibol",
            "lugar": "Polideportivo, Cali",
            "tipo": "Fase municipal",
            "detalle": "Jornada de voleibol de la fase municipal."
          },
          {
            "id": "ev06",
            "fecha": "2026-09-24",
            "hora": "4:00 p. m.",
            "titulo": "Reunión técnica de delegados",
            "lugar": "Sala virtual",
            "tipo": "Organización",
            "detalle": "Se explican reglamento, horarios y sedes de la fase departamental."
          },
          {
            "id": "ev07",
            "fecha": "2026-09-30",
            "hora": "8:00 a. m.",
            "titulo": "Verificación de carnés deportivos",
            "lugar": "Sede de la liga, Barranquilla",
            "tipo": "Inscripciones",
            "detalle": "Revisión de carnés y documentos antes de la fase departamental."
          },
          {
            "id": "ev08",
            "fecha": "2026-09-30",
            "hora": "2:00 p. m.",
            "titulo": "Fase departamental · Fútbol de salón",
            "lugar": "Coliseo departamental, Medellín",
            "tipo": "Fase departamental",
            "detalle": "Primera jornada de fútbol de salón de la fase departamental."
          },
          {
            "id": "ev09",
            "fecha": "2026-10-03",
            "hora": "9:00 a. m.",
            "titulo": "Fase departamental · Natación",
            "lugar": "Complejo acuático, Cali",
            "tipo": "Fase departamental",
            "detalle": "Competencias de natación de la fase departamental."
          },
          {
            "id": "ev10",
            "fecha": "2026-10-10",
            "hora": "10:00 a. m.",
            "titulo": "Fase departamental · Tenis de mesa",
            "lugar": "Coliseo de la liga, Barranquilla",
            "tipo": "Fase departamental",
            "detalle": "Jornada de tenis de mesa de la fase departamental."
          },
          {
            "id": "ev11",
            "fecha": "2026-10-14",
            "hora": "5:00 p. m.",
            "titulo": "Cierre de la fase departamental",
            "lugar": "Sedes departamentales",
            "tipo": "Fase departamental",
            "detalle": "Se cierra la fase departamental y se consolidan los resultados."
          },
          {
            "id": "ev12",
            "fecha": "2026-10-17",
            "hora": "10:00 a. m.",
            "titulo": "Publicación de clasificados a la fase nacional",
            "lugar": "Plataforma de resultados",
            "tipo": "Organización",
            "detalle": "Se publica el listado de equipos y deportistas clasificados."
          },
          {
            "id": "ev13",
            "fecha": "2026-10-24",
            "hora": "6:00 p. m.",
            "titulo": "Ceremonia de inauguración de la fase nacional",
            "lugar": "Bogotá",
            "tipo": "Ceremonia",
            "detalle": "Acto de apertura de la fase nacional de Juegos Intercolegiados."
          },
          {
            "id": "ev14",
            "fecha": "2026-10-26",
            "hora": "8:00 a. m.",
            "titulo": "Fase nacional · Atletismo",
            "lugar": "Estadio de atletismo, Bogotá",
            "tipo": "Fase nacional",
            "detalle": "Primera jornada de atletismo de la fase nacional."
          },
          {
            "id": "ev15",
            "fecha": "2026-10-28",
            "hora": "9:00 a. m.",
            "titulo": "Fase nacional · Baloncesto",
            "lugar": "Coliseo cubierto, Bogotá",
            "tipo": "Fase nacional",
            "detalle": "Partidos de baloncesto de la fase nacional."
          },
          {
            "id": "ev16",
            "fecha": "2026-10-31",
            "hora": "5:00 p. m.",
            "titulo": "Ceremonia de clausura",
            "lugar": "Bogotá",
            "tipo": "Ceremonia",
            "detalle": "Cierre de la edición 2026 y reconocimiento a las delegaciones."
          }
        ]
      },
      "resultados": {
        "_ejemplo": "Resultados ficticios y congelados de demostración",
        "titulo": "Resultados de enfrentamientos",
        "items": [
          {"nombre": "Instituto Brisa Clara", "deporte": "Baloncesto", "prueba": "Baloncesto 5 × 5", "categoria": "Juvenil · Femenino", "ronda": "Fase de grupos", "fase": "Regional", "estado": "Finalizado", "resultado": "48 — 42"},
          {"nombre": "Elian Brisaclara", "deporte": "Atletismo", "prueba": "80 metros", "categoria": "Juvenil · Masculino", "ronda": "Final", "fase": "Regional", "estado": "Finalizado", "resultado": "10,80 s"}
        ]
      },
      /* TEXTO DE EJEMPLO: las seis regionales de la captura de referencia (faltan las demás) y la final.
         Fotos: no hay atletismo ni salto largo en assets/, van las más cercanas (`pos` = encuadre). */
      "regionales": {
        "titulo": "Regional de conjuntos",
        "subtitulo": "Sigue el minuto a minuto de los eventos de esta fase",
        "cambiar": "Cambiar",
        /* Opciones y orden de «Regional de individuales» son de EJEMPLO (Jorge debe confirmar los reales).
           `tarjetas` = índices de `items` en el orden de cada opción; `actual` es la inicial. */
        "actual": "conjuntos",
        "opciones": [
          { "id": "conjuntos", "nombre": "Regional de conjuntos", "tarjetas": [0, 1, 2, 3, 4, 5] },
          { "id": "individuales", "nombre": "Regional de individuales", "tarjetas": [5, 4, 3, 2, 1, 0] },
          { "id": "final", "nombre": "Final nacional", "tarjetas": [6] }
        ],
        "items": [
          { "ciudad": "Pasto", "nombre": "Regional Pacífico", "img": "assets/landing/galeria-c.jpg", "pos": "50% 50%" },
          { "ciudad": "Aguazul", "nombre": "Regional Orinoquia", "img": "assets/landing/novedad-principal.jpg", "pos": "50% 40%" },
          { "ciudad": "Manizales", "nombre": "Regional Eje Cafetero", "img": "assets/landing/galeria-a.jpg", "pos": "50% 22%" },
          { "ciudad": "Espinal", "nombre": "Regional Centro Sur", "img": "assets/landing/noticia-2.jpg", "pos": "46% 40%" },
          { "ciudad": "Floridablanca", "nombre": "Regional Centro Oriente", "img": "assets/landing/noticia-1.jpg", "pos": "40% 40%" },
          { "ciudad": "Puerto Colombia", "nombre": "Regional Caribe 1", "img": "assets/landing/galeria-b.jpg", "pos": "50% 50%" },
          /* Noticia de la web oficial (10-jun-2026): Bogotá será la sede de la final nacional. Foto del mosaico. */
          { "ciudad": "Bogotá", "nombre": "Final Nacional", "img": "assets/landing/galeria-b.jpg", "pos": "55% 30%" }
        ]
      },
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
        "img": "assets/landing/splash-deportistas.jpg",
        "alt": "Juegos Intercolegiados 2026 · Ministerio del Deporte",
        "ms": 2200
      },
      "portada": {
        "titular": [
          "¡Juntos llegamos",
          "más lejos!"
        ],
        "alt": "Juegos Intercolegiados 2026",
        "img": "assets/landing/deportista.png"
      },
      "menu": [
        {
          "id": "calendario",
          "icono": "calendar",
          "label": "Calendario y Resultados",
          "vista": "regionales",
          "activa": true
        }
      ],
      "competencias": {
        "titulo": "Fase regional"
      },
      "novedades": {
        "titulo": "Novedades"
      },
      "videotutoriales": {
        "titulo": "Video tutoriales",
        "video": "assets/landing/video-tutorial-registro.mp4",
        "poster": "assets/landing/video-tutorial-poster.jpg",
        "alt": "Vista previa del video tutorial de registro de institución",
        "nombre": "Conoce cómo usar la plataforma",
        "enlace": "Ver todos",
        "url": "https://www.youtube.com/playlist?list=PLIMBtBqZGiXc3uAZTFKREGbpbusHy3ui1"
      },
      "mosaico": [
        {
          "img": "assets/landing/galeria-a.jpg",
          "ciudad": "Florencia",
          "pos": "38% 30%",
          "alto": "alto"
        },
        {
          "img": "assets/landing/noticia-1.jpg",
          "ciudad": "Medellín",
          "pos": "50% 50%",
          "alto": "bajo"
        },
        {
          "img": "assets/landing/novedad-principal.jpg",
          "ciudad": "Barranquilla",
          "pos": "50% 50%",
          "alto": "bajo"
        },
        {
          "img": "assets/landing/galeria-b.jpg",
          "ciudad": "Bogotá",
          "pos": "55% 30%",
          "alto": "alto"
        },
        {
          "img": "assets/landing/galeria-c.jpg",
          "ciudad": "Cali",
          "pos": "67% 50%",
          "alto": "alto"
        },
        {
          "img": "assets/landing/noticia-2.jpg",
          "ciudad": "Bucaramanga",
          "pos": "50% 40%",
          "alto": "bajo"
        }
      ]
    }
  }
};
