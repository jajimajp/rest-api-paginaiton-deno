import type { Book } from "./types.d.ts";
import { useCallback, useEffect, useState } from "https://esm.sh/react@19";
import { booksApi } from "./api.ts";

type useBooksReturn = {
  books: Book[];
  createBook: (title: string) => void;
  deleteBook: (id: string) => void;
  loading: boolean;
};

export function useBooks(): useBooksReturn {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const fetchedBooks = await booksApi.fetchBooks(signal);
      setBooks(fetchedBooks);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setBooks]);

  const createBook = useCallback(async (title: string) => {
    if (!title || title.trim() === "") {
      console.error("Title is required");
      return;
    }
    setLoading(true);
    try {
      await booksApi.createBook(title);
      fetchBooks();
    } catch (err) {
      console.error("Failed to create book:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchBooks]);

  const deleteBook = useCallback(async (id: string) => {
    if (!id) {
      console.error("ID is required to delete a book");
      return;
    }
    setLoading(true);
    try {
      await booksApi.deleteBook(id);
      fetchBooks();
    } catch (err) {
      console.error("Failed to delete book:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchBooks]);

  useEffect(() => {
    const controller = new AbortController();
    fetchBooks(controller.signal);
    return () => controller.abort();
  }, [fetchBooks]);

  return { books, createBook, deleteBook, loading };
}
