import './style.css';
import './navbar.css';
import './responsive.css';
import {
  actualizarCubitoDinamica,
  conectarInteraccionMapa,
  iniciarAnimacionCubos,
  panelDinamicaHTML,
} from './A1 Dinamica_Preguntas-Respuestas/dinamica.js';

// Configuración: cada clave identifica una página y sus fragmentos HTML.
const paginas = {
  inicio: {
    carpeta: 'Página_Inicio',
    secciones: ['Section.html'],
    usaComponentesCompartidos: true,
    esPortada: true,
  },
  informacion: {
    carpeta: 'Página_Quienes_somos',
    secciones: ['Section.html'],
    usaComponentesCompartidos: true,
  },
  avisoLegal: {
    carpeta: 'Página_Leyes',
    secciones: ['AvisoLegal.html'],
    usaComponentesCompartidos: true,
    esLegal: true,
  },
  privacidad: {
    carpeta: 'Página_Leyes',
    secciones: ['PoliticaPrivacidad.html'],
    usaComponentesCompartidos: true,
    esLegal: true,
  },
  cookies: {
    carpeta: 'Página_Leyes',
    secciones: ['PoliticaCookies.html'],
    usaComponentesCompartidos: true,
    esLegal: true,
  },
  accesibilidad: {
    carpeta: 'Página_Leyes',
    secciones: ['Accesibilidad.html'],
    usaComponentesCompartidos: true,
    esLegal: true,
  },
  pagina2: {
    carpeta: 'Página_Leyes',
    secciones: ['Section.html'],
    usaComponentesCompartidos: true,
  },
  pagina3: {
    carpeta: 'Página_Programas',
    secciones: ['Section.html'],
    usaComponentesCompartidos: true,
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
    secciones: ['Section.html'],
    usaComponentesCompartidos: true,
    mostrarFooter: false,
  },
  resultadoDinamica: {
    carpeta: 'A1 Dinamica_Preguntas-Respuestas',
    secciones: ['Resultado.html'],
    usaComponentesCompartidos: true,
  },
  comparacion: {
    carpeta: 'A2 Respuesta Final+Comparación',
    navbar: 'Navbar.html',
    secciones: ['Section.html'],
    footer: 'Footer.html',
  },
};

const modificadoresContenido = {
  informacion: 'page-content--quienes',
  pagina2: 'page-content--leyes',
  pagina3: 'page-content--programas',
  dinamica: 'page-content--dinamica',
  resultadoDinamica: 'page-content--dinamica-resultado',
};

function obtenerClasesContenido(idPagina, pagina) {
  const clases = ['page-content'];

  if (pagina.esPortada) {
    clases.push('page-content--portada');
  } else if (pagina.usaComponentesCompartidos) {
    clases.push('page-content--navbar-informacion');
  }

  if (pagina.esLegal) {
    clases.push('page-content--legal');
  } else if (modificadoresContenido[idPagina]) {
    clases.push(modificadoresContenido[idPagina]);
  }

  return clases.join(' ');
}

// Vite importa cada fragmento HTML como texto para insertarlo al navegar.
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
let ignorarDireccionScrollHasta = 0;
let paginaActual = null;
let transicionPaginaEnCurso = false;
const navbarMovilMedia = window.matchMedia('(max-width: 700px)');

// Conserva la posición de página mientras un diálogo o panel bloquea el scroll.
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
  const botonAjustes = header.querySelector('.navbar-informacion__menu');
  const controlNavbar = header.querySelector('.navbar-informacion__toggle');
  const estabaAlFinal = header.dataset.scrollAlFinal === 'true';
  delete header.dataset.scrollAlFinal;

  header.classList.remove(
    'header-informacion--oculta',
    'header-informacion--ajustes-abiertos',
    'header-informacion--scroll-oculto',
  );
  capa?.classList.remove('navbar-informacion__ajustes-capa--abierta');
  capa?.setAttribute('aria-hidden', 'true');
  botonAjustes?.setAttribute('aria-expanded', 'false');
  botonAjustes?.setAttribute('aria-label', 'Abrir menú');
  botonAjustes?.setAttribute('title', 'Abrir menú');
  controlNavbar?.setAttribute('aria-expanded', 'true');
  controlNavbar?.setAttribute('aria-label', 'Ocultar navegación');
  controlNavbar?.replaceChildren('↑');
  desbloquearScrollFondo();
  ajustarScrollTrasCambioNavbar(estabaAlFinal);
}

function cerrarSelectorIdioma(header) {
  const capaIdioma = header.querySelector('.navbar-informacion__idioma-capa');
  capaIdioma?.classList.remove('navbar-informacion__idioma-capa--abierta');
  capaIdioma?.setAttribute('aria-hidden', 'true');
}

// Resuelve fragmentos locales o compartidos y notifica explícitamente si faltan.
function cargarFragmento(carpeta, archivo) {
  const ruta = `./${carpeta}/${archivo}`;
  const html = fragmentosHtml[ruta];

  if (typeof html !== 'string') {
    throw new Error(`No se encontró el fragmento ${ruta}.`);
  }

  return html;
}

function cargarFragmentoRaiz(archivo) {
  const ruta = `./${archivo}`;
  const html = fragmentosHtml[ruta];

  if (typeof html !== 'string') {
    throw new Error(`No se encontró el fragmento compartido ${ruta}.`);
  }

  return html;
}

function mostrarPagina(idPagina) {
  const pagina = paginas[idPagina];

  if (!pagina) {
    throw new Error(`No existe la página "${idPagina}".`);
  }

  const navbar = pagina.usaComponentesCompartidos
    ? cargarFragmentoRaiz('Navbar.html')
    : cargarFragmento(pagina.carpeta, pagina.navbar);
  const secciones = pagina.secciones
    .map((archivo) => cargarFragmento(pagina.carpeta, archivo))
    .join('\n');
  const footer = pagina.mostrarFooter === false
    ? ''
    : pagina.usaComponentesCompartidos
      ? cargarFragmentoRaiz('Footer.html')
      : cargarFragmento(pagina.carpeta, pagina.footer);
  desbloquearScrollFondo();
  app.classList.toggle('app--dinamica', idPagina === 'dinamica');
  app.innerHTML = `
    ${navbar ? `<header${pagina.usaComponentesCompartidos ? ' class="header-informacion"' : ''}>${navbar}</header>` : ''}
    <main class="${obtenerClasesContenido(idPagina, pagina)}">${secciones}</main>
    ${idPagina === 'dinamica' ? panelDinamicaHTML : ''}
    ${footer ? `<footer>${footer}</footer>` : ''}
  `;

  if (idPagina === 'resultadoDinamica') {
    insertarProgramaAleatorio();
  }
  const panelDinamica = app.querySelector('.dinamica__mapa');
  if (panelDinamica instanceof HTMLElement) {
    conectarInteraccionMapa(panelDinamica);
  }
  app.querySelector(`[data-page="${idPagina}"]`)?.setAttribute('aria-current', 'page');
}

function actualizarContenidoCompartido(idPagina) {
  const pagina = paginas[idPagina];
  const contenido = app.querySelector('.page-content');

  if (!pagina?.usaComponentesCompartidos || !contenido) {
    throw new Error(`No se pudo actualizar el contenido compartido de "${idPagina}".`);
  }

  app.classList.toggle('app--dinamica', idPagina === 'dinamica');
  contenido.innerHTML = pagina.secciones
    .map((archivo) => cargarFragmento(pagina.carpeta, archivo))
    .join('\n');
  if (idPagina === 'resultadoDinamica') {
    insertarProgramaAleatorio();
  }
  const panelDinamica = app.querySelector('.dinamica__mapa');
  if (idPagina === 'dinamica' && !panelDinamica) {
    contenido.insertAdjacentHTML('afterend', panelDinamicaHTML);
  } else if (idPagina !== 'dinamica') {
    panelDinamica?.remove();
  }
  const panelActual = app.querySelector('.dinamica__mapa');
  if (panelActual instanceof HTMLElement) {
    conectarInteraccionMapa(panelActual);
  }
  const footerActual = app.querySelector('footer');
  if (pagina.mostrarFooter === false) {
    footerActual?.remove();
  } else if (!footerActual) {
    const footer = document.createElement('footer');
    footer.innerHTML = cargarFragmentoRaiz('Footer.html');
    contenido.after(footer);
  }
  contenido.className = obtenerClasesContenido(idPagina, pagina);
  app.querySelectorAll('[data-page][aria-current="page"]').forEach((boton) => {
    boton.removeAttribute('aria-current');
  });
  app.querySelectorAll(`[data-page="${idPagina}"]`).forEach((boton) => {
    boton.setAttribute('aria-current', 'page');
  });
}

async function cambiarPagina(idPagina, { desplazarAlInicio = true } = {}) {
  if (idPagina === paginaActual || transicionPaginaEnCurso) {
    return;
  }

  const contenidoActual = app.querySelector('.page-content');
  const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (desplazarAlInicio) {
    window.scrollTo({ top: 0, behavior: movimientoReducido ? 'instant' : 'smooth' });
  }
  const conservarComponentesCompartidos =
    paginas[paginaActual]?.usaComponentesCompartidos &&
    paginas[idPagina]?.usaComponentesCompartidos;

  if (!contenidoActual || movimientoReducido) {
    mostrarPagina(idPagina);
    paginaActual = idPagina;
    return;
  }

  transicionPaginaEnCurso = true;

  try {
    contenidoActual.classList.remove('page-content--entrada');
    void contenidoActual.offsetWidth;

    await new Promise((resolver) => {
      let timeoutId = 0;
      const alFinalizarAnimacion = (evento) => {
        if (evento.target === contenidoActual) {
          finalizar();
        }
      };
      const finalizar = () => {
        window.clearTimeout(timeoutId);
        contenidoActual.removeEventListener('animationend', alFinalizarAnimacion);
        resolver();
      };

      contenidoActual.addEventListener('animationend', alFinalizarAnimacion);
      contenidoActual.classList.add('page-content--salida');
      timeoutId = window.setTimeout(finalizar, 350);
    });
    if (conservarComponentesCompartidos) {
      actualizarContenidoCompartido(idPagina);
    } else {
      mostrarPagina(idPagina);
    }
    paginaActual = idPagina;
    app.querySelector('.page-content')?.classList.add('page-content--entrada');
  } finally {
    transicionPaginaEnCurso = false;
  }
}

// Vuelve al inicio y desplaza la vista hasta la sección del manifiesto.
async function irAlManifiesto() {
  if (paginaActual !== 'inicio') {
    await cambiarPagina('inicio', { desplazarAlInicio: false });
  }

  const manifiesto = app.querySelector('#portada-manifiesto');

  if (!(manifiesto instanceof HTMLElement)) {
    throw new Error('No se encontró el manifiesto en la página de inicio.');
  }

  const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  manifiesto.scrollIntoView({
    behavior: movimientoReducido ? 'instant' : 'smooth',
    block: 'start',
  });
}

// Controla el diálogo de programas y restaura el scroll al cerrarlo.
function cerrarDialogoPrograma(dialogo) {
  if (!dialogo.open || dialogo.classList.contains('programas__modal--cerrando')) {
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dialogo.close();
    return;
  }

  dialogo.classList.remove('programas__modal--abierta');
  dialogo.classList.add('programas__modal--cerrando');
  window.setTimeout(() => {
    if (dialogo.open) {
      dialogo.close();
    }
  }, 220);
}

function insertarProgramaAleatorio() {
  const tarjetasDocumento = new DOMParser().parseFromString(
    cargarFragmento('Página_Programas', 'Section.html'),
    'text/html',
  );
  const tarjetas = [...tarjetasDocumento.querySelectorAll('.programas__tarjeta')];
  const modal = tarjetasDocumento.querySelector('.programas__modal');
  const contenedor = app.querySelector('.dinamica-resultado__programa');
  const indiceAleatorio = Math.floor(Math.random() * tarjetas.length);
  const tarjeta = tarjetas[indiceAleatorio];
  const boton = tarjeta?.querySelector('.programas__slot');

  if (
    !tarjeta ||
    !modal ||
    !contenedor ||
    !(boton instanceof HTMLButtonElement)
  ) {
    throw new Error('No se pudo cargar un partido de Programas para el resultado.');
  }

  const clasesColor = [...boton.classList].filter((clase) =>
    clase.startsWith('programas__slot--'),
  );
  boton.classList.remove(...clasesColor);
  boton.classList.add('programas__slot--gris');

  const componentePrograma = document.createElement('section');
  componentePrograma.className = 'programas dinamica-resultado__componente';
  componentePrograma.append(tarjeta, modal.cloneNode(true));
  contenedor.append(componentePrograma);
}

// Delegated clicks keep working when page fragments replace the current DOM.
app.addEventListener('click', (evento) => {
  if (!(evento.target instanceof Element)) {
    return;
  }

  const botonFinalizar = evento.target.closest('.dinamica__finalizar');
  if (botonFinalizar) {
    void cambiarPagina('resultadoDinamica');
    return;
  }

  const botonPregunta = evento.target.closest('.dinamica__cubo');

  if (botonPregunta) {
    const seleccionado = botonPregunta.getAttribute('aria-pressed') === 'true';
    botonPregunta.setAttribute('aria-pressed', String(!seleccionado));
    actualizarCubitoDinamica(app, botonPregunta, !seleccionado);
    return;
  }

  const enlaceManifiesto = evento.target.closest('[data-accion="ir-al-manifiesto"]');

  if (enlaceManifiesto) {
    evento.preventDefault();
    void irAlManifiesto();
    return;
  }

  const tarjetaPrograma = evento.target.closest('.programas__slot');

  if (tarjetaPrograma) {
    const paginaProgramas = tarjetaPrograma.closest('.programas');
    const dialogoPrograma = paginaProgramas?.querySelector('.programas__modal');
    const imagenPrograma = dialogoPrograma?.querySelector('.programas__modal-imagen');
    const tituloPrograma = dialogoPrograma?.querySelector('#programas-modal-titulo');
    const etiquetaPrograma = dialogoPrograma?.querySelector('.programas__modal-etiqueta');
    const numeroPrograma = tarjetaPrograma.getAttribute('data-programa-slot');
    const colorPrograma = tarjetaPrograma.getAttribute('data-color');

    if (
      !(dialogoPrograma instanceof HTMLDialogElement) ||
      !(imagenPrograma instanceof HTMLElement) ||
      !(tituloPrograma instanceof HTMLElement) ||
      !(etiquetaPrograma instanceof HTMLElement) ||
      !numeroPrograma ||
      !colorPrograma
    ) {
      throw new Error('No se pudo abrir la ficha del programa seleccionado.');
    }

    imagenPrograma.dataset.color = colorPrograma;
    tituloPrograma.textContent = `Partido ${numeroPrograma}`;
    etiquetaPrograma.textContent = `Espacio ${numeroPrograma}`;
    dialogoPrograma.onclose = () => {
      dialogoPrograma.classList.remove(
        'programas__modal--abierta',
        'programas__modal--cerrando',
      );
      desbloquearScrollFondo();
    };
    dialogoPrograma.oncancel = (eventoCancelar) => {
      eventoCancelar.preventDefault();
      cerrarDialogoPrograma(dialogoPrograma);
    };
    bloquearScrollFondo();
    dialogoPrograma.showModal();
    void dialogoPrograma.offsetWidth;
    dialogoPrograma.classList.add('programas__modal--abierta');
    return;
  }

  const botonCerrarPrograma = evento.target.closest('.programas__modal-cerrar');

  if (botonCerrarPrograma) {
    const dialogo = botonCerrarPrograma.closest('.programas__modal');
    if (dialogo instanceof HTMLDialogElement) {
      cerrarDialogoPrograma(dialogo);
    }
    return;
  }

  const enlacePartido = evento.target.closest('.programas__partido');

  if (enlacePartido?.getAttribute('aria-disabled') === 'true') {
    evento.preventDefault();
    return;
  }

  const dialogoPrograma = evento.target.closest('.programas__modal');

  if (dialogoPrograma instanceof HTMLDialogElement && evento.target === dialogoPrograma) {
    cerrarDialogoPrograma(dialogoPrograma);
    return;
  }

  const botonLegales = evento.target.closest('.footer-informacion__legales-toggle');

  if (botonLegales) {
    const expandido = botonLegales.getAttribute('aria-expanded') !== 'true';
    const listaLegales = document.querySelector(`#${botonLegales.getAttribute('aria-controls')}`);
    ignorarDireccionScrollHasta = performance.now() + 450;
    direccionScroll = 0;
    recorridoScroll = 0;
    botonLegales.setAttribute('aria-expanded', String(expandido));
    botonLegales.setAttribute(
      'aria-label',
      expandido ? 'Ocultar información legal' : 'Mostrar información legal',
    );
    botonLegales.setAttribute(
      'title',
      expandido ? 'Ocultar información legal' : 'Mostrar información legal',
    );
    botonLegales.replaceChildren(expandido ? '↑' : '↓');
    listaLegales?.setAttribute('aria-hidden', String(!expandido));
    return;
  }

  const cabeceraInformacion = evento.target.closest('.header-informacion');
  const capaIdioma = evento.target.closest('.navbar-informacion__idioma-capa');
  const capaAjustes = evento.target.closest('.navbar-informacion__ajustes-capa');
  const botonAjustes = evento.target.closest('.navbar-informacion__menu');
  const botonCerrarAjustes = evento.target.closest('.navbar-informacion__ajustes-cerrar');
  const botonPaginaPanel = evento.target.closest(
    '.navbar-informacion__ajustes-panel [data-page]',
  );

  if (botonCerrarAjustes && cabeceraInformacion) {
    cerrarPanelAjustes(cabeceraInformacion);
    return;
  }

  if (botonPaginaPanel?.dataset.page && cabeceraInformacion) {
    evento.preventDefault();
    cerrarPanelAjustes(cabeceraInformacion);
    void cambiarPagina(botonPaginaPanel.dataset.page);
    return;
  }

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

  const logoNavbar = evento.target.closest('.navbar-informacion__logo-boton');
  const botonInicio = logoNavbar ?? evento.target.closest('.footer-informacion__marca');

  if (botonInicio) {
    evento.preventDefault();
    if (paginaActual !== 'inicio') {
      void cambiarPagina('inicio');
    } else {
      const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: movimientoReducido ? 'instant' : 'smooth' });
    }
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

    if (abiertos) {
      cerrarPanelAjustes(cabeceraInformacion);
      return;
    }

    cabeceraInformacion.dataset.scrollAlFinal = String(estaAlFinalDelDocumento());
    if (navbarMovilMedia.matches) {
      cabeceraInformacion.classList.remove('header-informacion--scroll-oculto');
    } else {
      cabeceraInformacion.classList.add('header-informacion--oculta');
    }
    cabeceraInformacion.classList.add('header-informacion--ajustes-abiertos');
    capa?.classList.add('navbar-informacion__ajustes-capa--abierta');
    capa?.setAttribute('aria-hidden', 'false');
    botonAjustes.setAttribute('aria-expanded', 'true');
    botonAjustes.setAttribute('aria-label', 'Cerrar menú');
    botonAjustes.setAttribute('title', 'Cerrar menú');
    controlNavbar?.setAttribute('aria-expanded', 'false');
    controlNavbar?.setAttribute('aria-label', 'Mostrar navegación');
    controlNavbar?.replaceChildren('↓');
    bloquearScrollFondo();
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

    const estabaAlFinal = estaAlFinalDelDocumento();
    const oculta = header.classList.toggle('header-informacion--oculta');
    controlNavbar.setAttribute('aria-expanded', String(!oculta));
    controlNavbar.setAttribute('aria-label', oculta ? 'Mostrar navegación' : 'Ocultar navegación');
    controlNavbar.textContent = oculta ? '↓' : '↑';
    ajustarScrollTrasCambioNavbar(estabaAlFinal);
    return;
  }

  const boton = evento.target.closest('[data-page]');

  if (boton?.dataset.page) {
    evento.preventDefault();
    void cambiarPagina(boton.dataset.page);
  }
});

// Escape closes the active menu or language picker.
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

// Detects the bottom edge so navbar changes do not leave the footer out of view.
function estaAlFinalDelDocumento() {
  const limiteInferior = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  return limiteInferior - window.scrollY <= 4;
}

function ajustarScrollTrasCambioNavbar(estabaAlFinal) {
  const contenido = app.querySelector('.page-content');

  if (!(contenido instanceof HTMLElement)) {
    return;
  }

  let timeoutId = 0;
  const finalizar = () => {
    window.clearTimeout(timeoutId);
    contenido.removeEventListener('transitionend', alFinalizarTransicion);
    window.requestAnimationFrame(() => {
      const limiteInferior = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const posicionObjetivo = estabaAlFinal
        ? limiteInferior
        : Math.min(window.scrollY, limiteInferior);

      if (Math.abs(window.scrollY - posicionObjetivo) <= 1) {
        return;
      }

      ignorarDireccionScrollHasta = performance.now() + 450;
      direccionScroll = 0;
      recorridoScroll = 0;
      window.scrollTo({ top: posicionObjetivo, behavior: 'instant' });
    });
  };
  const alFinalizarTransicion = (evento) => {
    if (evento.target === contenido && evento.propertyName === 'padding-top') {
      finalizar();
    }
  };

  contenido.addEventListener('transitionend', alFinalizarTransicion);
  timeoutId = window.setTimeout(finalizar, 350);
}

function actualizarProgresoScroll() {
  const raiz = document.documentElement;
  const velocidadParallax = Number.parseFloat(
    getComputedStyle(raiz).getPropertyValue('--fondo-exterior-velocidad-parallax'),
  );
  raiz.style.setProperty(
    '--fondo-exterior-desplazamiento',
    `${-window.scrollY * velocidadParallax}px`,
  );

  const marca = app.querySelector('.navbar-informacion__marca');

  if (!marca) {
    return;
  }

  const recorridoMaximo = document.documentElement.scrollHeight - window.innerHeight;
  const progreso = recorridoMaximo > 0 ? Math.min(window.scrollY / recorridoMaximo, 1) : 0;

  marca.style.setProperty('--progreso-scroll', String(progreso));
}

// Hides navigation on scroll down and restores it when returning toward the top.
window.addEventListener(
  'scroll',
  () => {
    actualizarProgresoScroll();

    const navbar = app.querySelector('.navbar-informacion');
    const header = app.querySelector('.header-informacion');
    const posicionActual = window.scrollY;
    const diferencia = posicionActual - ultimaPosicionScroll;
    ultimaPosicionScroll = posicionActual;

    if (performance.now() < ignorarDireccionScrollHasta) {
      direccionScroll = 0;
      recorridoScroll = 0;
      return;
    }

    if (navbarMovilMedia.matches) {
      navbar?.classList.remove(
        'navbar-informacion--enlaces-ocultos',
        'navbar-informacion--compacta',
      );

      if (!navbar || !header || header.classList.contains('header-informacion--ajustes-abiertos')) {
        direccionScroll = 0;
        recorridoScroll = 0;
        return;
      }

      if (posicionActual <= 20) {
        header.classList.remove('header-informacion--scroll-oculto');
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
        header.classList.toggle('header-informacion--scroll-oculto', nuevaDireccion > 0);
        recorridoScroll = 0;
      }
      return;
    }

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

// Resets compact navigation styles when switching between mobile and desktop widths.
window.addEventListener('resize', () => {
  actualizarProgresoScroll();
  const header = app.querySelector('.header-informacion');
  const navbar = app.querySelector('.navbar-informacion');

  if (navbarMovilMedia.matches) {
    navbar?.classList.remove(
      'navbar-informacion--enlaces-ocultos',
      'navbar-informacion--compacta',
    );
  } else {
    header?.classList.remove('header-informacion--scroll-oculto');
  }
  iniciarAnimacionCubos(app);
});

mostrarPagina('inicio');
paginaActual = 'inicio';
actualizarProgresoScroll();
