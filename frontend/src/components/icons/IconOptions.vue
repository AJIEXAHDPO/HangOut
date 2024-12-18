<template>
    <svg :width :height viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M14.25 3.75C14.25 4.99264 13.2426 6 12 6C10.7574 6 9.75 4.99264 9.75 3.75C9.75 2.50736 10.7574 1.5 12 1.5C13.2426 1.5 14.25 2.50736 14.25 3.75Z"
            :fill="color" />
        <path
            d="M14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12Z"
            :fill="color" />
        <path
            d="M12 22.5C13.2426 22.5 14.25 21.4926 14.25 20.25C14.25 19.0074 13.2426 18 12 18C10.7574 18 9.75 19.0074 9.75 20.25C9.75 21.4926 10.7574 22.5 12 22.5Z"
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