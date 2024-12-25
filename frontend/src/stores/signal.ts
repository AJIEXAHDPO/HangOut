import { defineStore } from "pinia";
import { ref } from "vue";

export const useSignalStore = defineStore("signal", () => {
    const socket = ref<WebSocket | null>(null)
    const isConnected = ref(false);
    const connectionID = ref(0);
    const domain = "f98d-178-66-157-117.ngrok-free.app";
    // domain = localhost:8080
    const connect = () => {
        const token = getTokenFomCookie();
        socket.value = new WebSocket(`wss://${domain}/ws?token=${token}`);
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

    const getTokenFomCookie = () => {
        const token = document.cookie.split(";").find(c => c.trim().startsWith("token="));
        if (token) {
            return token.split("=")[1];
        }
        return "";
    }

    return {
        socket,
        isConnected,
        connect,
        sendMessage,
        on,
        domain
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