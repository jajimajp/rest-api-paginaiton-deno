import { BookRepository } from "./book.ts";
import type { RouteDef } from "./server.ts";

/** Route definitions with handlers which can be injected with a repository */
type RawRouteDef = [Request['method'], URLPattern, HandlerGenerator];
type HandlerGenerator = (repo: BookRepository) => (req: Request) => Response | Promise<Response>;

const listBooks: HandlerGenerator = (repo: BookRepository) => (_req: Request): Response => {
  const books = repo.listBooks();
  return new Response(JSON.stringify(books));
}

const SHOW_BOOK_URL_PATTERN = new URLPattern({ pathname: "/books/:id" });
const showBook: HandlerGenerator = (repo: BookRepository) => (req: Request): Response => {
  const match = SHOW_BOOK_URL_PATTERN.exec(req.url);
  if (!match) {
    return new Response("Not found", { status: 404 });
  }
  const id = match.pathname.groups.id
  if (!id) {
    return new Response("Not found", { status: 404 });
  }
  const book = repo.showBook(id);
  if (!book) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(JSON.stringify(book));
}

/** Route definitions for books */
const ROUTES : RawRouteDef[] =
  [ ["GET", new URLPattern({ pathname: "/books" }),     listBooks]
  , ["GET", new URLPattern({ pathname: "/books/" }),    listBooks]
  , ["GET", new URLPattern({ pathname: "/books/:id" }), showBook]
  ]

export function newRouteDefs(repo: BookRepository): RouteDef[] {
  return ROUTES.map(([method, pattern, handler]) => [method, pattern, handler(repo)]);
}