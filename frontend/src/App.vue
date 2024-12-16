<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue';
import { checkAuth } from './hooks/auth';

const ws = ref<WebSocket>()
onMounted(async ()=> {
  await checkAuth();
  ws.value = new WebSocket("ws://localhost:8080/ws")
  ws.value.onopen = ()=> console.log("connected")
  ws.value.onerror = ()=> alert("error")
})
</script>

<template>
  <RouterView />
</template>

