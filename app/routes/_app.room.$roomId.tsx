import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/_app.room.$roomId";

export const loader = async ({ params }: Route.LoaderArgs) => {
  return { roomId: params.roomId };
};

export default ({ loaderData }: Route.ComponentProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [comments, setComments] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const url = new URL("/api/ws", location.origin);
    url.searchParams.append("roomId", loaderData.roomId);
    const ws = new WebSocket(url);

    wsRef.current = ws;

    ws.addEventListener("message", (e: MessageEvent<string>) => {
      setComments([e.data, ...comments]);
    });

    return () => ws.close();
  }, [loaderData.roomId, comments]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <Card>
        <CardHeader>
          <CardTitle>部屋ID: {loaderData.roomId}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex gap-6">
            <Input
              type="text"
              id="roomId"
              autoComplete="off"
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              onClick={() => {
                const ws = wsRef.current;
                if (ws == null) return;

                if (comment !== "") ws.send(comment);
                setComment("");
              }}
            >
              送信
            </Button>
          </div>
          <Separator />
          <div>
            {comments.map((comment) => (
              <div key={comment}>{comment}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
