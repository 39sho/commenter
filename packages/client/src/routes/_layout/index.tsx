import { Link, createFileRoute } from "@tanstack/react-router";
import { css } from "../../../styled-system/css";
import { Center, HStack, VStack } from "../../../styled-system/jsx";
import { cq } from "../../../styled-system/patterns/cq";
import { useState } from "react";
import { center } from "../../../styled-system/patterns/center";

export const Route = createFileRoute("/_layout/")({
    component: Index,
});

function Index() {
    const [roomName, setRoomName] = useState("");

    return (
        <Center className={cq({})}>
            <VStack
                className={css({
                    p: 3,
                    w: {
                        base: "100%",
                        "@/5xl": "50%",
                    },
                })}
            >
                <div className={css({ w: "100%" })}>
                    <label>ルーム名</label>
                    <input
                        onChange={(e) => setRoomName(e.target.value)}
                        value={roomName}
                        type="text"
                        className={css({
                            border: "solid thin",
                            rounded: "sm",
                            p: 1,
                            w: "100%",
                        })}
                    ></input>
                </div>
                <HStack className={css({ w: "100%" })}>
                    <Link
                        to="/comment/$room"
                        params={{
                            room: roomName === "" ? "test-room" : roomName,
                        }}
                        className={center({
                            border: "solid thin",
                            rounded: "sm",
                            p: 1,
                            wordBreak: "keep-all",
                            flexGrow: 1,
                        })}
                    >
                        コメントをする
                    </Link>
                    <Link
                        to="/screen/$room"
                        params={{
                            room: roomName === "" ? "test-room" : roomName,
                        }}
                        target="_blank"
                        className={center({
                            border: "solid thin",
                            rounded: "sm",
                            p: 1,
                            wordBreak: "keep-all",
                            flexGrow: 1,
                        })}
                    >
                        コメントを見る
                    </Link>
                </HStack>
            </VStack>
        </Center>
    );
}
