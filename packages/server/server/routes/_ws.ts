import { Peer } from "crossws";

const rooms = new WeakMap<Peer, string>();

export default defineWebSocketHandler({
    open(peer) {
        console.log("[ws] open", peer);
        peer.send(`[system] you are ${peer}`);
    },

    message(peer, message) {
        if (message.text().startsWith("room: ")) {
            const name = message.text().replace("room: ", "");
            rooms.set(peer, name);

            peer.subscribe(rooms.get(peer) ?? "test-room");
            peer.publish(
                rooms.get(peer) ?? "test-room",
                `[system] ${peer} joined the chat!`
            );

            return;
        }

        console.log("[ws] message", peer, message);
        peer.publish(rooms.get(peer) ?? "test-room", message.text());
        peer.send(message.text());
    },

    close(peer, event) {
        console.log("[ws] close", peer, event);
        peer.publish(
            rooms.get(peer) ?? "test-room",
            `[system] ${peer} has left the chat!`
        );
        peer.unsubscribe(rooms.get(peer) ?? "test-room");
    },

    error(peer, error) {
        console.log("[ws] error", peer, error);
    },
});
