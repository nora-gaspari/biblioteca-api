const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        console.error('Erro ao verificar o token:', err.message);
        return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = verificarToken;
