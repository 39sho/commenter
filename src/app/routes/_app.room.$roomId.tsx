import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import usePartySocket from "partysocket/react";
import { useState } from "react";
import * as schema from "../../schema/message";
import type { Route } from "./+types/_app.room.$roomId";

export const loader = async ({ params }: Route.LoaderArgs) => {
  return { roomId: params.roomId };
};

export default ({ loaderData }: Route.ComponentProps) => {
  const [comments, setComments] = useState<schema.Comment[]>([]);
  const [comment, setComment] = useState("");

  const ws = usePartySocket({
    party: "room",
    room: loaderData.roomId,
    onMessage(e) {
      const comment = schema.comment.safeParse(JSON.parse(e.data));
      if (comment.data == null) return;

      setComments([comment.data, ...comments]);
    },
  });

  const sendComment = () => {
    if (comment !== "") ws.send(comment);
    setComment("");
  };

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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendComment();
                }
              }}
            />
            <Button onClick={sendComment}>送信</Button>
          </div>
          <Separator />
          <div>
            {comments.map((comment) => (
              <div key={comment.id}>{comment.content}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
