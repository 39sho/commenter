import {
  type Connection,
  Server,
  type WSMessage,
  routePartykitRequest,
} from "partyserver";
import { createRequestHandler } from "react-router";
import { decodeTime, ulid } from "ulid";
import * as schema from "../schema/message";

export class Room extends Server {
  static options = { hibernate: true };
  async onMessage(connection: Connection, message: WSMessage) {
    if (typeof message !== "string") return;
    const comment = schema.comment.safeParse(JSON.parse(message));

    if (comment.data == null) return;
    const commentWithId = {
      ...comment.data,
      id: ulid(),
    } satisfies schema.CommentWithId;

    this.broadcast(JSON.stringify(commentWithId));

    const roomId = connection.server;
    await this.ctx.storage.put(`${roomId}:${commentWithId.id}`, commentWithId);
  }
  async getComments(roomId: string) {
    const commentMap = await this.ctx.storage.list<schema.CommentWithId>({
      prefix: roomId,
    });

    const comment = [...commentMap.values()].sort(
      (a, b) => decodeTime(b.id) - decodeTime(a.id),
    );

    return comment;
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
