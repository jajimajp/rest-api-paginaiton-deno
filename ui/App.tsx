import React from "https://esm.sh/react@19";
import { useBooks } from "./useBooks.ts";

export function App() {
  const { books, createBook, deleteBook, loading } = useBooks();

  const submitBook = (formData: FormData) => {
    const title = formData.get("title")?.toString();
    if (!title || title.trim() === "") {
      console.error("Title is required");
      return;
    }
    createBook(title);
  };

  let list = <main>loading...</main>;
  if (!loading) {
    list = (
      <main>
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              {book.title}
              <button onClick={() => deleteBook(book.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  return (
    <>
      <header>
        <h1>Books</h1>
        <form action={submitBook}>
          <input name="title" />
          <button type="submit">Submit</button>
        </form>
      </header>
      {list}
    </>
  );
}
