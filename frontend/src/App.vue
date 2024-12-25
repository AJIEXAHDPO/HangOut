<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
import { isAuth } from './hooks/auth';
import { useSignalStore } from './stores/signal';
import router from '@/router';
import CallView from './components/ui/call/CallView.vue';
import { useCallStore } from './stores/call';
import type { IncomingMessage } from '@/types';
import CallPreview from './components/ui/call/CallPreview.vue';

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
    await callStore.acceptCall(message, true, true)
  } else {
    // reject
    signalStore.sendMessage({
      type: "reject",
      targetId: message.fromUser,
      payload: {},
    });
  }
}
</script>

<template>
  <RouterView />
  <CallPreview v-if="isAuth() && callStore.isConnecting" fio="testUser2" />
  <CallView v-if="isAuth() && callStore.isCalling" />
</template>
