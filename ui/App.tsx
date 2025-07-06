import React, { useEffect } from "https://esm.sh/react@19";
import { useBooks } from "./useBooks.ts";
import { useQueryParams } from "./useQueryParams.ts";

export function App() {
  const { searchParams, updateURL } = useQueryParams();
  const pageToken = searchParams.get("pageToken");
  const {
    books,
    createBook,
    deleteBook,
    loading,
    hasMore,
    goToNextPage: goToNextPageBase,
    totalCount,
  } = useBooks(pageToken ?? undefined);

  const goToNextPage = () => {
    const pageToken = goToNextPageBase();
    if (pageToken !== undefined) {
      searchParams.delete("pageToken");
      searchParams.set("pageToken", pageToken);
      updateURL(searchParams);
    }
  };

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
        <div style={{ marginBottom: "1rem" }}>
          <p>Total books: {totalCount}</p>
        </div>
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
      <footer>
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={goToNextPage}
            disabled={!hasMore}
          >
            Next
          </button>
        </div>
      </footer>
    </>
  );
}
