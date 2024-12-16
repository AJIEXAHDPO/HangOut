<template>
    <div class="user-icon" :class="{ rounded }" :style="{backgroundColor: color}">
        {{ letters }}
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const {
    rounded = false,
    fio,
} = defineProps<{
    rounded?: boolean,
    fio: string,
}>()

const color = computed(() => {
    switch (fio !== "" ? fio.charCodeAt(0) % 3 : 0) {
        case 0: return "#FF9500"; // orange
        case 1: return "#AF52DE"; // purple
        case 2: return "#FF2D55"; // red
        case 3: return "#FF2D55"; // red
        default: return "#34C759"; // green
    }
})

const letters = computed(() => {
    if (fio === "") {
        return "??";
    }

    return fio.split(" ").map(s => s[0]).join("");
})
</script>

<style>
.user-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    font-size: 12px;
    font-weight: 500;
    color: white;
    margin-right: 4px;
}
.rounded {
    border-radius: 999999px;
}
</style>