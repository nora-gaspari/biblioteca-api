const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');
const verificarToken = require('../middlewares/authMiddleware');

router.post('/adicionar', verificarToken, livroController.adicionarLivro);
router.get('/listar', livroController.listarLivros);

module.exports = router;