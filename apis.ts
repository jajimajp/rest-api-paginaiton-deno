import { BookRepository } from "./book.ts";
import type { RouteDef } from "./server.ts";

/** Route definitions with handlers which can be injected with a repository */
type RawRouteDef = [Request['method'], URLPattern, HandlerGenerator];
type HandlerGenerator = (repo: BookRepository) => (req: Request) => Response | Promise<Response>;

const listBooks: HandlerGenerator = (repo: BookRepository) => (_req: Request): Response => {
  const books = repo.listBooks();
  return new Response(JSON.stringify(books));
}

/** Route definitions for books */
const ROUTES : RawRouteDef[] =
  [ ["GET", new URLPattern({ pathname: "/books" }),  listBooks]
  , ["GET", new URLPattern({ pathname: "/books/" }), listBooks]
  ]

export function newRouteDefs(repo: BookRepository): RouteDef[] {
  return ROUTES.map(([method, pattern, handler]) => [method, pattern, handler(repo)]);
}