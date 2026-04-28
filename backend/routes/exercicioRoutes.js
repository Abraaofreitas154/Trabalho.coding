const express = require('express');
const router = express.Router();
const exercicioController = require('../controllers/exercicioController');

// CRUD Completo
router.get('/', exercicioController.listar);
router.get('/grupos', exercicioController.listarGruposMusculares);
router.get('/:id', exercicioController.buscarPorId);
router.post('/', exercicioController.criar);
router.put('/:id', exercicioController.atualizar);
router.delete('/:id', exercicioController.remover);
router.patch('/:id/status', exercicioController.alternarStatus);

module.exports = router;

