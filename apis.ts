import { BookRepository } from "./book.ts";
import type { RouteDef } from "./server.ts";

/** Route definitions with handlers which can be injected with a repository */
type RawRouteDef = [Request['method'], URLPattern, HandlerGenerator];
type HandlerGenerator = (repo: BookRepository) => (req: Request) => Response | Promise<Response>;

const listBooks: HandlerGenerator = (repo: BookRepository) => (_req: Request): Response => {
  const books = repo.listBooks();
  return new Response(JSON.stringify(books), { headers: { "Content-Type": "application/json" } });
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
  return new Response(JSON.stringify(book), { headers: { "Content-Type": "application/json" } });
}

const createBook: HandlerGenerator = (repo: BookRepository) => async (req: Request): Promise<Response> => {
  try {
    const body = await req.json();
    if (!body.title || typeof body.title !== 'string') {
      return new Response("Bad request: title is required", { status: 400 });
    }
    const book = repo.createBook(body.title);
    return new Response(JSON.stringify(book), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (_error) {
    return new Response("Bad request: invalid JSON", { status: 400 });
  }
}

/** Route definitions for books */
const ROUTES : RawRouteDef[] =
  [ ["GET", new URLPattern({ pathname: "/books" }),     listBooks]
  , ["GET", new URLPattern({ pathname: "/books/" }),    listBooks]
  , ["GET", new URLPattern({ pathname: "/books/:id" }), showBook]
  , ["POST", new URLPattern({ pathname: "/books" }),    createBook]
  , ["POST", new URLPattern({ pathname: "/books/" }),   createBook]
  ]

export function newRouteDefs(repo: BookRepository): RouteDef[] {
  return ROUTES.map(([method, pattern, handler]) => [method, pattern, handler(repo)]);
}
