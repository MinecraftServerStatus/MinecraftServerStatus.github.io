const serverList = document.getElementById("serverList");
const favoritesContainer = document.getElementById("favorites");
const historyContainer = document.getElementById("history");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

function saveData() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
  localStorage.setItem("history", JSON.stringify(history));
}

function addServer() {
  const address = document.getElementById("serverInput").value.trim();
  const edition = document.getElementById("edition").value;
  if (!address) return;

  fetchServer(address, edition, serverList);

  if (!history.includes(address)) {
    history.unshift(address);
    history = history.slice(0, 10);
  }
  renderHistory();
  saveData();
}

async function fetchServer(address, edition, container) {
  const port = edition === "bedrock" ? "?port=19132" : "";
  const res = await fetch(`https://api.mcsrvstat.us/3/${address}${port}`);
  const data = await res.json();

  const card = document.createElement("div");
  card.className = "server-card";

  const icon = data.icon ? `<img src="${data.icon}">` : "";

  const status = data.online ?
    `<div class="status-online">● ONLINE</div>` :
    `<div class="status-offline">● OFFLINE</div>`;

  const ping = (edition === "java" && data.debug?.ping) ?
    `Ping: ${data.debug.ping}ms<br>` : "";

  card.innerHTML = `
    <div class="favorite-btn" onclick="toggleFavorite('${address}','${edition}')">
      ${favorites.find(f=>f.address===address) ? "⭐" : "☆"}
    </div>
    ${icon}
    <h3>${address}</h3>
    ${status}
    ${ping}
    Players: ${data.players?.online||0}/${data.players?.max||0}<br>
    Version: ${data.version||"不明"}
  `;

  container.prepend(card);
}

function toggleFavorite(address, edition) {
  const index = favorites.findIndex(f=>f.address===address);
  if (index >= 0) {
    favorites.splice(index,1);
  } else {
    favorites.push({address,edition});
  }
  saveData();
  renderFavorites();
}

function renderFavorites() {
  favoritesContainer.innerHTML="";
  favorites.forEach(f=>{
    fetchServer(f.address,f.edition,favoritesContainer);
  });
}

function renderHistory() {
  historyContainer.innerHTML="";
  history.forEach(addr=>{
    const div=document.createElement("div");
    div.className="server-card";
    div.innerHTML=`<h4>${addr}</h4>`;
    div.onclick=()=>fetchServer(addr,"java",serverList);
    historyContainer.appendChild(div);
  });
}

renderFavorites();
renderHistory();
