import { defineStore } from "pinia";
import { ref } from "vue";
import { useSignalStore } from "./signal";
import type { IncomingMessage, Participant, User } from "@/types";
// import { useUserStore } from "@/stores/user";

export const useCallStore = defineStore("call", () => {
    const isCalling = ref<boolean>(false);
    const isConnecting = ref<boolean>(false);
    const participants = ref<Participant[]>([]);
    const PEER = ref<RTCPeerConnection>();
    const localStream = ref<MediaStream>();
    const signal = useSignalStore();
    const targetId = ref<number>(0);

    const config = {
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
        iceCandidatePoolSize: 10,
    }

    const makeCall = async (user: User, isVideo: boolean, isAudio: boolean) => {
        console.log('makeCall')
        isConnecting.value = true;
        targetId.value = user.id;
        PEER.value = new RTCPeerConnection(config);
        PEER.value.onicecandidate = onIceCandidateHandler
        PEER.value.ontrack = onTrackHandler
        PEER.value.onconnectionstatechange = onConnectionStateChangeHandler
        signal.on("candidate", async (message: IncomingMessage) => onRemoteCandidateHandler(message))
        // send media stream
        localStream.value = await navigator.mediaDevices.getUserMedia({ video: isVideo, audio: isAudio });
        localStream.value.getTracks().forEach(track => PEER.value?.addTrack(track, localStream.value as MediaStream));
        // set local description
        const offer = await PEER.value.createOffer();
        await PEER.value.setLocalDescription(offer);
        signal.sendMessage({ type: "offer", payload: offer, targetId: user.id });
        signal.on("answer", async (message: IncomingMessage) => {
            await PEER.value?.setRemoteDescription(new RTCSessionDescription(message.payload));
        })
    }

    const hangUp = () => {
        console.log('hangOut')
        isCalling.value = false;
        participants.value = [];
    }

    const setCalling = (value: boolean) => {
        isCalling.value = value;
    }

    const addCallUser = (value: Participant) => {
        participants.value.push(value);
    }

    async function acceptCall(message: IncomingMessage, isAudio: true, isVideo: true) {
        console.log("accept call")
        isConnecting.value = true;
        targetId.value = message.fromUser;
        PEER.value = new RTCPeerConnection(config)
        PEER.value.onicecandidate = onIceCandidateHandler
        PEER.value.ontrack = onTrackHandler
        PEER.value.onconnectionstatechange = onConnectionStateChangeHandler
        signal.on("candidate", async (message: IncomingMessage) => onRemoteCandidateHandler(message))
        // set remote description
        const desc = new RTCSessionDescription(message.payload)
        await PEER.value.setRemoteDescription(desc);
        // send media stream
        localStream.value = await navigator.mediaDevices.getUserMedia({ video: isVideo, audio: isAudio });
        localStream.value.getTracks().forEach(track => PEER.value?.addTrack(track, localStream.value as MediaStream));
        // set local description
        const answer = await PEER.value.createAnswer()
        await PEER.value.setLocalDescription(answer)
        signal.sendMessage({ type: "answer", targetId: message.fromUser, payload: answer })
    }

    const onIceCandidateHandler = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
            signal.sendMessage({ type: "candidate", payload: event.candidate, targetId: targetId.value });
        }
    };

    const onTrackHandler = (event: RTCTrackEvent) => {
        for (const participant of participants.value) {
            if (participant.media === event.streams[0]) {
                alert("same track")
                return
            }
        }
        participants.value.push({ name: "oponent", media: event.streams[0], isAudio: true, isVideo: true, isMe: false })
        alert("track received on caller")
    }

    const onConnectionStateChangeHandler = async (event: Event) => {
        if (PEER.value?.connectionState === "connected") {
            alert("connected")
            if (!localStream.value) {
                const userMedia = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localStream.value = userMedia;
            }
            isConnecting.value = false;
            isCalling.value = true;
            addCallUser({
                media: localStream.value,
                name: "me",
                isAudio: true,
                isVideo: true,
                isMe: true
            })
        } else if (PEER.value?.connectionState === "failed") {
            alert("connection failed");
        }
    }

    const onRemoteCandidateHandler = async (message: IncomingMessage) => {
        console.log('candidate')
        try {
            await PEER.value?.addIceCandidate(new RTCIceCandidate(message.payload))
        } catch (error) {
            console.log(error)
        }
    }

    return {
        isCalling,
        isConnecting,
        participants,
        makeCall,
        hangUp,
        setCalling,
        addCallUser,
        acceptCall,
    }
})
