import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  const db = await mysql.createConnection({
    host: "192.168.31.132",
    user: "user",
    password: "123",
    database: "meu_banco"
  });

  console.log("Conectado ao MySQL");

  app.post("/api/save", async (req, res) => {
    try {
      const filmes = req.body;
      console.log("Recebi filmes do front:", filmes);
      for (let f of filmes) {
        await db.execute(
          "INSERT IGNORE INTO filmes (titulo, ano, poster) VALUES (?, ?, ?)",
          [f.Title, f.Year, f.Poster]
        );
      }
      res.json({ message: "Filmes salvos no banco" });
    } catch (err) {
      console.error("Erro ao salvar filmes:", err);
      res.status(500).json({ error: "Erro ao salvar filmes" });
    }
  });

  app.get("/api/filmes", async (req, res) => {
    try {
      const [rows] = await db.execute("SELECT * FROM filmes");
      res.json(rows);
    } catch (err) {
      console.error("Erro ao buscar filmes:", err);
      res.status(500).json({ error: "Erro ao buscar filmes" });
    }
  });

  app.listen(3000, '0.0.0.0', () => console.log("🚀 Back rodando na porta 3000"));
})();
