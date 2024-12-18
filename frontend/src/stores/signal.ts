import { defineStore } from "pinia";
import { ref } from "vue";

export const useSignalStore = defineStore("signal", () => {
    const socket = ref<WebSocket | null>(null)
    const isConnected = ref(false);
    const connectionID = ref(0);
    const connect = () => {
        socket.value = new WebSocket("ws://localhost:8080/ws");
        socket.value.onmessage = (event) => {
            console.log(event.data);
        }

        socket.value.onopen = () => {
            console.log("connected");
            connectionID.value = Math.round(Math.random()*10000)
            // socket.value?.send(JSON.stringify({
            //     type: "init",
            //     payload: {},
            //     targetId: 0,
            // }));
            isConnected.value = true;
        }

        socket.value.onclose = (e) => {
            console.log("disconnected");
            console.log(e);
        }

        socket.value.onerror = (event: Event) => {
            console.log(event);
        }
    }
    const sendMessage = (message: Message) => {
        socket.value?.send(JSON.stringify(message));
    }

    const on = (type: string, callback: Function) => {
        socket.value?.addEventListener(
            "message", async (e: MessageEvent) => {
                const message = JSON.parse(e.data) as IncomingMessage;
                if (message.type === type) {
                    await callback(message);
                }
            }
        )
    }

    return {
        socket,
        isConnected,
        connect,
        sendMessage,
        on,
    }
})

export type Message = {
    type: "reject" | "candidate" | "offer" | "answer" | "ping" | "pong",
    payload: any,
    targetId: number,
}

export type IncomingMessage = {
    type: "reject" | "candidate" | "offer" | "answer" | "ping" | "pong",
    payload: any,
    targetId: number,
    fromUser: number,
}