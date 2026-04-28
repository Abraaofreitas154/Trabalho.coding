// Configuração
const API_URL = '/api/exercicios';
let exerciciosCache = [];
let deferredPrompt = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  carregarExercicios();
  carregarGrupos();
  setupEventListeners();
  setupInstallPrompt();
});

// Event Listeners
function setupEventListeners() {
  document.getElementById('buscaInput').addEventListener('input', debounce(filtrarExercicios, 300));
  document.getElementById('grupoFilter').addEventListener('change', filtrarExercicios);
  document.getElementById('nivelFilter').addEventListener('change', filtrarExercicios);

  // Fechar modal ao clicar fora
  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') fecharModal();
  });

  // Submit com Enter
  document.getElementById('formExercicio').addEventListener('submit', (e) => {
    e.preventDefault();
    salvarExercicio();
  });
}

// Debounce para busca
function debounce(fn, ms) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}

// API Calls
async function fetchAPI(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensagem || 'Erro na requisição');
    }

    return await response.json();
  } catch (err) {
    showToast(err.message, 'error');
    throw err;
  }
}

// Carregar exercícios
async function carregarExercicios() {
  const container = document.getElementById('listaExercicios');
  container.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Carregando exercícios...</p>
    </div>
  `;

  try {
    const data = await fetchAPI(API_URL);
    exerciciosCache = data.dados || [];
    renderizarExercicios(exerciciosCache);
    atualizarStats(exerciciosCache);
  } catch {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">😕</div>
        <h3>Erro ao carregar</h3>
        <p>Tente recarregar a página</p>
      </div>
    `;
  }
}

// Carregar grupos no select
async function carregarGrupos() {
  try {
    const data = await fetchAPI(`${API_URL}/grupos`);
    const select = document.getElementById('grupoFilter');
    data.dados.forEach(grupo => {
      const opt = document.createElement('option');
      opt.value = grupo;
      opt.textContent = grupo;
      select.appendChild(opt);
    });
  } catch (err) {
    console.log('Erro ao carregar grupos:', err);
  }
}

// Renderizar lista
function renderizarExercicios(lista) {
  const container = document.getElementById('listaExercicios');

  if (lista.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🏋️</div>
        <h3>Nenhum exercício encontrado</h3>
        <p>Cadastre seu primeiro exercício clicando em "Novo Exercício"</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `<div class="cards-grid">${lista.map(ex => criarCard(ex)).join('')}</div>`;
}

// Criar card HTML
function criarCard(ex) {
  const groupClass = `group-${ex.grupoMuscular.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ç/g, 'c')}`;
  const nivelClass = `nivel-${ex.nivelDificuldade.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;

  return `
    <div class="exercise-card ${ex.ativo ? '' : 'inactive'}">
      <div class="card-header">
        <div>
          <div class="card-title">${escapeHtml(ex.nome)}</div>
          <span class="card-group ${groupClass}">${ex.grupoMuscular}</span>
          <span class="nivel-badge ${nivelClass}">${ex.nivelDificuldade}</span>
        </div>
        ${ex.imagemUrl ? `<img src="${escapeHtml(ex.imagemUrl)}" alt="" style="width:50px;height:50px;object-fit:cover;border-radius:8px;">` : ''}
      </div>
      <div class="card-body">
        <div class="card-stats">
          <div class="stat-item">
            <div class="stat-value">${ex.series}</div>
            <div class="stat-label">Séries</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${ex.repeticoes}</div>
            <div class="stat-label">Reps</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${ex.carga || 0}kg</div>
            <div class="stat-label">Carga</div>
          </div>
        </div>
        ${ex.descricao ? `<div class="card-description">${escapeHtml(ex.descricao)}</div>` : ''}
      </div>
      <div class="card-footer">
        <button class="btn btn-sm btn-secondary" onclick="alternarStatus('${ex._id}', ${ex.ativo})">
          ${ex.ativo ? '⏸️ Desativar' : '▶️ Ativar'}
        </button>
        <button class="btn btn-sm btn-primary" onclick="editarExercicio('${ex._id}')">✏️ Editar</button>
        <button class="btn btn-sm btn-danger" onclick="excluirExercicio('${ex._id}')">🗑️ Excluir</button>
      </div>
    </div>
  `;
}

// Escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Filtrar
function filtrarExercicios() {
  const busca = document.getElementById('buscaInput').value.toLowerCase();
  const grupo = document.getElementById('grupoFilter').value;
  const nivel = document.getElementById('nivelFilter').value;

  const filtrados = exerciciosCache.filter(ex => {
    const matchBusca = !busca || ex.nome.toLowerCase().includes(busca) || (ex.descricao && ex.descricao.toLowerCase().includes(busca));
    const matchGrupo = !grupo || ex.grupoMuscular === grupo;
    const matchNivel = !nivel || ex.nivelDificuldade === nivel;
    return matchBusca && matchGrupo && matchNivel;
  });

  renderizarExercicios(filtrados);
}

// Atualizar estatísticas
function atualizarStats(lista) {
  document.getElementById('totalExercicios').textContent = lista.length;
  document.getElementById('totalGrupos').textContent = new Set(lista.map(e => e.grupoMuscular)).size;
  document.getElementById('totalAtivos').textContent = lista.filter(e => e.ativo).length;
}

// Modal
function abrirModal(id = null) {
  document.getElementById('modalTitulo').textContent = id ? 'Editar Exercício' : 'Novo Exercício';
  document.getElementById('exercicioId').value = id || '';
  document.getElementById('formExercicio').reset();
  document.getElementById('modal').classList.add('active');

  if (id) {
    const ex = exerciciosCache.find(e => e._id === id);
    if (ex) preencherForm(ex);
  }
}

function fecharModal() {
  document.getElementById('modal').classList.remove('active');
  document.getElementById('formExercicio').reset();
  document.getElementById('exercicioId').value = '';
}

function preencherForm(ex) {
  document.getElementById('nome').value = ex.nome;
  document.getElementById('grupoMuscular').value = ex.grupoMuscular;
  document.getElementById('nivelDificuldade').value = ex.nivelDificuldade;
  document.getElementById('series').value = ex.series;
  document.getElementById('repeticoes').value = ex.repeticoes;
  document.getElementById('carga').value = ex.carga || 0;
  document.getElementById('descricao').value = ex.descricao || '';
  document.getElementById('imagemUrl').value = ex.imagemUrl || '';
}

// Salvar (criar/editar)
async function salvarExercicio() {
  const id = document.getElementById('exercicioId').value;
  const dados = {
    nome: document.getElementById('nome').value.trim(),
    grupoMuscular: document.getElementById('grupoMuscular').value,
    nivelDificuldade: document.getElementById('nivelDificuldade').value,
    series: parseInt(document.getElementById('series').value),
    repeticoes: parseInt(document.getElementById('repeticoes').value),
    carga: parseInt(document.getElementById('carga').value) || 0,
    descricao: document.getElementById('descricao').value.trim(),
    imagemUrl: document.getElementById('imagemUrl').value.trim()
  };

  if (!dados.nome || !dados.grupoMuscular) {
    showToast('Preencha os campos obrigatórios', 'error');
    return;
  }

  try {
    if (id) {
      await fetchAPI(`${API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dados)
      });
      showToast('Exercício atualizado!', 'success');
    } else {
      await fetchAPI(API_URL, {
        method: 'POST',
        body: JSON.stringify(dados)
      });
      showToast('Exercício criado!', 'success');
    }
    fecharModal();
    carregarExercicios();
  } catch (err) {
    console.error(err);
  }
}

// Editar
function editarExercicio(id) {
  abrirModal(id);
}

// Excluir
async function excluirExercicio(id) {
  if (!confirm('Tem certeza que deseja excluir este exercício?')) return;

  try {
    await fetchAPI(`${API_URL}/${id}`, { method: 'DELETE' });
    showToast('Exercício excluído!', 'success');
    carregarExercicios();
  } catch (err) {
    console.error(err);
  }
}

// Alternar status
async function alternarStatus(id, atual) {
  try {
    await fetchAPI(`${API_URL}/${id}/status`, { method: 'PATCH' });
    showToast(`Exercício ${atual ? 'desativado' : 'ativado'}!`, 'success');
    carregarExercicios();
  } catch (err) {
    console.error(err);
  }
}

// Toast notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// Install Prompt
function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installBtn').classList.add('show');
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    document.getElementById('installBtn').classList.remove('show');
    showToast('App instalado com sucesso!', 'success');
  });
}

async function instalarApp() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    deferredPrompt = null;
    document.getElementById('installBtn').classList.remove('show');
  }
}
