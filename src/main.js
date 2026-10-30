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

  app.innerHTML = `
    <header>${navbar}</header>
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

  const boton = evento.target.closest('[data-page]');

  if (boton?.dataset.page) {
    mostrarPagina(boton.dataset.page);
  }
});

mostrarPagina('informacion');
