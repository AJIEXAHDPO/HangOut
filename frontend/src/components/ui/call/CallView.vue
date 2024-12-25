<template>
    <Dragable :draggable="isMinimised" :initialRight="20" :initialTop="50">
        <div class="call-view" :class="{ 'minimised': isMinimised }">
            <div class="call-header" v-if="!isMinimised">
                <button class="btn" @click="() => (isMinimised = true)">Back</button>
                {{ "John Doe" }}
                <button class="btn">options</button>
            </div>
            <div class="call-participants">
                <template v-for="user, idx in callStore.participants">
                <CallParticipant  v-if="idx > 0" :fio="'fff'" :srcobject="user.media" />
                </template>
            </div>
            <button v-if="isMinimised" class="maximise-btn" @dragstart="(e) => e.preventDefault()"
                @click="() => (isMinimised = false)">full screen</button>
            <div v-if="!isMinimised">
                <CallControlls @audio-change="handleAudio" @video-change="handleVideo" @hangup="handleHangup"
                    :audio-enabled="audioEnabled" :video-enabled="videoEnabled" />
            </div>
        </div>
    </Dragable>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CallControlls from './CallControls.vue';
import Dragable from "@/components/ui/Dragable.vue";
import CallParticipant from '@/components/ui/call/CallParticipant.vue';
import { useCallStore } from '@/stores/call';

const videoEnabled = ref(false);
const audioEnabled = ref(false);
const isMinimised = ref(true);
const callStore = useCallStore();

const handleVideo = (isAudio: boolean) => {
    videoEnabled.value = isAudio;
}
const handleAudio = (isVideo: boolean) => {
    audioEnabled.value = isVideo;
}
const handleHangup = () => {
    console.log('hangup');
    callStore.hangUp()
}

type CallUser = {
    fio: string,
    videoSrc: MediaStreamTrack
};

watch(isMinimised, () => {
    if (isMinimised.value) {
        document.body.classList.remove('no-scroll');
    } else {
        document.body.classList.add('no-scroll');
    }
});
const callUsers = ref<CallUser[]>([]);
</script>

<style scoped>
.call-view {
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

.call-header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #333;
    color: #fff;
}

.minimised {
    position: relative;
    width: 200px;
    height: 300px;
    left: auto;
    top: 50px;
    right: 20px;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
}

.maximise-btn {
    position: absolute;
    background-color: transparent;
    border-radius: 15px;
    color: #fff;
    width: 50px;
    height: 50px;
    border: none;
    outline: none;
    cursor: pointer;
    opacity: 0;
}

.minimised:hover .maximise-btn {
    opacity: 1;
}

.call-participants {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    color: #fff;
    overflow: auto;
    height: 100%;
    width: 100%;
    flex-direction: row;
    gap: 10px;
}

.minimised .call-participants {
    flex-direction: column;
    overflow: hidden;
    flex-wrap: wrap;
    padding: 0;
}
</style>