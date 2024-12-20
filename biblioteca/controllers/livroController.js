const fs = require('fs');
const path = require('path');

const livrosFile = path.join(__dirname, '..', 'data', 'livros.json');

// função para adicionar os livro
const adicionarLivro = (req, res) => {
    const { titulo, autor, ano, genero, status } = req.body;
    let livros = JSON.parse(fs.readFileSync(livrosFile));
    const newBook = { id: Date.now(), titulo, autor, ano, genero, status: status || 'disponível' };
    livros.push(newBook);
    fs.writeFileSync(livrosFile, JSON.stringify(livros));
    res.status(201).json({ message: "Livro adicionado com sucesso" });
};

// função para listar livros
const listarLivros = (req, res) => {
    let livros = JSON.parse(fs.readFileSync(livrosFile));
    const limite = parseInt(req.query.limite) || 5;
    const pagina = parseInt(req.query.pagina) || 1;
    const startIndex = (pagina - 1) * limite;
    const endIndex = startIndex + limite;
    const paginatedBooks = livros.slice(startIndex, endIndex);
    res.json(paginatedBooks);
};

module.exports = { adicionarLivro, listarLivros };