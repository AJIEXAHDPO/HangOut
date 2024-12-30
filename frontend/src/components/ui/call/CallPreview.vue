<template>
    <div class="call-preview">
        <div class="call-preview-content">
            <UserAvatar :fio="fio" rounded class="icon-big" />
            <div>{{ fio }}</div>
        </div>
        <CallControls video-enabled audio-enabled @audio-change="handleAudio" @video-change="handleVideo"
            @hangup="handleHangup" />
        <audio src="/src/assets/connecting.mp3" hidden autoplay loop></audio>
    </div>
</template>

<script setup lang="ts">
import { useCallStore } from '@/stores/call';
import UserAvatar from '../UserAvatar.vue';
import CallControls from './CallControls.vue';

const { fio } = defineProps<{ fio: string }>();
const callStore = useCallStore();

const handleAudio = () => { }
const handleVideo = () => { }
const handleHangup = () => {
    callStore.hangUp();
}

</script>
<style>
.call-preview {
    width: 100vw;
    height: 100vh;
    position: fixed;
    background-color: #222;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}

.icon-big {
    width: 100px;
    height: 100px;
    font-size: 24px;
}

.call-preview-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 10px;
    color: #fff;
    font-size: 20px;
    font-weight: 600;
}
</style>