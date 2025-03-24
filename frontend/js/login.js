// Seleciona o botão de login no HTML e adiciona um "ouvinte de eventos" que será acionado quando o botão for clicado
document.querySelector("#login-btn").addEventListener("click", async () => {
    // Obtém os valores digitados nos campos de username e password do formulário
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    try {
        // Envia uma requisição HTTP para a rota /login no backend
        const response = await fetch("http://localhost:3000/login", {
            method: "POST", // Método HTTP usado para enviar os dados (POST é usado para criar/envios)
            headers: { "Content-Type": "application/json" }, // Diz ao servidor que o corpo da requisição está no formato JSON
            body: JSON.stringify({ username, password }) // Converte os dados do usuário para JSON e os envia no corpo da requisição
        });

        if (response.ok) { // Verifica se a resposta do servidor tem status de sucesso (200-299)
            const data = await response.json(); // Extrai os dados JSON da resposta
            sessionStorage.setItem("username", username); // Salva o username no "sessionStorage" do navegador para uso posterior
            window.location.href = data.redirect; // Redireciona o usuário para a página retornada pelo servidor (ex.: /gallery.html ou /upload.html)
        } else {
            // Se o servidor retornar erro (como 401), exibe uma mensagem de erro no HTML
            document.getElementById("error-message").textContent = "Credenciais inválidas!";
        }
    } catch (error) {
        // Captura qualquer erro que possa ocorrer (ex.: problema de conexão) e o exibe no console
        console.error("Erro no login:", error);
    }
});

// Seleciona o botão de visitante no HTML e adiciona um "ouvinte de eventos" que será acionado quando clicado
document.querySelector("#visit-btn").addEventListener("click", () => {
    // Redireciona diretamente o visitante para a página da galeria
    window.location.href = "gallery.html";
});

/*

    Explicação Parte a Parte

    Ação ao clicar no botão de login (#login-btn):
    Captura os valores de username e password do formulário.
    Envia uma requisição para o backend na rota /login:
    Método POST: Para enviar dados.
    Envia os valores no formato JSON.
    Verifica a resposta do servidor:
    Se a resposta for bem-sucedida, redireciona o usuário conforme o retorno (página de galeria ou upload).
    Em caso de erro (credenciais inválidas), exibe uma mensagem de erro no HTML.
    Ação ao clicar no botão de visitante (#visit-btn):
    Redireciona diretamente o visitante para a página gallery.html, sem necessidade de login.

    
    Finalidade

    Este código é responsável por:
    Realizar a comunicação entre o frontend (interface do usuário) e o backend (servidor).
    Validar as credenciais do usuário no servidor.
    Gerenciar o fluxo de navegação:
    Usuário autenticado é redirecionado para a página apropriada.
    Visitantes acessam diretamente a galeria.

*/