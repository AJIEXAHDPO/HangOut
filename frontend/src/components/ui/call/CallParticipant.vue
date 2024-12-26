<template>
    <div class="video-container">
        <video v-if="true" ref="video" autoplay :muted="isMe"></video>
        <div v-else>
            <UserAvatar :fio="fio" />
            <span style="margin-top: 20px;">{{ fio }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import UserAvatar from '../UserAvatar.vue';

const {
    srcobject,
    fio,
    isMe = false
} = defineProps<{
    srcobject: MediaStream,
    fio: string,
    isMe?: boolean,
}>()

const video = useTemplateRef('video');

onMounted(async () => {
    if (!video.value) return;
    video.value.srcObject = srcobject;
    video.value.onloadedmetadata = () => video.value?.play();
})

</script>

<style>
.video-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    background-color: #000;
    overflow: hidden;
}

.video-container video {
    width: 100%;
    object-fit: contain;
}
</style>