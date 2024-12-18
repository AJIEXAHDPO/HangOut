<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
import { isAuth } from './hooks/auth';
import { useSignalStore, type IncomingMessage, type Message } from './stores/signal';
import router from '@/router';
import CallView from './components/ui/call/CallView.vue';
import { useCallStore } from './stores/call';

const signalStore = useSignalStore();
const callStore = useCallStore();

onMounted(async () => {
  if (!isAuth()) {
    router.replace("/auth");
  } else {
    signalStore.connect();
    signalStore.on("offer", handleOffer)
  }
})

async function handleOffer(message: IncomingMessage) {
  if (confirm(`incomming call from ${message.fromUser}. Do you want to answer?`)) {
    // answer
    await acceptCall(message)
  } else {
    // reject
    signalStore.sendMessage({
      type: "reject",
      targetId: message.fromUser,
      payload: {},
    });
  }
}

async function acceptCall(message: IncomingMessage) {
  const peerConnection = new RTCPeerConnection(
    {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
      ],
      iceCandidatePoolSize: 10,
    }
  )
  await peerConnection.setRemoteDescription(new RTCSessionDescription(message.payload))
  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)

  signalStore.sendMessage({
    type: "answer",
    targetId: message.fromUser,
    payload: answer,
  })

  peerConnection.addEventListener("icecandidate", (event) => {
    if (event.candidate) {
      signalStore.sendMessage({
        type: "candidate",
        targetId: message.fromUser,
        payload: event.candidate,
      })
    }
    console.log(event.candidate)
  })

  signalStore.on("candidate", async (message: IncomingMessage) => {
    try {
      // todo: check if candidate already exists
      await peerConnection.addIceCandidate(new RTCIceCandidate(message.payload))
    } catch (error) {
      console.log(error)
    }
  })

  peerConnection.addEventListener("connectionstatechange", async () => {
    if (peerConnection.connectionState === "connected") {
      const userMedia = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      userMedia.getTracks().forEach((track) => peerConnection.addTrack(track, userMedia))
      peerConnection.addEventListener("track", (event) => {
        // const stream = event.streams[0]
        // const video = document.createElement("video")
        // video.srcObject = stream
        // video.autoplay = true
        // document.body.append(video)
        console.log(event.streams[0])
      })
    }
  })
}

</script>

<template>
  <RouterView />
  <CallView v-if="isAuth() && callStore.isCalling" />
</template>

