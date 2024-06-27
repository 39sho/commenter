import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { css } from "../../../../styled-system/css";
import { Center, HStack, Spacer, VStack } from "../../../../styled-system/jsx";
import { center } from "../../../../styled-system/patterns/center";
import { cq } from "../../../../styled-system/patterns/cq";

export const Route = createFileRoute("/_layout/comment/$room")({
    component: Comment,
});

function Comment() {
    const { room } = Route.useParams();
    const wsRef = useRef<WebSocket>();
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState<string[]>([]);

    useEffect(() => {
        const ws = new WebSocket(import.meta.env.VITE_WS_URL + "/_ws");

        wsRef.current = ws;

        ws.addEventListener("open", () => {
            ws.send(`room: ${room}`);
        });

        ws.addEventListener("message", (e: MessageEvent<string>) => {
            setCommentList((commentList) => [...commentList, e.data]);
        });

        return () => {
            ws.close();
        };
    }, [room]);

    return (
        <>
            <Center className={cq({})}>
                <VStack
                    justify="start"
                    className={css({
                        w: {
                            base: "100%",
                            "@/5xl": "50%",
                        },
                    })}
                >
                    <Spacer />
                    <VStack className={css({ w: "100%" })}>
                        {commentList.map((comment) => (
                            <div
                                className={css({
                                    w: "100%",
                                    overflowWrap: "break-word",
                                })}
                            >
                                {comment}
                            </div>
                        ))}
                    </VStack>
                    <HStack className={css({ w: "100%" })}>
                        <input
                            onChange={(e) => setComment(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.nativeEvent.isComposing) return;
                                if (e.key !== "Enter") return;

                                wsRef.current?.send(comment);
                                setComment("");
                            }}
                            value={comment}
                            type="text"
                            className={css({
                                border: "solid thin",
                                rounded: "sm",
                                p: 1,
                                w: "100%",
                            })}
                        ></input>
                        <button
                            type="button"
                            onClick={() => {
                                wsRef.current?.send(comment);
                                setComment("");
                            }}
                            className={center({
                                border: "solid thin",
                                rounded: "sm",
                                px: 2,
                                py: 1,
                                wordBreak: "keep-all",
                                flexGrow: 1,
                            })}
                        >
                            コメントする
                        </button>
                    </HStack>
                </VStack>
            </Center>
        </>
    );
}
