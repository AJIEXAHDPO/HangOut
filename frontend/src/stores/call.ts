import { defineStore } from "pinia";
import { ref } from "vue";
import { useSignalStore, type IncomingMessage } from "./signal";
import type { User } from "@/types";
// import { useUserStore } from "@/stores/user";

export const useCallStore = defineStore("call", () => {
    const isCalling = ref<boolean>(false);
    const peerConnection = ref<RTCPeerConnection | null>(null);
    const callUsers = ref<UserStream[]>([]);

    const makeCall = async (user: User, isVideo: boolean, isAudio: boolean) => {
        console.log('makeCall')
        const signalStore = useSignalStore()
        isCalling.value = true;
        // if (!userStore.user) {
        //     alert("connection error")
        //     return
        // }
        const userMedia = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { min: 1280, ideal: 1280, max: 1280 },
                height: { min: 720, ideal: 720, max: 720 },
                aspectRatio: 1,
                frameRate: { ideal: 10, max: 10 },
            }, audio: false
        });
        callUsers.value.push({
            id: 1,
            fio: "me",
            stream: userMedia,
        });

        if (!signalStore.isConnected) {
            alert("connection error")
            return
        }
        peerConnection.value = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun2.l.google.com:19302" },
            ],
            iceCandidatePoolSize: 10,
        })
        const offer = await peerConnection.value.createOffer()
        await peerConnection.value.setLocalDescription(offer)
        signalStore.sendMessage({
            type: 'offer',
            payload: offer,
            targetId: user.id,
        })

        signalStore.on('answer', async (message: IncomingMessage) => {
            await peerConnection.value?.setRemoteDescription(new RTCSessionDescription(message.payload))
            peerConnection.value?.addEventListener('icecandidate', (event) => {
                console.log("iceCandidate")
                if (event.candidate) {
                    signalStore.sendMessage({
                        type: 'candidate',
                        payload: event.candidate,
                        targetId: user.id,
                    })
                }
                console.log(event.candidate)
            })

            signalStore.on('candidate', async (message: IncomingMessage) => {
                try {
                    await peerConnection.value?.addIceCandidate(new RTCIceCandidate(message.payload))
                } catch (error) {
                    console.log(error)
                }
            })

            peerConnection.value?.addEventListener("connectionstatechange", async () => {
                console.log(peerConnection.value?.connectionState)
                if (peerConnection.value?.connectionState === 'connected') {
                    alert("call accepted")
                    const userMedia = await navigator.mediaDevices.getUserMedia({ video: isVideo, audio: isAudio });
                    userMedia.getTracks().forEach((track) => {
                        peerConnection.value?.addTrack(track, userMedia);
                    })

                    peerConnection.value?.addEventListener("track", (event) => {
                        console.log("call")
                        callUsers.value.push({
                            id: user.id,
                            fio: user.fio,
                            stream: event.streams[0],
                        });
                    })
                }
            })
        })
        signalStore.on('reject', (message: IncomingMessage) => {
            alert("user is buisy")
            peerConnection.value?.close()
            isCalling.value = false;
        })
    }

    const hangUp = () => {
        console.log('hangOut')
        isCalling.value = false;
        callUsers.value = [];
    }
    return {
        isCalling,
        callUsers,
        makeCall,
        hangUp,
    }
})

type UserStream = {
    id: number,
    fio: string,
    stream: MediaStream,
}