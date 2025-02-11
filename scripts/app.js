// Fetch and display Pokémon data including sprite
async function fetchPokemon() {
    const name = document.getElementById("pokemonName").value.toLowerCase();
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${name}`;

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

        // Fetch and display the updated Pokémon data immediately
        loadLatestPokemon();
    } catch (error) {
        document.getElementById("pokemonData").innerHTML = "<p>Pokémon not found</p>";
    }
}

// Fetch and display the most recent Pokémon
async function loadLatestPokemon() {
    const response = await fetch("http://localhost:3000/pokemon");
    const data = await response.json();
    if (data.length > 0) {
        displayPokemon(data[0]);
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

// Event listener for the "Clear Data" button
document.getElementById("clearData").addEventListener("click", async () => {
    // Send a DELETE request to clear all Pokémon data
    await fetch("http://localhost:3000/pokemon", { method: "DELETE" });

    // Clear the displayed Pokémon
    document.getElementById("pokemonData").innerHTML = "<p>Pokémon data cleared.</p>";
});

// Load the latest Pokémon when the page loads
document.addEventListener("DOMContentLoaded", loadLatestPokemon);
