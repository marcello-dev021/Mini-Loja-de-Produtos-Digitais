// =============================================
// CONFIG — ajuste a URL da sua API aqui
// =============================================
const API_URL = '/api/produtos'; // ex: 'http://localhost:3000/api/produtos'

// =============================================
// ESTADO
// =============================================
let allProducts = [];
let cart = [];
let currentFilter = 'todos';

// Mapeamento de emojis/cores por categoria
const THUMB_CONFIG = {
  curso:  { colors: ['thumb-purple','thumb-teal','thumb-blue','thumb-pink'],  emoji: ['🎓','📹','💻','🚀'] },
  ebook:  { colors: ['thumb-amber','thumb-coral','thumb-green'],              emoji: ['📘','✍️','📊','💡'] },
  bundle: { colors: ['thumb-teal','thumb-purple'],                            emoji: ['📦','⭐'] },
};
const pick = (arr, i) => arr[i % arr.length];

// =============================================
// FETCH DE PRODUTOS
// =============================================
async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    allProducts = data;
  } catch (err) {
    console.warn('Usando produtos de exemplo (API indisponível):', err.message);
    allProducts = getMockProducts(); // fallback para desenvolvimento
  }

  renderProducts(allProducts);
  updateStatCount();
}

// =============================================
// RENDER DE PRODUTOS
// =============================================
function renderProducts(products) {
  const grid = document.getElementById('products-grid');
  const count = document.getElementById('products-count');

  count.textContent = `${products.length} produto${products.length !== 1 ? 's' : ''}`;

  if (products.length === 0) {
    grid.innerHTML = '<div class="empty-state">Nenhum produto encontrado nessa categoria.</div>';
    return;
  }

  grid.innerHTML = products.map((p, i) => {
    const cat = (p.categoria || 'curso').toLowerCase();
    const config = THUMB_CONFIG[cat] || THUMB_CONFIG.curso;
    const thumbClass = pick(config.colors, i);
    const emoji = pick(config.emoji, i);
    const badge = p.badge ? `<span class="card-badge badge-${p.badge}">${p.badge === 'new' ? 'Novo' : p.badge === 'hot' ? 'Popular' : 'Oferta'}</span>` : '';
    const preco = Number(p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return `
      <div class="product-card" style="animation-delay: ${i * 0.06}s">
        <div class="card-thumb ${thumbClass}">${emoji}</div>
        <div class="card-body">
          <div class="card-meta">
            <span class="card-category">${p.categoria || 'Curso'}</span>
            ${badge}
          </div>
          <div class="card-title">${p.nome || p.title || 'Produto'}</div>
          <div class="card-footer">
            <span class="card-price">${preco}</span>
            <button class="btn-add" onclick="addToCart(${p.id}, '${(p.nome || p.title || '').replace(/'/g,"\\'")}', ${p.preco})">
              + Adicionar
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// =============================================
// FILTROS
// =============================================
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;

    const filtered = currentFilter === 'todos'
      ? allProducts
      : allProducts.filter(p => (p.categoria || '').toLowerCase() === currentFilter);

    renderProducts(filtered);
  });
});

// =============================================
// CARRINHO
// =============================================
function addToCart(id, nome, preco) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, nome, preco, qty: 1 });
  }
  updateCartUI();
  showToast(`"${nome}" adicionado ao carrinho!`);
}

function updateCartUI() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-count').textContent = total;
}

// =============================================
// TOAST
// =============================================
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// =============================================
// STATS
// =============================================
function updateStatCount() {
  document.getElementById('stat-produtos').textContent = allProducts.length;
}

// =============================================
// MOCK PRODUCTS (fallback para desenvolvimento)
// Remova ou substitua quando a API estiver pronta
// =============================================
function getMockProducts() {
  return [
    { id: 1, nome: 'Design System do Zero',        categoria: 'Ebook',  preco: 47,  badge: 'hot' },
    { id: 2, nome: 'Node.js na Prática',            categoria: 'Curso',  preco: 127, badge: 'new' },
    { id: 3, nome: 'Copywriting que Converte',      categoria: 'Ebook',  preco: 37,  badge: null  },
    { id: 4, nome: 'UX Research Avançado',          categoria: 'Curso',  preco: 197, badge: null  },
    { id: 5, nome: 'Finanças para Freelancers',     categoria: 'Ebook',  preco: 29,  badge: 'sale'},
    { id: 6, nome: 'Marketing Digital 2025',        categoria: 'Curso',  preco: 157, badge: 'new' },
    { id: 7, nome: 'Pack Completo Dev Frontend',    categoria: 'Bundle', preco: 297, badge: 'hot' },
    { id: 8, nome: 'Python para Iniciantes',        categoria: 'Curso',  preco: 89,  badge: null  },
  ];
}

// =============================================
// INIT
// =============================================
fetchProducts();