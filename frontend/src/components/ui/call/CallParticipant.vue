<template>
    <div class="video-container">
        <video v-if="true" ref="video" autoplay></video>
        <div v-else>
            <UserAvatar :fio="props.fio" />
            <span style="margin-top: 20px;">{{ props.fio }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import UserAvatar from '../UserAvatar.vue';

const props = defineProps<{
    srcobject: MediaStream,
    fio: string,
}>()

const video = useTemplateRef('video');

onMounted(async () => {
    if (!video.value) return;
    video.value.srcObject = props.srcobject;
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