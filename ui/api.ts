import type { Book, PaginatedBooksResponse } from "./types.d.ts";

export const booksApi = {
  async fetchBooks(
    pageToken?: string,
    signal?: AbortSignal,
  ): Promise<PaginatedBooksResponse> {
    const params = new URLSearchParams();
    params.set("limit", "20");
    if (pageToken) {
      params.set("page_token", pageToken);
    }

    const options = signal ? { signal } : {};
    const res = await fetch(`/api/books?${params}`, options);
    if (!res.ok) {
      throw new Error("Request failed");
    }
    return res.json();
  },

  async createBook(title: string, signal?: AbortSignal): Promise<Book> {
    const options: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    };
    if (signal) {
      options.signal = signal;
    }
    const res = await fetch("/api/books", options);
    if (!res.ok) {
      throw new Error("Request failed");
    }
    return res.json();
  },

  async deleteBook(id: string, signal?: AbortSignal): Promise<void> {
    const options: RequestInit = { method: "DELETE" };
    if (signal) {
      options.signal = signal;
    }
    const res = await fetch(`/api/books/${id}`, options);
    if (!res.ok) {
      throw new Error("Request failed");
    }
  },
};
