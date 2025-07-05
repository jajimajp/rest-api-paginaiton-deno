/**
 * This file defines non-application-specific server logic.
 * It provides a way to start a server with a set of routes.
 */

export type RouteDef = [Request['method'], URLPattern, (req: Request) => Response | Promise<Response>];

/**
 * Starts a server with the given routes.
 * @param {RouteDef[]} routes - An array of route definitions.
*/
export function startServer(routes: RouteDef[]) {
  const handler = newRouter(routes)
  Deno.serve(
    { onListen: ({ port }) => console.log(`Server listening on port ${port}`) },
    handler
  );
}

/** Creates a new router with the given routes. */
function newRouter(routes: RouteDef[]): (req: Request) => Response | Promise<Response> {
  return (req: Request): Response | Promise<Response> => {
    for (const [method, pattern, handle] of routes) {
      const match = pattern.exec(req.url);
      if (match && req.method === method) {
        return handle(req);
      }
    }

    return new Response("Not found", { status: 404 });
  }
}

