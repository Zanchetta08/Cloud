const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  // Conexão MySQL
  const db = await mysql.createConnection({
    host: "192.168.31.129", // IP da VM do MySQL
    user: "user",           // usuário que você criou
    password: "123",        // senha do usuário
    database: "meu_banco"
  });

  console.log("✅ Conectado ao MySQL");

  // Rota para SALVAR filmes (frontend envia via POST)
  app.post("/api/save", async (req, res) => {
    try {
      const filmes = req.body;
      for (let f of filmes) {
        await db.execute(
          "INSERT INTO filmes (titulo, ano, poster) VALUES (?, ?, ?)",
          [f.Title, f.Year, f.Poster]
        );
      }
      res.json({ message: "Filmes salvos no banco" });
    } catch (err) {
      console.error("Erro ao salvar filmes:", err);
      res.status(500).json({ error: "Erro ao salvar filmes" });
    }
  });

  // Rota para LISTAR filmes já salvos
  app.get("/api/filmes", async (req, res) => {
    try {
      const [rows] = await db.execute("SELECT * FROM filmes");
      res.json(rows);
    } catch (err) {
      console.error("Erro ao buscar filmes:", err);
      res.status(500).json({ error: "Erro ao buscar filmes" });
    }
  });

  app.listen(3000, () => console.log("🚀 Back rodando na porta 3000"));
})();
