// Generate a random Pokémon ID between 1 and 1010 (as per Pokédex)
function getRandomPokemonId() {
    return Math.floor(Math.random() * 1010) + 1;
}

// Fetch and display Pokémon data using a random ID
async function fetchPokemonById(id) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Pokémon not found");

        const data = await response.json();
        const pokemon = {
            name: data.name,
            id: data.id,
            height: data.height,
            weight: data.weight,
            types: data.types.map(t => t.type.name),
            sprite: data.sprites.front_default
        };

        // Send data to backend to save as the most recent Pokémon
        await fetch("http://localhost:3000/pokemon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pokemon)
        });

        // Display the Pokémon
        displayPokemon(pokemon);
    } catch (error) {
        document.getElementById("pokemonData").innerHTML = "<p>Pokémon not found</p>";
    }
}

// Display Pokémon data including sprite
function displayPokemon(data) {
    document.getElementById("pokemonData").innerHTML = `
        <h2>${data.name.toUpperCase()}</h2>
        <img src="${data.sprite}" alt="${data.name}" />
        <p>Type: ${data.types.join(', ')}</p>
        <p>Height: ${data.height}</p>
        <p>Weight: ${data.weight}</p>
    `;
}

// Event listener for the "Get Random Pokémon" button
document.getElementById("randomButton").addEventListener("click", () => {
    const randomId = getRandomPokemonId();
    fetchPokemonById(randomId);
});

// Load a random Pokémon when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const randomId = getRandomPokemonId();
    fetchPokemonById(randomId);
});

// Event listener for the "Clear Data" button
document.getElementById("clearData").addEventListener("click", async () => {
    await fetch("http://localhost:3000/pokemon", { method: "DELETE" });

    // Clear the displayed Pokémon
    document.getElementById("pokemonData").innerHTML = "<p>Pokémon data cleared.</p>";
});
