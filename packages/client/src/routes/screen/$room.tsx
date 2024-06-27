import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { css } from "../../../styled-system/css";

import { Viewer } from "viewer";

export const Route = createFileRoute("/screen/$room")({
    component: Comment,
});

function Comment() {
    const { room } = Route.useParams();
    const wsRef = useRef<WebSocket>();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const ws = new WebSocket(import.meta.env.VITE_WS_URL + "/_ws");
        if (canvasRef.current != null) {
            const viewer = new Viewer(canvasRef.current);
            viewer.start();
            ws.addEventListener("message", (e: MessageEvent<string>) => {
                viewer.addMessage(e.data);
            });
        }

        wsRef.current = ws;

        ws.addEventListener("open", () => {
            ws.send(`room: ${room}`);
        });

        return () => {
            ws.close();
        };
    }, [room]);

    return (
        <>
            <canvas
                ref={canvasRef}
                height="2160"
                width="4096"
                className={css({ w: "100%" })}
            ></canvas>
            {/*
            <button
                onClick={() => canvasRef.current?.requestFullscreen()}
                className={css({ border: "solid thin", rounded: "sm", p: 1 })}
            >
                fullscreen
            </button>
            */}
        </>
    );
}
