// ===== Configuración =====
const CATEGORIAS = [
  'peliculas', 'series', 'novelas', 'animes',
  'munequitos', 'shows', 'documentales'
];

let categoriaActual = 'peliculas';
let datosActuales = [];

// ===== Elementos del DOM =====
const listaEl      = document.getElementById('lista');
const vacioEl      = document.getElementById('vacio');
const buscarEl     = document.getElementById('buscar');
const categoriasEl = document.getElementById('categorias');

// ===== Cargar JSON según categoría =====
async function cargarCategoria(cat) {
  categoriaActual = cat;
  listaEl.innerHTML = '<p class="cargando">Cargando...</p>';
  vacioEl.classList.add('oculto');

  try {
    const resp = await fetch(`datos/${cat}.json`);
    if (!resp.ok) throw new Error('No se pudo cargar ' + cat);
    datosActuales = await resp.json();
    renderizar(datosActuales);
  } catch (err) {
    listaEl.innerHTML = '';
    vacioEl.querySelector('p').textContent = 'Error al cargar datos 😢';
    vacioEl.classList.remove('oculto');
    console.error(err);
  }
}

// ===== Renderizar lista =====
function renderizar(items) {
  listaEl.innerHTML = '';

  if (!items.length) {
    vacioEl.classList.remove('oculto');
    return;
  }
  vacioEl.classList.add('oculto');

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'tarjeta';

    card.innerHTML = `
      <img src="${item.imagen}" alt="${item.titulo}" loading="lazy"
           onerror="this.src='https://via.placeholder.com/110x160/21212b/ff4757?text=Sin+Imagen'">
      <div class="tarjeta-info">
        <h2>${item.titulo}</h2>
        <span class="genero">${item.genero}</span>
        <p class="sinopsis">${item.sinopsis}</p>
      </div>
    `;

    listaEl.appendChild(card);
  });
}

// ===== Filtro de búsqueda =====
buscarEl.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) return renderizar(datosActuales);

  const filtrados = datosActuales.filter(item =>
    item.titulo.toLowerCase().includes(q) ||
    item.genero.toLowerCase().includes(q)
  );
  renderizar(filtrados);
});

// ===== Cambio de categoría =====
categoriasEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.cat-btn');
  if (!btn) return;

  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  buscarEl.value = '';
  cargarCategoria(btn.dataset.cat);
});

// ===== Inicio =====
cargarCategoria('peliculas');