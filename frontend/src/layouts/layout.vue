<template>
    <Header></Header>
    <main>
        <slot></slot>
    </main>
    <CallPreview v-if="isAuth() && callStore.isConnecting" fio="testUser2" />
    <CallView v-if="isAuth() && callStore.isCalling" />
</template>

<script setup lang="ts">
import CallPreview from '@/components/ui/call/CallPreview.vue';
import CallView from '@/components/ui/call/CallView.vue';
import Header from '@/components/ui/Header.vue'
import { onMounted } from 'vue';

import { isAuth } from '@/hooks/auth';
import { useSignalStore } from '@/stores/signal';
import { useCallStore } from '@/stores/call';
import type { IncomingMessage } from '@/types';
import router from '@/router';

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