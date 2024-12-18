<template>
    <svg :width :height viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12.2375 10.8545C14.588 10.8545 19.2967 11.0636 18.3502 13.3558C18.0782 14.1124 18.4599 15.0231 19.2967 15.2696L22.1793 16.1187C23.2344 16.4295 24.2216 15.4515 23.9563 14.3582C22.481 8.27857 18.5328 7.82281 12.0338 7.82281C5.97248 7.82281 1.52462 8.25537 0.043669 14.3582C-0.221626 15.4515 0.765591 16.4295 1.82066 16.1187L4.70326 15.2696C5.54514 15.0216 5.92639 14.1013 5.64484 13.3421C5.10801 10.959 9.85507 10.8545 12.2375 10.8545Z"
            :fill="color" />
    </svg>
</template>

<script setup lang="ts">
const { width, height, color } = defineProps({
    width: {
        type: Number,
        default: 16,
    }, height: {
        type: Number,
        default: 16,
    },
    color: {
        type: String,
        default: 'black',
    }
});
</script>