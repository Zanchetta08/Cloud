const express = require("express");
const mysql = require("mysql2/promise");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexão MySQL
(async () => {
  const db = await mysql.createConnection({
    host: "192.168.31.129",
    user: "user",
    password: "123",
    database: "meu_banco"
  });

  // Rota de busca de filmes
  app.get("/api/search", async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Faltou parâmetro q" });

    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=27078fa9&s=${query}`);
      const data = await response.json();

      if (data.Search) {
        for (let f of data.Search) {
          await db.execute(
            "INSERT INTO filmes (titulo, ano, poster) VALUES (?, ?, ?)",
            [f.Title, f.Year, f.Poster]
          );
        }
      }

      res.json(data.Search || []);
    } catch (err) {
      res.status(500).json({ error: "Erro na busca" });
    }
  });

  app.listen(3000, () => console.log("Back rodando na porta 3000"));
})();
