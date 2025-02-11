const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;
const DATA_FILE = "./data/pokemonData.json";

app.use(express.json());
app.use(cors());

// Get the most recent Pokémon (if any)
app.get("/pokemon", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error reading file" });
        res.json(JSON.parse(data));
    });
});

// Store only the most recent Pokémon (overwrite file)
app.post("/pokemon", (req, res) => {
    const newPokemon = req.body;

    fs.writeFile(DATA_FILE, JSON.stringify([newPokemon], null, 2), (err) => {
        if (err) return res.status(500).json({ error: "Error writing file" });
        res.json({ message: "Pokémon saved", pokemon: newPokemon });
    });
});

// Clear all stored Pokémon data (reset the JSON file)
app.delete("/pokemon", (req, res) => {
    fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), (err) => {
        if (err) return res.status(500).json({ error: "Error clearing data" });
        res.json({ message: "Pokémon data cleared" });
    });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
