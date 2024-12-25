import { defineStore } from "pinia";
import { ref } from "vue";
import { useSignalStore, type IncomingMessage } from "./signal";
import type { User } from "@/types";
import { useUserStore } from "./user";
// import { useUserStore } from "@/stores/user";

export const useCallStore = defineStore("call", () => {
    const isCalling = ref<boolean>(false);
    const callUsers = ref<UserStream[]>([]);

    const makeCall = async (user: User, isVideo: boolean, isAudio: boolean) => {
        const signal = useSignalStore();

        console.log('makeCall')
        const localStream = await navigator.mediaDevices.getUserMedia({ video: isVideo, audio: isAudio });
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' },
                { urls: 'stun:stun4.l.google.com:19302' },
                { urls: 'stun:stun.stunprotocol.org:3478' },
                { urls: 'stun:stun.ekiga.net:3478' },
                { urls: 'stun:stun.ideasip.com:3478' },
                { urls: 'stun:stun.rixtelecom.se:3478' },
                { urls: 'stun:stun.schlund.de:3478' },
                { urls: 'stun:stun.voiparound.com:3478' },
                { urls: 'stun:stun.voipbuster.com:3478' },
                { urls: 'stun:stun.voipstunt.com:3478' },
                { urls: 'stun:stun.voxgratia.org:3478' },
                { urls: 'stun:stun.xten.com:3478' },
            ],
        });

        // localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        // peerConnection.ontrack = (event) => {
        //     // получить видео на удаленный пир
        //     callUsers.value.push({ fio: user.fio, stream: event.streams[0], id: user.id });
        //     alert("track received on caller")
        // };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                // отправить кандидата на удаленный пир
                signal.sendMessage({ type: "candidate", payload: event.candidate, targetId: user.id });
            }
        };

        peerConnection.ontrack = (event) => {
            // получить видео на удаленный пир
            callUsers.value.push({fio: user.fio, stream: event.streams[0], id: user.id});
            alert("track received on caller")
        };

        peerConnection.onconnectionstatechange = (event) => {
            if (peerConnection.connectionState === "connected") {
                alert('connected ' + callUsers.value.length + ' tracks');
                isCalling.value = true;
            } else if (peerConnection.connectionState === "failed") {
                alert("connection failed"); 
            }
        }

        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // отправить предложение на удаленный пир
        signal.sendMessage({ type: "offer", payload: offer, targetId: user.id });

        // установить ответ на удаленный пир
        signal.on("answer", async (message: IncomingMessage) => {
            // alert('answer')
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.payload));
            // stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        })

        signal.on("candidate", async (message: IncomingMessage) => {
            console.log('candidate')
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(message.payload));
                callUsers.value.push(userStream);
            } catch (e) {
                console.warn(e)
            }
        })

        const userStream: UserStream = {
            id: 1,
            fio: "caller",
            stream: localStream,
        }
    }

    const hangUp = () => {
        console.log('hangOut')
        isCalling.value = false;
        callUsers.value = [];
    }

    const setCalling = (value: boolean) => {
        isCalling.value = value;
    }

    const addCallUser = (value: UserStream) => {
        callUsers.value.push(value);
    }

    return {
        isCalling,
        callUsers,
        makeCall,
        hangUp,
        setCalling,
        addCallUser,
    }
})

type UserStream = {
    id: number,
    fio: string,
    stream: MediaStream,
}