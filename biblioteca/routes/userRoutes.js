const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verificarToken = require('../middlewares/authMiddleware');

router.post('/cadastrar', userController.cadastrarUsuario);
router.post('/login', userController.loginUsuario);
router.put('/alterar', verificarToken, userController.alterarUsuario);
router.get('/install', userController.criarAdmin);

module.exports = router;