import './style.css';

// 1. Configuración: cada botón apunta a una carpeta y a sus fragmentos HTML.
const paginas = {
  informacion: {
    carpeta: '1 Página_Información',
    navbar: 'Navbar.html',
    secciones: ['Section.html'],
    footer: 'Footer.html',
  },
  pagina2: {
    carpeta: '2 Página_',
    navbar: 'Navbar.html',
    secciones: ['Section.html'],
    footer: 'Footer.html',
  },
  pagina3: {
    carpeta: '3 Página_',
    navbar: 'Navbar.html',
    secciones: ['Section.html'],
    footer: 'Footer.html',
  },
  pagina4: {
    carpeta: '4 Página_',
    navbar: 'Navbar.html',
    secciones: ['Section.html'],
    footer: 'Footer.html',
  },
  pagina5: {
    carpeta: '5 Página_',
    navbar: 'Navbar.html',
    secciones: ['Section.html'],
    footer: 'Footer.html',
  },
  dinamica: {
    carpeta: 'A1 Dinamica_Preguntas-Respuestas',
    navbar: 'Navbar.html',
    secciones: ['Section.html'],
    footer: 'Footer.html',
  },
  comparacion: {
    carpeta: 'A2 Respuesta Final+Comparación',
    navbar: 'Navbar.html',
    secciones: ['Section.html'],
    footer: 'Footer.html',
  },
};

// Vite prepara los HTML como texto para poder insertarlos en la página.
const fragmentosHtml = import.meta.glob('./**/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const app = document.querySelector('#app');

if (!app) {
  throw new Error('No se encontró el elemento #app en index.html.');
}

let posicionAntesPanelAjustes = null;
let estilosBodyAntesPanelAjustes = null;
let idiomaSeleccionado = 'es';

function bloquearScrollFondo() {
  if (posicionAntesPanelAjustes !== null) {
    return;
  }

  posicionAntesPanelAjustes = window.scrollY;
  estilosBodyAntesPanelAjustes = {
    position: document.body.style.position,
    top: document.body.style.top,
    left: document.body.style.left,
    width: document.body.style.width,
    overflow: document.body.style.overflow,
  };
  document.body.style.position = 'fixed';
  document.body.style.top = `-${posicionAntesPanelAjustes}px`;
  document.body.style.left = '0';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
}

function desbloquearScrollFondo() {
  if (posicionAntesPanelAjustes === null || !estilosBodyAntesPanelAjustes) {
    return;
  }

  const posicionRestaurar = posicionAntesPanelAjustes;
  Object.assign(document.body.style, estilosBodyAntesPanelAjustes);
  posicionAntesPanelAjustes = null;
  estilosBodyAntesPanelAjustes = null;
  window.scrollTo(0, posicionRestaurar);
}

function cerrarPanelAjustes(header) {
  const capa = header.querySelector('.navbar-informacion__ajustes-capa');
  const botonAjustes = header.querySelector('.navbar-informacion__ajustes');
  const controlNavbar = header.querySelector('.navbar-informacion__toggle');

  header.classList.remove('header-informacion--oculta', 'header-informacion--ajustes-abiertos');
  capa?.classList.remove('navbar-informacion__ajustes-capa--abierta');
  capa?.setAttribute('aria-hidden', 'true');
  botonAjustes?.setAttribute('aria-expanded', 'false');
  controlNavbar?.setAttribute('aria-expanded', 'true');
  controlNavbar?.setAttribute('aria-label', 'Ocultar navegación');
  controlNavbar?.replaceChildren('↑');
  desbloquearScrollFondo();
}

function cerrarSelectorIdioma(header) {
  const capaIdioma = header.querySelector('.navbar-informacion__idioma-capa');
  capaIdioma?.classList.remove('navbar-informacion__idioma-capa--abierta');
  capaIdioma?.setAttribute('aria-hidden', 'true');
}

// 2. Funciones comunes: normalmente no hace falta cambiarlas al añadir contenido.
function cargarFragmento(carpeta, archivo) {
  const ruta = `./${carpeta}/${archivo}`;
  const html = fragmentosHtml[ruta];

  if (typeof html !== 'string') {
    throw new Error(`No se encontró el fragmento ${ruta}.`);
  }

  return html;
}

function mostrarPagina(idPagina) {
  const pagina = paginas[idPagina];

  if (!pagina) {
    throw new Error(`No existe la página "${idPagina}".`);
  }

  const navbar = cargarFragmento(pagina.carpeta, pagina.navbar);
  const secciones = pagina.secciones
    .map((archivo) => cargarFragmento(pagina.carpeta, archivo))
    .join('\n');
  const footer = cargarFragmento(pagina.carpeta, pagina.footer);
  const claseHeader = idPagina === 'informacion' ? ' class="header-informacion"' : '';

  desbloquearScrollFondo();
  app.innerHTML = `
    <header${claseHeader}>${navbar}</header>
    <main class="page-content">${secciones}</main>
    <footer>${footer}</footer>
  `;

  app.querySelector(`[data-page="${idPagina}"]`)?.setAttribute('aria-current', 'page');
}

// Un solo listener sirve para los botones aunque se vuelva a crear la navbar.
app.addEventListener('click', (evento) => {
  if (!(evento.target instanceof Element)) {
    return;
  }

  const cabeceraInformacion = evento.target.closest('.header-informacion');
  const capaIdioma = evento.target.closest('.navbar-informacion__idioma-capa');
  const capaAjustes = evento.target.closest('.navbar-informacion__ajustes-capa');
  const botonAjustes = evento.target.closest('.navbar-informacion__ajustes');

  if (capaIdioma) {
    const opcionIdioma = evento.target.closest('[data-idioma]');

    if (opcionIdioma) {
      idiomaSeleccionado = opcionIdioma.dataset.idioma ?? idiomaSeleccionado;
      capaIdioma.querySelectorAll('[data-idioma]').forEach((opcion) => {
        opcion.setAttribute('aria-pressed', String(opcion === opcionIdioma));
      });
    }

    const header = capaIdioma.closest('.header-informacion');
    const fueraDelDialogo = !evento.target.closest('.navbar-informacion__idioma-dialogo');
    if (header && (opcionIdioma || fueraDelDialogo)) {
      cerrarSelectorIdioma(header);
    }
    return;
  }

  if (evento.target.closest('.navbar-informacion__idioma-abrir') && cabeceraInformacion) {
    const capa = cabeceraInformacion.querySelector('.navbar-informacion__idioma-capa');
    capa?.classList.add('navbar-informacion__idioma-capa--abierta');
    capa?.setAttribute('aria-hidden', 'false');
    capa?.querySelector(`[data-idioma="${idiomaSeleccionado}"]`)?.focus();
    return;
  }

  if (evento.target.closest('.navbar-informacion__logo-boton')) {
    const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: movimientoReducido ? 'instant' : 'smooth' });
    return;
  }

  if (capaAjustes && !evento.target.closest('.navbar-informacion__ajustes-panel')) {
    if (cabeceraInformacion) {
      cerrarPanelAjustes(cabeceraInformacion);
    }
    return;
  }

  if (botonAjustes && cabeceraInformacion) {
    const capa = cabeceraInformacion.querySelector('.navbar-informacion__ajustes-capa');
    const controlNavbar = cabeceraInformacion.querySelector('.navbar-informacion__toggle');
    const abiertos = cabeceraInformacion.classList.contains('header-informacion--ajustes-abiertos');

    cabeceraInformacion.classList.toggle('header-informacion--oculta', !abiertos);
    cabeceraInformacion.classList.toggle('header-informacion--ajustes-abiertos', !abiertos);
    capa?.classList.toggle('navbar-informacion__ajustes-capa--abierta', !abiertos);
    capa?.setAttribute('aria-hidden', String(abiertos));
    botonAjustes.setAttribute('aria-expanded', String(!abiertos));
    controlNavbar?.setAttribute('aria-expanded', String(abiertos));
    controlNavbar?.setAttribute('aria-label', abiertos ? 'Ocultar navegación' : 'Mostrar navegación');
    controlNavbar?.replaceChildren(abiertos ? '↑' : '↓');
    if (abiertos) {
      desbloquearScrollFondo();
    } else {
      bloquearScrollFondo();
    }
    return;
  }

  const controlNavbar = evento.target.closest('.navbar-informacion__toggle');

  if (controlNavbar) {
    const header = controlNavbar.closest('.header-informacion');

    if (!header) {
      return;
    }

    if (header.classList.contains('header-informacion--ajustes-abiertos')) {
      cerrarPanelAjustes(header);
      return;
    }

    const oculta = header.classList.toggle('header-informacion--oculta');
    controlNavbar.setAttribute('aria-expanded', String(!oculta));
    controlNavbar.setAttribute('aria-label', oculta ? 'Mostrar navegación' : 'Ocultar navegación');
    controlNavbar.textContent = oculta ? '↓' : '↑';
    return;
  }

  const boton = evento.target.closest('[data-page]');

  if (boton?.dataset.page) {
    mostrarPagina(boton.dataset.page);
  }
});

window.addEventListener('keydown', (evento) => {
  if (evento.key !== 'Escape') {
    return;
  }

  const header = app.querySelector('.header-informacion');
  if (header?.querySelector('.navbar-informacion__idioma-capa--abierta')) {
    cerrarSelectorIdioma(header);
  } else if (header?.classList.contains('header-informacion--ajustes-abiertos')) {
    cerrarPanelAjustes(header);
  }
});

let ultimaPosicionScroll = window.scrollY;
let direccionScroll = 0;
let recorridoScroll = 0;

function actualizarProgresoScroll() {
  const marca = app.querySelector('.navbar-informacion__marca');

  if (!marca) {
    return;
  }

  const recorridoMaximo = document.documentElement.scrollHeight - window.innerHeight;
  const progreso = recorridoMaximo > 0 ? Math.min(window.scrollY / recorridoMaximo, 1) : 0;

  marca.style.setProperty('--progreso-scroll', String(progreso));
}

window.addEventListener(
  'scroll',
  () => {
    actualizarProgresoScroll();

    const navbar = app.querySelector('.navbar-informacion');
    const posicionActual = window.scrollY;
    const diferencia = posicionActual - ultimaPosicionScroll;
    ultimaPosicionScroll = posicionActual;

    if (!navbar || posicionActual <= 20) {
      navbar?.classList.remove('navbar-informacion--enlaces-ocultos');
      navbar?.classList.remove('navbar-informacion--compacta');
      direccionScroll = 0;
      recorridoScroll = 0;
      return;
    }

    if (diferencia === 0) {
      return;
    }

    const nuevaDireccion = Math.sign(diferencia);
    recorridoScroll =
      nuevaDireccion === direccionScroll ? recorridoScroll + Math.abs(diferencia) : Math.abs(diferencia);
    direccionScroll = nuevaDireccion;

    if (recorridoScroll >= 24) {
      navbar.classList.toggle('navbar-informacion--enlaces-ocultos', nuevaDireccion > 0);
      navbar.classList.toggle('navbar-informacion--compacta', nuevaDireccion > 0);
      recorridoScroll = 0;
    }
  },
  { passive: true },
);

window.addEventListener('resize', actualizarProgresoScroll);

mostrarPagina('informacion');
actualizarProgresoScroll();
