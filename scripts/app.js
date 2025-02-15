// Fetch and display 10 random Pokémon
async function fetchMultiplePokemon() {
    const pokemonArray = [];
    const promises = []; // Store promises to fetch multiple Pokémon in parallel

    for (let i = 0; i < 10; i++) {
        const randomId = Math.floor(Math.random() * 898) + 1; // Pokémon IDs range from 1 to 898
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${randomId}`;
        
        // Fetch Pokémon data asynchronously
        promises.push(fetch(apiUrl).then(response => response.json()));
    }

    try {
        const results = await Promise.all(promises); // Wait for all fetch calls

        results.forEach(data => {
            const abilities = data.abilities.map(a => a.ability.name).join(", ");
            const stats = data.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join("<br>");
            
            const pokemon = {
                name: data.name,
                id: data.id,
                height: data.height,
                weight: data.weight,
                types: data.types.map(t => t.type.name).join(", "),
                abilities: abilities,
                sprite: data.sprites.front_default,
                base_experience: data.base_experience,
                moves: data.moves.length,
                stats: stats
            };

            pokemonArray.push(pokemon);
        });

        displayMultiplePokemon(pokemonArray);
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
    }
}

// Display multiple Pokémon in the DOM
function displayMultiplePokemon(pokemonList) {
    const container = document.getElementById("pokemonData");
    container.innerHTML = ""; // Clear previous results

    pokemonList.forEach(pokemon => {
        const pokemonDiv = document.createElement("div");
        pokemonDiv.classList.add("pokemon-card");
        pokemonDiv.innerHTML = `
            <h2>${pokemon.name.toUpperCase()} (#${pokemon.id})</h2>
            <img src="${pokemon.sprite}" alt="${pokemon.name}" class="pokemon-image"/>
            <p><strong>Type:</strong> ${pokemon.types}</p>
            <p><strong>Height:</strong> ${pokemon.height}</p>
            <p><strong>Weight:</strong> ${pokemon.weight}</p>
            <p><strong>Abilities:</strong> ${pokemon.abilities}</p>
            <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
            <p><strong>Available Moves:</strong> ${pokemon.moves}</p>
            <p><strong>Stats:</strong> <br>${pokemon.stats}</p>
        `;
        container.appendChild(pokemonDiv);
    });
}

// Attach event listener to the correct button
document.getElementById("randomButton").addEventListener("click", fetchMultiplePokemon);

// Load 10 Pokémon on page load
document.addEventListener("DOMContentLoaded", fetchMultiplePokemon);
