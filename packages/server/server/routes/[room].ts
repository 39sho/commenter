const html = String.raw;

const response = (name: string) => html`<!--

MIT License

Copyright (c) Pooya Parsa <pooya@pi0.io>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

Bundled with https://github.com/websockets/ws

Copyright (c) 2011 Einar Otto Stangvik <einaros@gmail.com>
Copyright (c) 2013 Arnout Kazemier and contributors
Copyright (c) 2016 Luigi Pinca and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

-->

    <!DOCTYPE html>
    <html lang="en" data-theme="dark">
        <head>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <title>CrossWS Test Page</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                body {
                    background-color: #1a1a1a;
                }
            </style>
            <script type="module">
                // https://github.com/vuejs/petite-vue
                import {
                    createApp,
                    reactive,
                    nextTick,
                } from "https://esm.sh/petite-vue@0.4.1";

                let ws;

                const store = reactive({
                    message: "",
                    messages: [],
                });

                const scroll = () => {
                    nextTick(() => {
                        const el = document.querySelector("#messages");
                        el.scrollTop = el.scrollHeight;
                        el.scrollTo({
                            top: el.scrollHeight,
                            behavior: "smooth",
                        });
                    });
                };

                const format = async () => {
                    for (const message of store.messages) {
                        if (!message._fmt && message.text.startsWith("{")) {
                            message._fmt = true;
                            const { codeToHtml } = await import(
                                "https://esm.sh/shiki@1.0.0"
                            );
                            const str = JSON.stringify(
                                JSON.parse(message.text),
                                null,
                                2
                            );
                            message.formattedText = await codeToHtml(str, {
                                lang: "json",
                                theme: "dark-plus",
                            });
                        }
                    }
                };

                const log = (user, ...args) => {
                    console.log("[ws]", user, ...args);
                    store.messages.push({
                        text: args.join(" "),
                        formattedText: "",
                        user: user,
                        date: new Date().toLocaleString(),
                    });
                    scroll();
                    format();
                };

                const connect = async () => {
                    const isSecure = location.protocol === "https:";
                    const url =
                        (isSecure ? "wss://" : "ws://") +
                        location.host +
                        "/_ws";
                    if (ws) {
                        log(
                            "ws",
                            "Closing previous connection before reconnecting..."
                        );
                        ws.close();
                        clear();
                    }

                    log("ws", "Connecting to", url, "...");
                    ws = new WebSocket(url);

                    ws.addEventListener("message", (event) => {
                        const { user = "system", message = "" } =
                            event.data.startsWith("{")
                                ? JSON.parse(event.data)
                                : { message: event.data };
                        log(
                            user,
                            typeof message === "string"
                                ? message
                                : JSON.stringify(message)
                        );
                    });

                    await new Promise((resolve) =>
                        ws.addEventListener("open", resolve)
                    );
                    log("ws", "Connected!");

                    ws.send("room: " + "${name}");
                };

                const clear = () => {
                    store.messages.splice(0, store.messages.length);
                    log("system", "previous messages cleared");
                };

                const send = () => {
                    console.log("sending message...");
                    if (store.message) {
                        ws.send(store.message);
                    }
                    store.message = "";
                };

                const ping = () => {
                    log("ws", "Sending ping");
                    ws.send("ping");
                };

                createApp({
                    store,
                    send,
                    ping,
                    clear,
                    connect,
                    rand: Math.random(),
                }).mount();

                await connect();
            </script>
        </head>
        <body class="h-screen flex flex-col justify-between">
            <main v-scope="{}">
                <!-- Messages -->
                <div
                    id="messages"
                    class="flex-grow flex flex-col justify-end px-4 py-8"
                >
                    <div
                        class="flex items-center mb-4"
                        v-for="message in store.messages"
                    >
                        <div class="flex flex-col">
                            <p class="text-gray-500 mb-1 text-xs ml-10">
                                {{ message.user }}
                            </p>
                            <div class="flex items-center">
                                <img
                                    :src="'https://www.gravatar.com/avatar/' + encodeURIComponent(message.user + rand) + '?s=512&d=monsterid'"
                                    alt="Avatar"
                                    class="w-8 h-8 rounded-full"
                                />
                                <div class="ml-2 bg-gray-800 rounded-lg p-2">
                                    <p
                                        v-if="message.formattedText"
                                        class="overflow-x-scroll"
                                        v-html="message.formattedText"
                                    ></p>
                                    <p v-else class="text-white">
                                        {{ message.text }}
                                    </p>
                                </div>
                            </div>
                            <p class="text-gray-500 mt-1 text-xs ml-10">
                                {{ message.date }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Chatbox -->
                <div
                    class="bg-gray-800 px-4 py-2 flex items-center justify-between fixed bottom-0 w-full"
                >
                    <div class="w-full min-w-6">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            class="w-full rounded-l-lg px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring focus:border-blue-300"
                            @keydown.enter="send"
                            v-model="store.message"
                        />
                    </div>
                    <div class="flex">
                        <button
                            class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4"
                            @click="send"
                        >
                            Send
                        </button>
                        <button
                            class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4"
                            @click="connect"
                        >
                            Reconnect
                        </button>
                        <button
                            class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-r-lg"
                            @click="clear"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </main>
        </body>
    </html> `;

export default defineEventHandler((event) => {
    const name = getRouterParam(event, "room") ?? "";

    return response(name === "" ? "test-room" : name);
});
