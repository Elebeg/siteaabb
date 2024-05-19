// Função para carregar e exibir as reservas na página de reservas
function loadReservas() {
    console.log('Carregando reservas...');
    const tableBody = document.querySelector('#reservasTable tbody');
    if (!tableBody) {
        console.error('Elemento tbody da tabela não encontrado.');
        return;
    }

    fetch('/api/reservas')
        .then(response => {
            console.log('Resposta recebida:', response);
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos:', data);
            tableBody.innerHTML = ''; // Limpa o conteúdo existente da tabela
            data.reservas.forEach(reserva => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${reserva.nome}</td>
                    <td>${reserva.instalacao}</td>
                    <td>${reserva.data}</td>
                    <td>${reserva.hora}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar reservas:', error);
        });
}

// Aguarda o carregamento completo da página antes de chamar a função loadReservas()
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname === '/reservas.html') {
        loadReservas();
    }
});

// Event listener para o formulário de reserva
document.getElementById('reservaForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const instalacao = document.getElementById('instalacao').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;

    fetch('/reservar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, instalacao, data, hora })
    })
    .then(response => {
        console.log('Resposta da reserva recebida:', response);
        return response.json();
    })
    .then(data => {
        console.log('Dados da reserva recebidos:', data);
        if (data.success) {
            alert('Reserva realizada com sucesso!');
            // Após a reserva ser realizada com sucesso, recarrega as reservas na página de reservas
            loadReservas();
        } else {
            alert('Erro na reserva: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro na reserva');
    });
});
