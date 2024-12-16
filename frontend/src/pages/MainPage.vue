<template>
    <Header></Header>
    <main>
        <h1>Calls</h1>
        <ul v-if="calls.length > 0">
            <CallItem v-for="call in calls" :key="call.id" :call="call" />
        </ul>
        <div v-else>
            <div style="text-align: center;">
                <h2>Here displays your call history</h2>
                <RouterLink to="/contacts">Make call</RouterLink>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import CallItem from '@/components/ui/CallItem.vue';
import Header from '@/components/ui/Header.vue'
import type { Call } from '@/types';
import { ref } from 'vue';

const calls = ref<Call[]>([]);
</script>