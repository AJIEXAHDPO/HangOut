<template>
    <div class="call-controls">
        <button @click="toggleAudio">
            <IconCall color="white" :width="20" :height="20" />
            {{ audioEnabled ? "Sound on" : "Sound off" }}
        </button>
        <button @click="toggleVideo">
            <IconVideoCall v-if="videoEnabled" color="white" :width="20" :height="20" />
            <IconVideoOff v-else color="white" :width="20" :height="20" />
            {{ videoEnabled ? "Video on" : "Video off" }}
        </button>
        <button @click="hangup" class="warn">
            <IconHangup color="white" :width="20" :height="20" />
            Hangup
        </button>
    </div>
</template>

<script setup lang="ts">
import IconCall from '@/components/icons/IconCall.vue';
import IconHangup from '@/components/icons/IconHangup.vue';
import IconVideoCall from '@/components/icons/IconVideoCall.vue';
import IconVideoOff from '@/components/icons/IconVideoOff.vue';

const {
    videoEnabled,
    audioEnabled,
} = defineProps<{
    videoEnabled: boolean;
    audioEnabled: boolean;
}>()

const emit = defineEmits(['audio-change', 'video-change', "hangup"])

const toggleAudio = () => {
    emit('audio-change', !audioEnabled)
}
const toggleVideo = () => {
    emit('video-change', !videoEnabled)
}
const hangup = () => {
    emit('hangup')
}
</script>

<style>
.call-controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 15px;
    margin-bottom: 10px;
    border-radius: 16px;
    padding: 10px 5px;
}

.call-controls button {
    background-color: #333;
    border-radius: 16px;
    padding: 10px 6px;
    border: none;
    cursor: pointer;
    color: white;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
}

.call-controls button.warn {
    background-color: red;
}
</style>