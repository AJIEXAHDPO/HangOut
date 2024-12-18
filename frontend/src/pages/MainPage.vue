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


const calls = ref<Call[]>([
    {
        "id": 0,
        "type": "incoming",
        "duration": "30:45",
        "finishedAt": "2022-01-01T00:00:00.000Z",
        "status": "finished",
        "user": {
            "name": "User 0",
            "fio": "Иванов Иван",
            "id": 0,
            "avatar": "avatar_0.jpg",
            "lastSeen": "2022-01-01T00:00:00.000Z",
            "isOnline": true,
            "isTyping": false,
            "isVerified": true,
            "isAdmin": false
        }
    },
    {
        "id": 1,
        "type": "outgoing",
        "duration": "15:20",
        "finishedAt": "2022-01-01T00:00:00.000Z",
        "status": "finished",
        "user": {
            "name": "User 1",
            "fio": "Петров Петр",
            "id": 1,
            "avatar": "avatar_1.jpg",
            "lastSeen": "2022-01-01T00:00:00.000Z",
            "isOnline": false,
            "isTyping": true,
            "isVerified": false,
            "isAdmin": true
        }
    },
    {
        "id": 2,
        "type": "missed",
        "duration": "00:00",
        "finishedAt": "2022-01-01T00:00:00.000Z",
        "status": "missed",
        "user": {
            "name": "User 2",
            "fio": "Сидоров Сидор",
            "id": 2,
            "avatar": "avatar_2.jpg",
            "lastSeen": "2022-01-01T00:00:00.000Z",
            "isOnline": true,
            "isTyping": false,
            "isVerified": true,
            "isAdmin": false
        }
    },
    {
        "id": 3,
        "type": "incoming",
        "duration": "45:30",
        "finishedAt": "2022-01-01T00:00:00.000Z",
        "status": "finished",
        "user": {
            "name": "User 3",
            "fio": "Александров Александр",
            "id": 3,
            "avatar": "avatar_3.jpg",
            "lastSeen": "2022-01-01T00:00:00.000Z",
            "isOnline": false,
            "isTyping": true,
            "isVerified": false,
            "isAdmin": true
        }
    },
    {
        "id": 4,
        "type": "outgoing",
        "duration": "20:15",
        "finishedAt": "2022-01-01T00:00:00.000Z",
        "status": "finished",
        "user": {
            "name": "User 4",
            "fio": "Михайлов Михаил",
            "id": 4,
            "avatar": "avatar_4.jpg",
            "lastSeen": "2022-01-01T00:00:00.000Z",
            "isOnline": true,
            "isTyping": false,
            "isVerified": true,
            "isAdmin": false
        }
    }
]);
</script>

<style scoped>
ul {
    padding-left: 0;
}
</style>