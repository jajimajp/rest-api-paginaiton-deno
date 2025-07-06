/** Infrastructure layer for the application.
 * This file implements the repository.
 */

import { Database } from "jsr:@db/sqlite";
import { ulid } from "jsr:@std/ulid@1";
import type {
  Book,
  BookRepository,
  PaginatedBooksResponse,
  PaginationParams,
} from "./book.ts";
import { faker } from "https://esm.sh/@faker-js/faker@v9.9.0";

const db = new Database(":memory:");
db.exec(
  "create table if not exists book (id text primary key, title text not null)",
);

// seed
for (let i = 0; i < 100; i++) {
  db.exec(
    "insert into book (id, title) values (?, ?)",
    ulid(),
    faker.book.title(),
  );
}

export const bookRepository: BookRepository = {
  listBooks(params?: PaginationParams): PaginatedBooksResponse {
    const limit = Math.min(params?.limit || 20, 100);
    const pageToken = params?.pageToken;

    // Get total count
    const totalCount =
      db.prepare("select count(*) as count from book").get<{ count: number }>()
        ?.count || 0;

    // Build query with cursor-based pagination
    let query = "select * from book";
    const queryParams: string[] = [];

    if (pageToken) {
      query += " where id > ?";
      queryParams.push(pageToken);
    }

    query += " order by id limit ?";
    queryParams.push((limit + 1).toString());

    // Fetch one extra item to determine if there are more results
    const books = db.prepare(query).all<Book>(...queryParams);

    const hasMore = books.length > limit;
    const resultBooks = hasMore ? books.slice(0, limit) : books;
    const nextPageToken = hasMore
      ? resultBooks[resultBooks.length - 1].id
      : undefined;

    return {
      books: resultBooks,
      nextPageToken,
      hasMore,
      totalCount,
      pageSize: resultBooks.length,
    };
  },
  showBook(id: string): Book | undefined {
    const book = db.prepare("select * from book where id = ?").get<Book>(id);
    return book;
  },
  createBook(title: string): Book {
    const id = ulid();
    db.exec("insert into book (id, title) values (?, ?)", id, title);
    return { id, title };
  },
  updateBook(id: string, title: string): Book | undefined {
    const count = db.prepare("update book set title = ? where id = ?").run(
      title,
      id,
    );
    if (count > 0) {
      return { id, title };
    }
    return undefined;
  },
  deleteBook(id: string): boolean {
    const count = db.prepare("delete from book where id = ?").run(id);
    return count > 0;
  },
};
