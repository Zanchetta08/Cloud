import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [filmes, setFilmes] = useState([]);
  const [salvos, setSalvos] = useState([]);

  // 🔹 Busca direto na OMDb API
  const buscarFilmes = async () => {
    const res = await fetch(`http://www.omdbapi.com/?apikey=27078fa9&s=${query}`);
    const data = await res.json();
    const lista = data.Search || [];
    setFilmes(lista);

    // 🔹 Envia para o backend salvar no MySQL
    if (lista.length > 0) {
      await fetch("http://192.168.100.2:3000/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lista),
      });
      console.log("Filmes enviados para o backend");
    }
  };

  // 🔹 Buscar filmes já salvos no banco
  const carregarFilmesSalvos = async () => {
    const res = await fetch("http://192.168.100.2:3000/api/filmes");
    const data = await res.json();
    setSalvos(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎬 Catálogo de Filmes</h1>

      <div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite um filme"
        />
        <button onClick={buscarFilmes}>Buscar na API</button>
        <button onClick={carregarFilmesSalvos}>Ver salvos no banco</button>
      </div>

      {/* Resultados da API */}
      <h2>📡 Resultados da API</h2>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {filmes.map((f, i) => (
          <div key={i} style={{ margin: "10px" }}>
            <img src={f.Poster} alt={f.Title} width="100" />
            <p>{f.Title} ({f.Year})</p>
          </div>
        ))}
      </div>

      {/* Filmes salvos no banco */}
      <h2>💾 Filmes no Banco de Dados</h2>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {salvos.map((f, i) => (
          <div key={i} style={{ margin: "10px" }}>
            <img src={f.poster} alt={f.titulo} width="100" />
            <p>{f.titulo} ({f.ano})</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
