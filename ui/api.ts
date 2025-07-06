import type { Book } from "./types.d.ts";

export const booksApi = {
  async fetchBooks(signal?: AbortSignal): Promise<Book[]> {
    const options = signal ? { signal } : {};
    const res = await fetch("/api/books", options);
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
