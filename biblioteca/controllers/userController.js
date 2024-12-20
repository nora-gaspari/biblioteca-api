const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');


const usuariosFile = path.join(__dirname, '..', 'data', 'usuarios.json');

//função para cadastrar um usuário
const cadastrarUsuario = (req, res) => {
    const { nome, email, senha, papel } = req.body;

    // Verificar se o arquivo existe e tem conteúdo
    if (!fs.existsSync(usuariosFile)) {
        return res.status(500).json({ message: 'Arquivo de usuários não encontrado' });
    }

    let usuarios;
    try {
        // Tente ler o arquivo e fazer o parse
        const data = fs.readFileSync(usuariosFile, 'utf8');
        usuarios = data ? JSON.parse(data) : []; // Se o arquivo estiver vazio, inicializa com um array vazio
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao ler ou processar o arquivo de usuários', error: error.message });
    }

    // Verificar se o usuário já existe
    if (usuarios.find(user => user.email === email)) {
        return res.status(400).json({ message: "Usuário já existe" });
    }

    // Criar um novo usuário
    const hashedPassword = bcrypt.hashSync(senha, 10);
    const newUser = { id: Date.now(), nome, email, senha: hashedPassword, papel: papel || 'usuario' };
    usuarios.push(newUser);

    // Tentar gravar no arquivo
    try {
        fs.writeFileSync(usuariosFile, JSON.stringify(usuarios, null, 2));
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao salvar o novo usuário', error: error.message });
    }

    res.status(201).json({ message: "Usuário criado com sucesso" });
};

//função para login de usuário
const loginUsuario = (req, res) => {
    const { email, senha } = req.body;
    let usuarios = JSON.parse(fs.readFileSync(usuariosFile));
    const usuario = usuarios.find(user => user.email === email);
    if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }
    if (!bcrypt.compareSync(senha, usuario.senha)) {
        return res.status(401).json({ message: "Senha incorreta" });
    }
    console.log(process.env.JWT_SECRET)
    const token = jwt.sign({ id: usuario.id, papel: usuario.papel }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });


};


//função para alterar os dados do usuário
const alterarUsuario = (req, res) => {
    const { nome, email } = req.body;
    let usuarios = JSON.parse(fs.readFileSync(usuariosFile));
    let usuario = usuarios.find(user => user.id === req.user.id);
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });
    usuario.nome = nome || usuario.nome;
    usuario.email = email || usuario.email;
    fs.writeFileSync(usuariosFile, JSON.stringify(usuarios));
    res.json({ message: "Dados alterados com sucesso" });
};

//função para criar um usuário admin
const criarAdmin = (req, res) => {
    let usuarios = JSON.parse(fs.readFileSync(usuariosFile));
    const adminExistente = usuarios.some(user => user.papel === 'admin');
    if (!adminExistente) {
        const admin = {
            id: Date.now(),
            nome: 'Admin',
            email: 'admin@biblioteca.com',
            senha: bcrypt.hashSync('admin123', 10),
            papel: 'admin'
        };
        usuarios.push(admin);
        fs.writeFileSync(usuariosFile, JSON.stringify(usuarios));
        return res.status(201).json({ message: "Administrador criado com sucesso!" });
    }
    res.status(400).json({ message: "Administrador já existe" });
};

module.exports = { cadastrarUsuario, loginUsuario, alterarUsuario, criarAdmin };