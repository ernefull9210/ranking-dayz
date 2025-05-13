const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// RUTA A LOS ARCHIVOS JSON DEL MOD
const dataDir = 'I:/DayZServer/profile/GAREA_Leaderboard/PlayerDB';

app.use(express.static('public'));

app.get('/api/players', (req, res) => {
  fs.readdir(dataDir, (err, files) => {
    if (err) {
      console.error('Error leyendo carpeta:', err);
      return res.status(500).json({ error: 'No se pudo acceder a la carpeta del mod' });
    }

    const players = [];

    files.forEach(file => {
      if (!file.endsWith('.json')) return;

      const filePath = path.join(dataDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const player = JSON.parse(content);

        players.push({
          name: player.playerName || 'Desconocido',
          kills: player.playerKills || 0,
          deaths: player.playerDeaths || 0,
          longestKill: player.playerLongestDistance || 0,
          zombiesKilled: player.playerKillsZombie || 0
        });
      } catch (e) {
        console.warn(`⚠️ Error leyendo archivo ${file}:`, e.message);
      }
    });

    // Ordenar por kills
    players.sort((a, b) => b.kills - a.kills);

    res.json(players);
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
