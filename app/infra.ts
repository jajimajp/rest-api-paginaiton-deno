/** Infrastructure layer for the application.
 * This file implements the repository.
 */

import { Database } from "jsr:@db/sqlite";
import { ulid } from "jsr:@std/ulid@1";
import type { Book, BookRepository } from "./book.ts";

const db = new Database(":memory:");
db.exec(
  "create table if not exists book (id text primary key, title text not null)",
);

// seed
db.exec(
  "insert into book (id, title) values (?, ?)",
  ulid(),
  "Sample Book Title",
);

export const bookRepository: BookRepository = {
  listBooks() {
    const books = db.prepare("select * from book").all<Book>();
    return books;
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
