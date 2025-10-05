const sensores = [
  { nome: "Bomba Principal A1", setor: "Setor A - Sala de Bombas", status: "NORMAL", valor: 6.3, range: "0-10" },
  { nome: "Bomba Principal A1", setor: "Setor A - Sala de Bombas", status: "CRÍTICO", valor: 2.3, range: "0-10" },
  { nome: "Bomba Principal A1", setor: "Setor A - Sala de Bombas", status: "ALERTA", valor: 4.5, range: "0-10" },
];

const listContainer = document.getElementById("sensorList");

function renderSensores(lista) {
  listContainer.innerHTML = lista.map((s, index) => `
    <div class="sensor-card" data-index="${index}">
      <div class="sensor-info">
        <h3>${s.nome}</h3>
        <p>${s.setor}</p>
      </div>
      <div class="sensor-value">
        <strong>${s.valor}</strong>
        <span>mm/s</span>
        <div class="tag ${s.status.toLowerCase()}">${s.status}</div>
        <small>Range: ${s.range}</small>
      </div>
    </div>
  `).join('');

  const primeiroCard = document.querySelector('.sensor-card[data-index="0"]');
  if (primeiroCard) {
    primeiroCard.style.cursor = 'pointer';
    primeiroCard.addEventListener('click', () => {
      window.location.href = 'grafico.html';
    });
  }
}



renderSensores(sensores);
