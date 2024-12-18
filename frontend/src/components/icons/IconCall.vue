<template>
    <svg :width :height viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.64567 9.89328C8.24925 11.2848 5.32763 13.9487 4.52821 12.0313C4.24028 11.4223 3.47248 11.1092 2.82888 11.4587L0.61187 12.6625C-0.199585 13.1031 -0.205028 14.2666 0.602074 14.7568C5.09043 17.4826 7.70682 15.415 11.5678 11.5675C15.1688 7.97906 17.5542 5.08975 14.8084 0.599975C14.3165 -0.204312 13.149 -0.198889 12.7068 0.609736L11.4988 2.81902C11.1459 3.46425 11.4661 4.23475 12.0845 4.51757C13.8192 5.61057 11.0611 8.48282 9.64567 9.89328Z"
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