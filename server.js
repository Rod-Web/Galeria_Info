// Importação dos módulos necessários
const express = require("express"); // Framework para criar o servidor e gerenciar rotas
const multer = require("multer"); // Biblioteca para lidar com uploads de arquivos (como fotos)
const fs = require("fs"); // Módulo para manipular arquivos no sistema (ler e escrever JSON)
const cors = require("cors"); // Permite que o servidor aceite requisições de outros domínios
const path = require("path"); // Trabalha com caminhos de arquivos e pastas de forma multiplataforma

// Inicialização do servidor e configuração da porta
const app = express(); // Inicia o servidor Express
const port = 3000; // Define a porta onde o servidor rodará (http://localhost:3000)

// Configuração do Multer para gerenciar o upload de arquivos
const storage = multer.diskStorage({
    // Define onde os arquivos serão salvos
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Salva os arquivos na pasta "uploads"
    },
    // Define como os arquivos serão nomeados
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Cria um nome único (timestamp + número aleatório)
        const fileExtension = path.extname(file.originalname); // Obtém a extensão original do arquivo (.png, .jpg, etc.)
        cb(null, `${uniqueSuffix}${fileExtension}`); // Combina o nome único com a extensão
    }
});
const upload = multer({ storage: storage }); // Configura o Multer para usar o armazenamento definido acima

// Carrega o arquivo JSON que contém as informações dos usuários
let users = require("./users.json"); // Lê o arquivo "users.json" e o transforma em um objeto JavaScript

// Middlewares globais
app.use(cors()); // Permite que o servidor aceite requisições de outras origens (CORS)
app.use(express.json()); // Permite que o servidor interprete requisições com corpo no formato JSON
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Torna a pasta "uploads" acessível via URL
app.use(express.static("frontend")); // Torna a pasta "frontend" acessível, servindo os arquivos HTML, CSS e JS

// Rota para login
app.post("/login", (req, res) => {
    const { username, password } = req.body; // Extrai os dados de "username" e "password" do corpo da requisição
    const user = users.find(u => u.username === username && u.password === password); // Procura o usuário no JSON que tenha o mesmo username e password

    if (!user) { // Se não encontrar o usuário
        return res.status(401).send("Credenciais inválidas."); // Retorna status 401 (não autorizado) com uma mensagem
    }

    // Verifica se o usuário já enviou uma foto
    if (user.img) {
        res.json({ redirect: "/gallery.html" }); // Retorna uma URL para redirecionar o usuário para a galeria
    } else {
        res.json({ redirect: "/upload.html" }); // Retorna uma URL para redirecionar o usuário para a página de upload
    }
});

// Rota para upload de imagens
app.post("/upload", upload.single("photo"), (req, res) => {
    const { username } = req.body; // Extrai o username do corpo da requisição
    const user = users.find(u => u.username === username); // Procura o usuário no JSON que corresponda ao username

    if (user) { // Se o usuário for encontrado
        const normalizedPath = req.file.path.replace(/\\/g, "/"); // Normaliza o caminho do arquivo para usar barras "/" (importante no Windows)
        user.img = normalizedPath; // Atualiza o campo "img" no JSON do usuário com o caminho do arquivo

        // Salva as alterações no arquivo "users.json"
        fs.writeFile("./users.json", JSON.stringify(users, null, 2), (err) => {
            if (err) { // Se ocorrer um erro ao salvar o arquivo
                console.error("Erro ao salvar no arquivo users.json:", err); // Exibe o erro no console
                return res.status(500).send("Erro ao salvar os dados do usuário."); // Retorna status 500 (erro interno)
            }

            // Se tudo correr bem, retorna uma mensagem de sucesso e redireciona para a galeria
            res.json({ message: "Foto enviada com sucesso!", redirect: "/gallery.html" });
        });
    } else {
        res.status(404).send("Usuário não encontrado."); // Retorna status 404 (não encontrado) se o usuário não existir
    }
});

// Rota para obter a lista de usuários
app.get("/users", (req, res) => {
    res.json(users); // Retorna a lista de usuários (e suas imagens) no formato JSON
});

// Inicializa o servidor na porta definida
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`); // Exibe no console que o servidor está rodando
});


/*

    Resumo do que cada parte faz:
    
    Importação e configuração:
    Importa módulos importantes para trabalhar com o servidor, uploads, arquivos e caminhos.
    Configura Multer para lidar com uploads de imagens, salvando-as em uploads/ com nomes únicos.
    Middlewares globais:
    Habilitam CORS, manipulação de JSON e servem as pastas públicas (uploads/ e frontend/).
    
    Rotas principais:
    Login (/login): Valida as credenciais e redireciona para upload ou galeria.
    Upload (/upload): Processa o upload da imagem e salva o caminho no users.json.
    Lista de usuários (/users): Retorna os dados de todos os usuários, incluindo os caminhos das imagens.


*/