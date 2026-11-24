export const panelDinamicaHTML = `
  <aside class="dinamica__mapa" aria-label="Respuestas seleccionadas">
    <canvas class="dinamica__conexiones" aria-hidden="true"></canvas>
    <div class="dinamica__nodos"></div>
  </aside>
`;

const pantallaAmpliaMedia = window.matchMedia('(min-width: 1000px)');
const movimientoReducidoMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
let animacionCubosId = null;
let tiempoUltimoFrameCubos = 0;
const interaccionesMapa = new WeakSet();

export function actualizarCubitoDinamica(app, boton, seleccionado) {
  const panel = app.querySelector('.dinamica__mapa');

  if (!(panel instanceof HTMLElement) || !pantallaAmpliaMedia.matches) {
    return;
  }

  const idPregunta = boton.dataset.preguntaId;
  const contenedorNodos = panel.querySelector('.dinamica__nodos');
  const nodos = [...panel.querySelectorAll('.dinamica__nodo')];
  const nodoExistente = nodos.find((nodo) => nodo.dataset.preguntaId === idPregunta);

  if (!seleccionado) {
    if (nodoExistente) {
      nodoExistente.classList.remove('dinamica__nodo--visible');
      nodoExistente.classList.add('dinamica__nodo--saliendo');
      window.setTimeout(() => {
        if (nodoExistente.classList.contains('dinamica__nodo--saliendo')) {
          nodoExistente.remove();
          iniciarAnimacionCubos(app);
        }
      }, 240);
    }
    iniciarAnimacionCubos(app);
    return;
  }

  if (nodoExistente) {
    nodoExistente.classList.remove('dinamica__nodo--saliendo');
    nodoExistente.classList.add('dinamica__nodo--visible');
    return;
  }

  const texto = boton.querySelector('.dinamica__cubo-texto');

  if (!idPregunta || !(contenedorNodos instanceof HTMLElement) || !texto) {
    throw new Error('No se pudo crear la respuesta flotante seleccionada.');
  }

  const nodo = document.createElement('article');
  nodo.className = 'dinamica__nodo';
  nodo.dataset.preguntaId = idPregunta;

  const textoNodo = document.createElement('span');
  textoNodo.className = 'dinamica__nodo-texto';
  textoNodo.textContent = texto.textContent;
  nodo.append(textoNodo);
  contenedorNodos.append(nodo);

  const maximoX = Math.max(0, panel.clientWidth - nodo.offsetWidth);
  const maximoY = Math.max(0, panel.clientHeight - nodo.offsetHeight);
  nodo.dataset.x = String(Math.random() * maximoX);
  nodo.dataset.y = String(Math.random() * maximoY);
  nodo.dataset.vx = String(velocidadAleatoria());
  nodo.dataset.vy = String(velocidadAleatoria());
  nodo.style.transform = `translate3d(${nodo.dataset.x}px, ${nodo.dataset.y}px, 0)`;
  window.requestAnimationFrame(() => {
    nodo.classList.add('dinamica__nodo--visible');
  });
  iniciarAnimacionCubos(app);
}

export function conectarInteraccionMapa(panel) {
  if (interaccionesMapa.has(panel)) {
    return;
  }
  interaccionesMapa.add(panel);

  panel.addEventListener('pointermove', (evento) => {
    const limites = panel.getBoundingClientRect();
    const punteroX = evento.clientX - limites.left;
    const punteroY = evento.clientY - limites.top;
    const tiempo = performance.now();
    const xAnterior = Number(panel.dataset.punteroX);
    const yAnterior = Number(panel.dataset.punteroY);
    const tiempoAnterior = Number(panel.dataset.punteroTiempo);

    if (Number.isFinite(xAnterior) && Number.isFinite(yAnterior) && tiempo > tiempoAnterior) {
      const intervalo = Math.max((tiempo - tiempoAnterior) / 1000, 0.001);
      let velocidadX = (punteroX - xAnterior) / intervalo;
      let velocidadY = (punteroY - yAnterior) / intervalo;
      const rapidez = Math.hypot(velocidadX, velocidadY);
      if (rapidez > 1800) {
        velocidadX = (velocidadX / rapidez) * 1800;
        velocidadY = (velocidadY / rapidez) * 1800;
      }
      panel.dataset.punteroVX = String(velocidadX);
      panel.dataset.punteroVY = String(velocidadY);
    }

    panel.dataset.punteroX = String(punteroX);
    panel.dataset.punteroY = String(punteroY);
    panel.dataset.punteroTiempo = String(tiempo);

    const arrastrado = panel.querySelector('.dinamica__nodo--arrastrando');
    if (!(arrastrado instanceof HTMLElement)) {
      return;
    }

    const x = limitar(
      Number(panel.dataset.punteroX) - Number(arrastrado.dataset.offsetX),
      0,
      panel.clientWidth - arrastrado.offsetWidth,
    );
    const y = limitar(
      Number(panel.dataset.punteroY) - Number(arrastrado.dataset.offsetY),
      0,
      panel.clientHeight - arrastrado.offsetHeight,
    );
    arrastrado.dataset.x = String(x);
    arrastrado.dataset.y = String(y);
    arrastrado.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    dibujarConexiones(panel, [...panel.querySelectorAll('.dinamica__nodo')]);
  });

  panel.addEventListener('pointerleave', () => {
    delete panel.dataset.punteroX;
    delete panel.dataset.punteroY;
    delete panel.dataset.punteroVX;
    delete panel.dataset.punteroVY;
    delete panel.dataset.punteroTiempo;
  });

  panel.addEventListener('pointerdown', (evento) => {
    if (!(evento.target instanceof Element)) {
      return;
    }
    const nodo = evento.target.closest('.dinamica__nodo');
    if (!(nodo instanceof HTMLElement) || !panel.contains(nodo)) {
      return;
    }

    evento.preventDefault();
    const limitesPanel = panel.getBoundingClientRect();
    nodo.dataset.offsetX = String(evento.clientX - limitesPanel.left - Number(nodo.dataset.x));
    nodo.dataset.offsetY = String(evento.clientY - limitesPanel.top - Number(nodo.dataset.y));
    nodo.classList.add('dinamica__nodo--arrastrando');
    nodo.setPointerCapture(evento.pointerId);
  });

  const finalizarArrastre = (evento) => {
    if (!(evento.target instanceof HTMLElement)) {
      return;
    }
    const nodo = evento.target.closest('.dinamica__nodo--arrastrando');
    if (!nodo || !panel.contains(nodo)) {
      return;
    }
    nodo.classList.remove('dinamica__nodo--arrastrando');
    delete nodo.dataset.offsetX;
    delete nodo.dataset.offsetY;
    if (nodo.hasPointerCapture(evento.pointerId)) {
      nodo.releasePointerCapture(evento.pointerId);
    }
  };

  panel.addEventListener('pointerup', finalizarArrastre);
  panel.addEventListener('pointercancel', finalizarArrastre);
}

function limitar(valor, minimo, maximo) {
  return Math.min(Math.max(minimo, maximo), Math.max(minimo, valor));
}

function velocidadAleatoria() {
  const velocidad = (Math.random() * 2 - 1) * 28;
  return Math.abs(velocidad) < 10 ? Math.sign(velocidad || 1) * 10 : velocidad;
}

export function iniciarAnimacionCubos(app) {
  if (!pantallaAmpliaMedia.matches) {
    return;
  }

  if (movimientoReducidoMedia.matches) {
    animarCubos(app, performance.now());
    return;
  }
  if (animacionCubosId !== null || !app.querySelector('.dinamica__nodo')) {
    return;
  }

  tiempoUltimoFrameCubos = 0;
  animacionCubosId = window.requestAnimationFrame((marca) => animarCubos(app, marca));
}

function animarCubos(app, marcaTiempo) {
  animacionCubosId = null;
  const panel = app.querySelector('.dinamica__mapa');

  if (!(panel instanceof HTMLElement) || !pantallaAmpliaMedia.matches) {
    return;
  }

  const nodos = [...panel.querySelectorAll('.dinamica__nodo')];

  if (!nodos.length) {
    dibujarConexiones(panel, nodos);
    tiempoUltimoFrameCubos = 0;
    return;
  }

  const delta = tiempoUltimoFrameCubos
    ? Math.min((marcaTiempo - tiempoUltimoFrameCubos) / 1000, 0.05)
    : 0;
  tiempoUltimoFrameCubos = marcaTiempo;
  const velocidadPunteroX = Number(panel.dataset.punteroVX) || 0;
  const velocidadPunteroY = Number(panel.dataset.punteroVY) || 0;
  const decaimientoPuntero = Math.exp(-7 * delta);
  panel.dataset.punteroVX = String(velocidadPunteroX * decaimientoPuntero);
  panel.dataset.punteroVY = String(velocidadPunteroY * decaimientoPuntero);

  nodos.forEach((nodo) => {
    if (nodo.classList.contains('dinamica__nodo--arrastrando')) {
      return;
    }

    const maximoX = Math.max(0, panel.clientWidth - nodo.offsetWidth);
    const maximoY = Math.max(0, panel.clientHeight - nodo.offsetHeight);
    let x = Number(nodo.dataset.x) + Number(nodo.dataset.vx) * delta;
    let y = Number(nodo.dataset.y) + Number(nodo.dataset.vy) * delta;
    let velocidadX = Number(nodo.dataset.vx);
    let velocidadY = Number(nodo.dataset.vy);
    const punteroX = Number(panel.dataset.punteroX);
    const punteroY = Number(panel.dataset.punteroY);
    if (Number.isFinite(punteroX) && Number.isFinite(punteroY)) {
      const distanciaX = x + nodo.offsetWidth / 2 - punteroX;
      const distanciaY = y + nodo.offsetHeight / 2 - punteroY;
      const distancia = Math.hypot(distanciaX, distanciaY);
      const radioEmpuje = 160;
      if (distancia < radioEmpuje) {
        const rapidezPuntero = Math.hypot(velocidadPunteroX, velocidadPunteroY);
        const direccionX = distancia > 1
          ? distanciaX / distancia
          : rapidezPuntero > 0
            ? velocidadPunteroX / rapidezPuntero
            : 1;
        const direccionY = distancia > 1
          ? distanciaY / distancia
          : rapidezPuntero > 0
            ? velocidadPunteroY / rapidezPuntero
            : 0;
        const proximidad = (radioEmpuje - distancia) / radioEmpuje;
        const fuerza = (1800 + rapidezPuntero * 0.8) * 0.6 * proximidad * delta;
        velocidadX += direccionX * fuerza;
        velocidadY += direccionY * fuerza;
      }
    }
    const rapidez = Math.hypot(velocidadX, velocidadY);
    if (rapidez > 300) {
      velocidadX = (velocidadX / rapidez) * 300;
      velocidadY = (velocidadY / rapidez) * 300;
    }
    x += (velocidadX - Number(nodo.dataset.vx)) * delta;
    y += (velocidadY - Number(nodo.dataset.vy)) * delta;

    if (x < 0 || x > maximoX) {
      x = Math.min(maximoX, Math.max(0, x));
      velocidadX *= -1;
    }
    if (y < 0 || y > maximoY) {
      y = Math.min(maximoY, Math.max(0, y));
      velocidadY *= -1;
    }

    nodo.dataset.x = String(x);
    nodo.dataset.y = String(y);
    nodo.dataset.vx = String(velocidadX);
    nodo.dataset.vy = String(velocidadY);
    nodo.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });

  dibujarConexiones(panel, nodos);
  if (!movimientoReducidoMedia.matches) {
    animacionCubosId = window.requestAnimationFrame((marca) => animarCubos(app, marca));
  }
}

function dibujarConexiones(panel, nodos) {
  const canvas = panel.querySelector('.dinamica__conexiones');

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error('No se encontró el lienzo para conectar las respuestas.');
  }

  const contexto = canvas.getContext('2d');

  if (!contexto) {
    throw new Error('No se pudo inicializar el lienzo de conexiones.');
  }

  const ancho = panel.clientWidth;
  const alto = panel.clientHeight;
  const escala = Math.max(1, window.devicePixelRatio || 1);
  const anchoLienzo = Math.round(ancho * escala);
  const altoLienzo = Math.round(alto * escala);

  if (canvas.width !== anchoLienzo || canvas.height !== altoLienzo) {
    canvas.width = anchoLienzo;
    canvas.height = altoLienzo;
  }

  contexto.setTransform(escala, 0, 0, escala, 0, 0);
  contexto.clearRect(0, 0, ancho, alto);
  contexto.beginPath();

  for (let primero = 0; primero < nodos.length; primero += 1) {
    for (let segundo = primero + 1; segundo < nodos.length; segundo += 1) {
      const nodoInicial = nodos[primero];
      const nodoFinal = nodos[segundo];
      const inicioX = Number(nodoInicial.dataset.x) + nodoInicial.offsetWidth / 2;
      const inicioY = Number(nodoInicial.dataset.y) + nodoInicial.offsetHeight / 2;
      const finalX = Number(nodoFinal.dataset.x) + nodoFinal.offsetWidth / 2;
      const finalY = Number(nodoFinal.dataset.y) + nodoFinal.offsetHeight / 2;
      contexto.moveTo(inicioX, inicioY);
      contexto.lineTo(finalX, finalY);
    }
  }

  contexto.strokeStyle = 'rgba(227, 75, 67, 0.65)';
  contexto.lineWidth = 1.5;
  contexto.stroke();
}
