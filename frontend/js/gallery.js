// Função assíncrona para buscar os dados da galeria no servidor
async function fetchGallery() {
    try {
        // Faz uma requisição HTTP para obter a lista de usuários (dados do JSON) do servidor
        const response = await fetch("http://localhost:3000/users");
        
        // Verifica se a resposta do servidor foi bem-sucedida
        if (!response.ok) throw new Error("Erro ao carregar a galeria."); 
        // Se o status não for 200-299, lança um erro que será tratado no catch

        // Converte a resposta do servidor (JSON) para um objeto JavaScript
        const users = await response.json();

        // Seleciona o elemento HTML onde os cartões da galeria serão exibidos
        const gallery = document.querySelector("#gallery");

        // Percorre a lista de usuários recebida do servidor
        users.forEach(user => {
            if (user.img) { // Verifica se o usuário possui uma imagem associada
                // Cria um elemento de cartão para exibir as informações do usuário
                const card = document.createElement("div");
                card.className = "card"; // Adiciona uma classe "card" ao elemento (para estilização)

                // Cria um elemento de imagem para exibir a foto do usuário
                const img = document.createElement("img");
                img.src = `http://localhost:3000/${user.img}`; // Define o caminho da imagem com base no JSON
                img.alt = `Foto de ${user.username}`; // Define um texto alternativo (alt) descritivo para acessibilidade
                console.log("Caminho da imagem:", img.src); // Exibe o caminho gerado da imagem no console para depuração

                // Cria um elemento de parágrafo para exibir o nome do usuário
                const name = document.createElement("p");
                name.textContent = user.username; // Define o nome do usuário como texto do parágrafo

                // Adiciona a imagem e o nome ao cartão
                card.appendChild(img);
                card.appendChild(name);

                // Adiciona o cartão à galeria (no elemento HTML selecionado)
                gallery.appendChild(card);
            }
        });
    } catch (error) {
        // Captura e exibe qualquer erro que ocorra durante o processo
        console.error("Erro ao carregar a galeria:", error);
    }
}

// Configura a execução da função "fetchGallery" quando a página é carregada
document.addEventListener("DOMContentLoaded", fetchGallery);
// "DOMContentLoaded" garante que o DOM está totalmente carregado antes de executar a função


/*

    Explicação Detalhada
    Função fetchGallery():

    Busca os dados dos usuários (incluindo os caminhos das imagens) do backend através da rota /users.
    Processa os dados e cria dinamicamente os elementos HTML para exibir os usuários e suas fotos na página.

    Requisição ao Servidor:
    A função usa fetch() para buscar os dados do servidor.
    Se a resposta do servidor não for bem-sucedida (!response.ok), a função lança um erro que é tratado no bloco catch.

    Gerenciamento de Imagens e Nomes:
    Para cada usuário com uma imagem associada (if (user.img)), cria-se:
    Um cartão (div) com a classe card.
    Uma imagem (img) com o caminho especificado no JSON.
    Um parágrafo (p) para exibir o nome do usuário.

    Adição ao DOM:
    Os elementos criados (imagem e nome) são adicionados dentro do cartão.
    O cartão é adicionado ao elemento principal da galeria (#gallery).

    Tratamento de Erros:
    Qualquer erro durante a busca ou processamento dos dados é capturado no bloco catch e exibido no console para depuração.
    Execução no Carregamento da Página:
    A função fetchGallery() é executada assim que o DOM estiver carregado, garantindo que o elemento #gallery já existe na página antes da manipulação.

    Finalidade
    Este código é responsável por:
    Buscar os dados dos usuários no servidor.
    Criar dinamicamente os cartões (contendo imagem e nome) para cada usuário com uma foto associada.
    Adicionar esses cartões à galeria na página HTML.
*/