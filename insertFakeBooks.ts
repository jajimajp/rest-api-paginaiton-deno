#!/usr/bin/env -S deno run --allow-net

/** Insert fake books into the database.
 * Server must be running.
 */

import { faker } from "https://esm.sh/@faker-js/faker@v9.9.0";

let N = 50;
if (Deno.args.length > 0) {
  const n = parseInt(Deno.args[0]);
  if (!isNaN(n)) {
    console.log(`Inserting ${n} fake books...`);
    N = n;
  } else {
    console.error("Invalid number of books to insert. Using default: 50");
  }
}

console.log(`Inserting ${N} fake books...`);

for (let i = 0; i < N; i++) {
  const title = faker.book.title();
  fetch("http://localhost:8000/api/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to insert book: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(`Inserted book ${i + 1}: ${data.title}`);
    })
    .catch((err) => {
      console.error(`Error inserting book ${i + 1}: ${err.message}`);
    });
}
