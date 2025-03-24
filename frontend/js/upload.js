// Seleciona o formulário de upload no HTML e adiciona um "ouvinte de eventos" que será acionado quando o formulário for enviado
document.querySelector("#uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita o comportamento padrão do formulário, que seria recarregar a página ao enviar

    // Seleciona o campo de upload de foto no formulário
    const photoInput = document.querySelector("#photo");

    // Obtém o "username" salvo previamente no navegador (durante o login) usando o sessionStorage
    const username = sessionStorage.getItem("username"); 

    // Verifica se nenhum arquivo foi selecionado para upload
    if (!photoInput.files[0]) {
        alert("Selecione uma foto antes de enviar!"); // Exibe um alerta avisando para selecionar uma foto
        return; // Sai da função sem fazer nada
    }

    // Cria um objeto FormData para enviar os dados como se fossem de um formulário HTML
    const formData = new FormData();
    formData.append("photo", photoInput.files[0]); // Adiciona o arquivo de foto no FormData
    formData.append("username", username); // Adiciona o username no FormData para associar o upload ao usuário

    try {
        // Envia a requisição HTTP para a rota /upload no backend
        const response = await fetch("http://localhost:3000/upload", {
            method: "POST", // Método POST é usado para envio de dados
            body: formData, // Envia o FormData contendo a foto e o username
        });

        // Verifica se a resposta do servidor foi bem-sucedida
        if (response.ok) {
            const data = await response.json(); // Converte a resposta do servidor para JSON
            alert(data.message); // Exibe uma mensagem de sucesso para o usuário
            window.location.href = data.redirect; // Redireciona o usuário para a galeria de fotos
        } else {
            // Se o servidor retornar erro, exibe um alerta de erro
            alert("Erro ao enviar a foto!");
        }
    } catch (error) {
        // Captura qualquer erro (como problemas de conexão) e exibe no console do navegador
        console.error("Erro no envio:", error);
    }
});


/*

    Explicação Parte a Parte
    
    Ouvinte de Evento no Formulário (submit):
    Este evento é acionado quando o usuário tenta enviar o formulário de upload.
    O método e.preventDefault() impede o recarregamento da página, permitindo que o script lide com o envio.
    
    Campos do Formulário:
    photoInput: Captura o arquivo selecionado para upload.
    username: Obtém o nome de usuário que foi salvo no navegador durante o login usando o sessionStorage.
    
    Validação:
    Verifica se o campo de upload está vazio (nenhum arquivo selecionado).
    Caso esteja vazio, exibe um alerta e interrompe o processo.
    
    Uso do FormData:
    Cria um objeto FormData para simular um envio de formulário.
    Adiciona a foto e o username ao FormData.
    
    Requisição HTTP (fetch):
    Envia os dados (foto e username) para a rota /upload do backend.
    Configura o método POST e usa o FormData como corpo da requisição.
    
    Resposta do Servidor:
    Caso de sucesso (response.ok): Converte a resposta do servidor para JSON, exibe uma mensagem de sucesso e redireciona o usuário para a galeria de fotos.
    Caso de erro: Exibe um alerta indicando que houve falha no upload.
    Tratamento de Erros (catch):
    Captura erros que podem ocorrer durante a requisição (ex.: problemas de conexão com o servidor).
    Exibe o erro no console do navegador para depuração.

    Finalidade
    Este código é responsável por:
    Capturar o arquivo selecionado pelo usuário e enviá-lo ao backend.
    Associar o arquivo ao usuário que está logado (usando o username).
    Garantir que, após o upload, o usuário seja redirecionado para a página apropriada (galeria de fotos).

*/