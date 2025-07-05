import { Database } from "jsr:@db/sqlite";
import { ulid } from "jsr:@std/ulid@1";

const db = new Database(":memory:");
db.exec(
  "create table if not exists book (id text primary key)"
)

// seed
db.exec(
  "insert into book (id) values (?)",
  ulid(),
);

function listBooks(_req: Request): Response {
  const books = db.prepare("select * from book").all();
  return new Response(JSON.stringify(books));
}

type Handler = (req: Request) => Response | Promise<Response>;
type RouteDef = [Request['method'], URLPattern, Handler];
const ROUTES : RouteDef[] =
  [ ["GET", new URLPattern({ pathname: "/books" }),  listBooks]
  , ["GET", new URLPattern({ pathname: "/books/" }), listBooks]
  ]

function handle(req: Request): Response | Promise<Response> {
  for (const [method, pattern, handle] of ROUTES) {
    const match = pattern.exec(req.url);
    if (match && req.method === method) {
      return handle(req);
    }
  }

  return new Response("Not found", { status: 404 });
}

Deno.serve(
  { onListen: ({ port }) => console.log(`Server listening on port ${port}`) },
  handle
);

