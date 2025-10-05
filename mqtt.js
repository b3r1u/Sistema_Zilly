const host = "wss://70a91475181f45cf86092509c2a53f61.s1.eu.hivemq.cloud:8884/mqtt";
const options = { username: "zilly_device", password: "Zilly123", keepalive: 60, reconnectPeriod: 1000 };
const client = mqtt.connect(host, options);

const topicoSincrono   = "led/sincrono";
const topicoAssincrono = "led/assincrono";

const labels = [];
const freqValues = [];
const velValues = [];
const assincronoValues = [];

const freqCtx = document.getElementById("freqChart").getContext("2d");
const freqChart = new Chart(freqCtx, {
  type: "line",
  data: { labels, datasets: [{ label: "Frequência (Hz)", data: freqValues, borderColor: "rgba(255, 99, 132, 1)", backgroundColor: "rgba(255, 99, 132, 0.2)", tension: 0.3 }] },
  options: { responsive: true, maintainAspectRatio: false, scales: { x: { title: { display: true, text: "Tempo (mensagens)" }}, y: { title: { display: true, text: "Hz" }}}}
});

const velCtx = document.getElementById("velChart").getContext("2d");
const velChart = new Chart(velCtx, {
  type: "line",
  data: { labels, datasets: [{ label: "Velocidade (mm/s)", data: velValues, borderColor: "rgba(54, 162, 235, 1)", backgroundColor: "rgba(54, 162, 235, 0.2)", tension: 0.3 }] },
  options: { responsive: true, maintainAspectRatio: false, scales: { x: { title: { display: true, text: "Tempo (mensagens)" }}, y: { title: { display: true, text: "mm/s" }}}}
});

const assincronoCtx = document.getElementById("assincronoChart").getContext("2d");
const assincronoChart = new Chart(assincronoCtx, {
  type: "line",
  data: {
    labels,
    datasets: [{ label: "Co-relação (Freq * Vel)", data: assincronoValues, borderColor: "rgba(75, 192, 192, 1)", backgroundColor: "rgba(75, 192, 192, 0.2)", tension: 0.3 }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: "Tempo (mensagens)" }},
      y: { title: { display: true, text: "Valor Co-relacionado" }}
    }
  }
});

const backBtn = document.querySelector('.back-btn');
backBtn.addEventListener('click', () => window.history.back());

client.on("connect", () => {
  console.log("Conectado ao HiveMQ Cloud via WebSocket!");
  [topicoSincrono, topicoAssincrono].forEach(topic => {
    client.subscribe(topic, err => { if (!err) console.log(`Inscrito no tópico ${topic}`); });
  });
});

client.on("message", (topic, message) => {
  const msg = message.toString();
  console.log(`Mensagem recebida [${topic}]: ${msg}`);

  if (topic === topicoSincrono) {
    const freqMatch = msg.match(/Freq:\s*([\d.]+)/);
    const velMatch  = msg.match(/Vel:\s*([\d.]+)/);
    if (freqMatch && velMatch) {
      const timestamp = new Date().toLocaleTimeString();
      const freq = parseFloat(freqMatch[1]);
      const vel  = parseFloat(velMatch[1]);

      labels.push(timestamp);
      freqValues.push(freq);
      velValues.push(vel);

      assincronoValues.push(freq * vel);

      if (labels.length > 20) {
        labels.shift();
        freqValues.shift();
        velValues.shift();
        assincronoValues.shift();
      }

      freqChart.update();
      velChart.update();
      assincronoChart.update();
    }
  }
});
