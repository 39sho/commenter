import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUsername } from "@/lib/username";
import usePartySocket from "partysocket/react";
import { useState } from "react";
import * as schema from "../../schema/message";
import type { Route } from "./+types/_app.room.$roomId";

export const loader = async ({ params, context }: Route.LoaderArgs) => {
  const roomId = params.roomId;

  const id = context.cloudflare.env.ROOM.idFromName(roomId);
  const room = context.cloudflare.env.ROOM.get(id);
  const comments = await room.getComments(roomId);

  return { roomId: params.roomId, comments };
};

export default ({ loaderData }: Route.ComponentProps) => {
  const [comments, setComments] = useState<schema.CommentWithId[]>(
    loaderData.comments,
  );
  const [commentInput, setCommentInput] = useState("");

  const { username } = useUsername();

  const ws = usePartySocket({
    party: "room",
    room: loaderData.roomId,
    onMessage(e) {
      const comment = schema.commentWithId.safeParse(JSON.parse(e.data));
      if (comment.data == null) return;

      setComments([comment.data, ...comments]);
    },
  });

  const sendComment = () => {
    if (commentInput === "") return;
    const comment = {
      content: commentInput,
      user: username,
    } satisfies schema.Comment;
    ws.send(JSON.stringify(comment));
    setCommentInput("");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col gap-8">
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
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendComment();
                }
              }}
            />
            <Button onClick={sendComment}>送信</Button>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <div key={comment.id}>
            <Card>
              <CardContent>
                <div className="flex">
                  <div>{comment.content}</div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end">{comment.user}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
