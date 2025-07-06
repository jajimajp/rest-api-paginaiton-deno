/**
 * Entry point for the application.
 * This file injects dependencies and starts the server.
 */
import { startServer } from "../app/server.ts";
import { newRouteDefs } from "./apis.ts";
import { bookRepository } from "./infra.ts";

const routeDefs = newRouteDefs(bookRepository);
startServer(routeDefs);
