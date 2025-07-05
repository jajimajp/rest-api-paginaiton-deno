/** Infrastructure layer for the application.
 * This file implements the repository.
 */

import { Database } from "jsr:@db/sqlite";
import { ulid } from "jsr:@std/ulid@1";
import type { Book, BookRepository } from "./book.ts";

const db = new Database(":memory:");
db.exec(
  "create table if not exists book (id text primary key)"
)

// seed
db.exec(
  "insert into book (id) values (?)",
  ulid(),
);

export const bookRepository: BookRepository = {
  listBooks() {
    const books = db.prepare("select * from book").all<Book>();
    return books;
  }
};
