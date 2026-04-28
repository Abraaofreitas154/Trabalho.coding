const mongoose = require('mongoose');

const exercicioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do exercício é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  grupoMuscular: {
    type: String,
    required: [true, 'Grupo muscular é obrigatório'],
    enum: {
      values: ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Abdômen', 'Glúteos', 'Panturrilha'],
      message: 'Grupo muscular inválido'
    }
  },
  series: {
    type: Number,
    required: [true, 'Número de séries é obrigatório'],
    min: [1, 'Mínimo 1 série'],
    max: [20, 'Máximo 20 séries']
  },
  repeticoes: {
    type: Number,
    required: [true, 'Número de repetições é obrigatório'],
    min: [1, 'Mínimo 1 repetição'],
    max: [100, 'Máximo 100 repetições']
  },
  carga: {
    type: Number,
    default: 0,
    min: [0, 'Carga não pode ser negativa']
  },
  descricao: {
    type: String,
    trim: true,
    maxlength: [500, 'Descrição deve ter no máximo 500 caracteres']
  },
  nivelDificuldade: {
    type: String,
    enum: ['Iniciante', 'Intermediário', 'Avançado'],
    default: 'Iniciante'
  },
  imagemUrl: {
    type: String,
    default: ''
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice para busca por nome
exercicioSchema.index({ nome: 'text', descricao: 'text' });

module.exports = mongoose.model('Exercicio', exercicioSchema);

