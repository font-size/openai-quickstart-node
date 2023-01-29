import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/ai/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/ai/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/ai/dog.png" className={styles.icon} />
        <p>I am your assistant, and helpful, creative, clever, and friendly</p>
        <h3>Type your questions</h3>
        <form onSubmit={onSubmit}>
          <textarea
            type="text"
            rows="5"
            name="animal"
            placeholder="Enter words"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="ask me" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
