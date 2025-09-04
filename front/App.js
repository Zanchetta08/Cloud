import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [filmes, setFilmes] = useState([]);

  const buscarFilmes = async () => {
    const res = await fetch(`http://www.omdbapi.com/?apikey=27078fa9&s=${query}`);
    const data = await res.json();
    setFilmes(data.Search || []);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎬 Catálogo de Filmes</h1>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Digite um filme"
      />
      <button onClick={buscarFilmes}>Buscar</button>

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {filmes.map((f, i) => (
          <div key={i} style={{ margin: "10px" }}>
            <img src={f.Poster} alt={f.Title} width="100" />
            <p>{f.Title} ({f.Year})</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
