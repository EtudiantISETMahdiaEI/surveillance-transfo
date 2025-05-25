const channelID = "2933717";
const readAPIKey = "6C7J88FPA3BL0998";
const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?results=20&api_key=${readAPIKey}`;

// Création des graphiques
let tempChart, currentChart, pressureChart, oilChart;

function fetchDataAndUpdateCharts() {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const feeds = data.feeds;

      const labels = feeds.map(feed => feed.created_at);
      const tempData = feeds.map(feed => parseFloat(feed.field1));
      const currentData = feeds.map(feed => parseFloat(feed.field2));
      const pressureData = feeds.map(feed => parseFloat(feed.field3));
      const oilData = feeds.map(feed => parseFloat(feed.field4));

      updateChart(tempChart, labels, tempData);
      updateChart(currentChart, labels, currentData);
      updateChart(pressureChart, labels, pressureData);
      updateChart(oilChart, labels, oilData);
    });
}

function updateChart(chart, labels, data) {
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();
}

function createChart(ctxId, label, color) {
  const ctx = document.getElementById(ctxId).getContext("2d");
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: label,
        data: [],
        borderColor: color,
        backgroundColor: "transparent",
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Temps" }},
        y: { title: { display: true, text: label }}
      }
    }
  });
}

// Initialisation des graphiques
window.onload = () => {
  tempChart = createChart("tempChart", "Température (°C)", "red");
  currentChart = createChart("currentChart", "Courant (A)", "blue");
  pressureChart = createChart("pressureChart", "Pression (bar)", "green");
  oilChart = createChart("oilChart", "Niveau d'huile (%)", "orange");

  fetchDataAndUpdateCharts();
  setInterval(fetchDataAndUpdateCharts, 10000); // actualisation chaque 10 sec
};
