import { useState } from "react";
import Button from "../../components/button/Button";
import buttonStyles from "../../components/button/Button.module.css";
import styles from "./ApiExample.module.css";

// A page that demonstrates how to fetch data from an API in React.
function ApiExample() {
  // State to hold the fetched Pokemon's name and image URL.
  // In React, state is a way to store and manage data that can change over time.
  // When the state updates, the component re-renders to reflect the new data.
  const [pokemon, setPokemon] = useState<{
    name: string;
    image: string;
  } | null>(null);

  // Fetches a random Pokemon from the PokeAPI and updates the state with its name and image.
  function fetchPokemon() {
    const id = Math.floor(Math.random() * 151) + 1;
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemon({
          name: data.name,
          image: data.sprites.front_default,
        });
      });
  }

  return (
    <div className="page">
      {/* Title and subtitle */}
      <h1 className={styles.title}>Fetching an API</h1>
      <p className={styles.subtitle}>
        A quick example of how to fetch data from an API in React.
      </p>

      {/* Instructions section */}
      <div className={styles.content}>
        <div className={styles.steps}>
          <h2>How it works</h2>
          <ol>
            <li>
              <strong>Pick an API</strong>: find a public API you want to use,
              like <code>https://pokeapi.co/api/v2/pokemon/1</code>
            </li>
            <li>
              <strong>Call fetch</strong>: use <code>fetch(url)</code> to make a
              request to that API endpoint.
            </li>
            <li>
              <strong>Parse the response</strong>: the response comes back as
              raw data, so call <code>.then(res =&gt; res.json())</code> to
              convert it into a JavaScript object.
            </li>
            <li>
              <strong>Use the data</strong>: pull out the fields you need from
              the response and display them on the page.
            </li>
          </ol>
        </div>

        {/* Demo section */}
        <div className={styles.demo}>
          <h2>Try it out</h2>
          {/* This section shows the fetched Pokemon's image and name, or a placeholder if no Pokemon has been fetched yet. */}
          <div className={styles.preview}>
            {pokemon ? (
              <>
                <img src={pokemon.image} alt={pokemon.name} />
                <p className={styles.pokemonName}>{pokemon.name}</p>
              </>
            ) : (
              <p className={styles.placeholder}>
                Press the button to fetch a Pokemon!
              </p>
            )}
          </div>
          {/* Button to trigger the fetchPokemon function */}
          <button className={buttonStyles.button} onClick={fetchPokemon}>
            Fetch Pokemon
          </button>
        </div>
      </div>

      {/* Button to go back to the home page */}
      <div className={styles.centered}>
        <Button text="Back to Home" to="/" />
      </div>
    </div>
  );
}

export default ApiExample;
