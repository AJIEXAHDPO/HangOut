<template>
    <svg :width :height viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M1.17073 2.5C0.524152 2.5 0 3.02416 0 3.67073V12.2561C0 12.9027 0.524152 13.4268 1.17073 13.4268H9.7561C10.4027 13.4268 10.9268 12.9027 10.9268 12.2561V9.76587L14.2439 11.681C15.0244 12.1316 16 11.5683 16 10.6671V5.25973C16 4.3585 15.0244 3.79523 14.2439 4.24584L10.9268 6.16096V3.67073C10.9268 3.02416 10.4027 2.5 9.7561 2.5H1.17073Z"
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