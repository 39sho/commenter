import {
  type Connection,
  Server,
  type WSMessage,
  routePartykitRequest,
} from "partyserver";
import { createRequestHandler } from "react-router";
import * as schema from "../schema/message";

export class Room extends Server {
  static options = { hibernate: true };
  onMessage(_connection: Connection, message: WSMessage) {
    const id = crypto.randomUUID();
    const comment = schema.comment.safeParse({ id, content: message });
    if (comment.data == null) return;

    this.broadcast(JSON.stringify(comment.data));
  }
}

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    return (
      // @ts-expect-error
      (await routePartykitRequest(request, env)) ??
      (await requestHandler(request, {
        cloudflare: { env, ctx },
      }))
    );
  },
} satisfies ExportedHandler<Env>;
