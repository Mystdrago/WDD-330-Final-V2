// Fetch and display Pokémon data including sprite and abilities
async function fetchPokemon() {
    const randomId = Math.floor(Math.random() * 898) + 1; // Pokémon IDs range from 1 to 898
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${randomId}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Pokémon not found");

        const data = await response.json();
        const abilities = data.abilities.map(a => a.ability.name).join(", ");
        const pokemon = {
            name: data.name,
            id: data.id,
            height: data.height,
            weight: data.weight,
            types: data.types.map(t => t.type.name),
            abilities: abilities,
            sprite: data.sprites.front_default
        };

        // Save the latest Pokémon in localStorage
        saveToLocalStorage(pokemon);
        displayPokemon(pokemon);
    } catch (error) {
        document.getElementById("pokemonData").innerHTML = "<p>Pokémon not found</p>";
    }
}

// Display Pokémon data including sprite and abilities
function displayPokemon(data) {
    document.getElementById("pokemonData").innerHTML = `
        <h2>${data.name.toUpperCase()}</h2>
        <img src="${data.sprite}" alt="${data.name}" class="pokemon-image"/>
        <p>Type: ${data.types.join(', ')}</p>
        <p>Height: ${data.height}</p>
        <p>Weight: ${data.weight}</p>
        <p>Abilities: ${data.abilities}</p>
    `;
}

// Save Pokémon to localStorage and maintain last 3 searches
function saveToLocalStorage(pokemon) {
    let history = JSON.parse(localStorage.getItem("pokemonHistory")) || [];
    history.unshift(pokemon);
    if (history.length > 3) history.pop(); // Keep only the last 3 Pokémon
    localStorage.setItem("pokemonHistory", JSON.stringify(history));
}

// Load last Pokémon on page load
document.addEventListener("DOMContentLoaded", fetchPokemon);

// Button to fetch a new random Pokémon
document.getElementById("searchButton").addEventListener("click", fetchPokemon);

// Hover event to highlight Pokémon data
document.getElementById("pokemonData").addEventListener("mouseover", () => {
    document.getElementById("pokemonData").classList.add("hover-highlight");
});

document.getElementById("pokemonData").addEventListener("mouseleave", () => {
    document.getElementById("pokemonData").classList.remove("hover-highlight");
});

// Keyboard event to fetch a Pokémon when spacebar is pressed
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        fetchPokemon();
    }
});
