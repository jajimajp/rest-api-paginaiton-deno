import type { Book } from "./types.d.ts";
import { useCallback, useEffect, useState } from "https://esm.sh/react@19";
import { booksApi } from "./api.ts";

type useBooksReturn = {
  books: Book[];
  createBook: (title: string) => void;
  deleteBook: (id: string) => void;
  loading: boolean;
  hasMore: boolean;
  goToNextPage: () =>
    | string
    | undefined; /* fetch next page and return current pageToken if exist */
  totalCount: number;
};

export function useBooks(
  pageToken: string | undefined = undefined,
): useBooksReturn {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(
    undefined,
  );
  const [totalCount, setTotalCount] = useState(0);

  const fetchBooks = useCallback(
    async (pageToken?: string, signal?: AbortSignal) => {
      setLoading(true);
      try {
        const response = await booksApi.fetchBooks(pageToken, signal);
        setBooks(response.books);
        setHasMore(response.has_more);
        setTotalCount(response.total_count);

        if (response.has_more && response.next_page_token) {
          setHasMore(true);
          setNextPageToken(response.next_page_token);
        }
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setBooks],
  );

  const goToNextPage = useCallback(() => {
    if (hasMore && nextPageToken) {
      fetchBooks(nextPageToken);
      return nextPageToken;
    }
  }, [hasMore, fetchBooks, nextPageToken]);

  const createBook = useCallback(async (title: string) => {
    if (!title || title.trim() === "") {
      console.error("Title is required");
      return;
    }
    setLoading(true);
    try {
      await booksApi.createBook(title);
      // After creating a book, fetch the first page again
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
      // After deleting a book, fetch the current page again
      fetchBooks();
    } catch (err) {
      console.error("Failed to delete book:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchBooks]);

  useEffect(() => {
    const controller = new AbortController();
    fetchBooks(pageToken, controller.signal);
    return () => controller.abort();
  }, [pageToken, fetchBooks]);

  return {
    books,
    createBook,
    deleteBook,
    loading,
    hasMore,
    goToNextPage,
    totalCount,
  };
}
