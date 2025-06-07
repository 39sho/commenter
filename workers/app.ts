import { DurableObject } from "cloudflare:workers";
import { Hono } from "hono";
import { createRequestHandler } from "react-router";

export class Room extends DurableObject {
  async fetch(_request: Request) {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    this.ctx.acceptWebSocket(server);

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    for (const conection of this.ctx.getWebSockets()) {
      conection.send(message);
    }
  }

  async webSocketClose(
    ws: WebSocket,
    code: number,
    _reason: string,
    _wasClean: boolean,
  ) {
    ws.close(code);
  }
}

const app = new Hono<{ Bindings: Env }>();

app.get("/api/ws", (c) => {
  const upgradeHeader = c.req.header("Upgrade");
  if (upgradeHeader == null || upgradeHeader !== "websocket") {
    return c.text("expected Upgrade", 426);
  }

  const roomId = c.req.query("roomId");
  if (roomId == null) {
    return c.text("missing roomId", 400);
  }

  const id = c.env.ROOM.idFromName(roomId);
  const room = c.env.ROOM.get(id);

  return room.fetch(c.req.raw);
});

app.all("*", (c) => {
  const requestHandler = createRequestHandler(
    () => import("virtual:react-router/server-build"),
    import.meta.env.MODE,
  );

  return requestHandler(c.req.raw, {
    cloudflare: { env: c.env, ctx: c.executionCtx },
  });
});

export default app;
