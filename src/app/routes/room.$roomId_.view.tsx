import { Viewer } from "@/lib/viewer";
import usePartySocket from "partysocket/react";
import { useEffect, useRef } from "react";
import * as schema from "../../schema/message";
import type { Route } from "./+types/_app.room.$roomId";

export const loader = async ({ params }: Route.LoaderArgs) => {
  return { roomId: params.roomId };
};

export default ({ loaderData }: Route.ComponentProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewRef = useRef<Viewer | null>(null);

  const ws = usePartySocket({
    party: "room",
    room: loaderData.roomId,
    onMessage(e) {
      if (viewRef.current == null) return;

      const comment = schema.commentWithId.safeParse(JSON.parse(e.data));
      if (comment.data == null) return;

      viewRef.current.addMessage(comment.data.content);
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;

    const viewer = new Viewer(canvas);
    viewRef.current = viewer;
    viewer.start();
  }, []);

  return (
    <canvas ref={canvasRef} width={1920} height={1080} className="w-full" />
  );
};
