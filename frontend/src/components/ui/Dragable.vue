<template>
    <div @mousedown="handleMousedown" ref="dragable" class="resizable">
        <div style="position: relative;">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';

const props = defineProps({
    dragable: {
        type: Boolean,
        default: true,
    },
    initialTop: {
        type: Number,
        default: 0,
    },
    initialRight: {
        type: Number,
        default: 0,
    },
})
const offsetX = ref(props.initialTop)
const offsetY = ref(props.initialRight)
const div = useTemplateRef("dragable")

onMounted(() => {
    if (!div.value) return;
    div.value.style.top = `${props.initialTop}px`;
    div.value.style.right = `${props.initialRight}px`;
})

function handleMousedown(e: MouseEvent) {
    if (!props.dragable) return;
    console.log(div.value)
    if(!div.value) return;
    offsetX.value = e.clientX - div.value.offsetLeft;
    offsetY.value = e.clientY - div.value.offsetTop;
    window.ondragstart = () => false;

    const handleMouseMove = (evt: MouseEvent) => {
        if (!div.value) return;
        console.log(div.value)
        div.value.style.left = `${evt.clientX - offsetX.value}px`;
        div.value.style.top = `${evt.clientY - offsetY.value}px`;
    }

    div.value.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', () => {
        div.value?.removeEventListener('mousemove', handleMouseMove);
    });
}

</script>

<style scoped>
[draggable=true] {
    cursor: move;
}

.resizable {
    position: fixed;
}
</style>
