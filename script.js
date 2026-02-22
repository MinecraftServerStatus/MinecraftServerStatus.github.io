let refreshInterval;

async function checkServer() {
  const server = document.getElementById("serverInput").value.trim();
  if (!server) return alert("サーバーアドレスを入力してください");

  document.getElementById("serverName").innerText = server;

  fetchStatus(server);

  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(() => fetchStatus(server), 30000);
}

async function fetchStatus(server) {
  try {
    const response = await fetch(`https://api.mcsrvstat.us/2/${server}`);
    const data = await response.json();

    const statusElement = document.getElementById("serverStatus");
    const infoElement = document.getElementById("serverInfo");

    if (data.online) {
      statusElement.innerText = "🟢 ONLINE";
      statusElement.className = "online";

      infoElement.innerHTML = `
        バージョン: ${data.version || "不明"}<br>
        プレイヤー: ${data.players?.online || 0} / ${data.players?.max || 0}<br>
        MOTD: ${data.motd?.clean?.join(" ") || "なし"}
      `;
    } else {
      statusElement.innerText = "🔴 OFFLINE";
      statusElement.className = "offline";
      infoElement.innerHTML = "サーバーはオフラインです";
    }

  } catch (error) {
    document.getElementById("serverStatus").innerText = "エラー";
    document.getElementById("serverStatus").className = "offline";
    document.getElementById("serverInfo").innerHTML = "取得に失敗しました";
  }
}
