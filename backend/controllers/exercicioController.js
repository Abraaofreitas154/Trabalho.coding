const Exercicio = require('../models/Exercicio');

// Listar todos (com filtros opcionais)
exports.listar = async (req, res) => {
  try {
    const { grupo, nivel, busca, ativo } = req.query;
    const filtro = {};

    if (grupo) filtro.grupoMuscular = grupo;
    if (nivel) filtro.nivelDificuldade = nivel;
    if (ativo !== undefined) filtro.ativo = ativo === 'true';
    if (busca) filtro.$text = { $search: busca };

    const exercicios = await Exercicio.find(filtro).sort({ createdAt: -1 });
    res.json({ sucesso: true, quantidade: exercicios.length, dados: exercicios });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: error.message });
  }
};

// Buscar por ID
exports.buscarPorId = async (req, res) => {
  try {
    const exercicio = await Exercicio.findById(req.params.id);
    if (!exercicio) return res.status(404).json({ sucesso: false, mensagem: 'Exercício não encontrado' });
    res.json({ sucesso: true, dados: exercicio });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: error.message });
  }
};

// Criar
exports.criar = async (req, res) => {
  try {
    const exercicio = await Exercicio.create(req.body);
    res.status(201).json({ sucesso: true, mensagem: 'Exercício criado com sucesso', dados: exercicio });
  } catch (error) {
    res.status(400).json({ sucesso: false, mensagem: error.message });
  }
};

// Atualizar
exports.atualizar = async (req, res) => {
  try {
    const exercicio = await Exercicio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!exercicio) return res.status(404).json({ sucesso: false, mensagem: 'Exercício não encontrado' });
    res.json({ sucesso: true, mensagem: 'Exercício atualizado com sucesso', dados: exercicio });
  } catch (error) {
    res.status(400).json({ sucesso: false, mensagem: error.message });
  }
};

// Remover
exports.remover = async (req, res) => {
  try {
    const exercicio = await Exercicio.findByIdAndDelete(req.params.id);
    if (!exercicio) return res.status(404).json({ sucesso: false, mensagem: 'Exercício não encontrado' });
    res.json({ sucesso: true, mensagem: 'Exercício removido com sucesso' });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: error.message });
  }
};

// Alternar status ativo/inativo
exports.alternarStatus = async (req, res) => {
  try {
    const exercicio = await Exercicio.findById(req.params.id);
    if (!exercicio) return res.status(404).json({ sucesso: false, mensagem: 'Exercício não encontrado' });
    
    exercicio.ativo = !exercicio.ativo;
    await exercicio.save();
    
    res.json({ sucesso: true, mensagem: `Exercício ${exercicio.ativo ? 'ativado' : 'desativado'}`, dados: exercicio });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: error.message });
  }
};

// Listar grupos musculares disponíveis
exports.listarGruposMusculares = async (req, res) => {
  const grupos = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Abdômen', 'Glúteos', 'Panturrilha'];
  res.json({ sucesso: true, dados: grupos });
};

