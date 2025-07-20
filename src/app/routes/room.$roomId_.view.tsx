import { Viewer } from "@/lib/viewer";
import { useEffect, useRef } from "react";
import type { Route } from "./+types/_app.room.$roomId";

export const loader = async ({ params }: Route.LoaderArgs) => {
  return { roomId: params.roomId };
};

export default ({ loaderData }: Route.ComponentProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const viewer = new Viewer(canvas);
    viewer.start();

    const url = new URL("/api/ws", location.origin);
    url.searchParams.append("roomId", loaderData.roomId);
    const ws = new WebSocket(url);

    wsRef.current = ws;

    ws.addEventListener("message", (e: MessageEvent<string>) => {
      viewer.addMessage(e.data);
    });

    return () => ws.close();
  }, [loaderData.roomId]);

  return (
    <canvas ref={canvasRef} width={1920} height={1080} className="w-full" />
  );
};
