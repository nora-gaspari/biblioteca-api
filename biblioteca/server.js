const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const livroRoutes = require('./routes/livroRoutes');
const dotenv = require('dotenv');

const server = () => {
    const app = express();
    const port = 3000;

    dotenv.config();
    if (!process.env.JWT_SECRET) {
        console.error("Erro: JWT_SECRET não está definido.");
        console.error("Conteúdo atual de process.env:", process.env);
        process.exit(1); // Encerra o processo com erro
    }

    app.use(bodyParser.json());
    app.use('/api/usuarios', userRoutes);
    app.use('/api/livros', livroRoutes);


    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });

}

server();