<template>
    <svg :width :height viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M0.0579081 4.77123C0.06146 4.34176 0.412499 3.99648 0.841976 4.00003L7.8407 4.05791C8.27018 4.06146 8.61546 4.4125 8.61191 4.84198C8.60836 5.27145 8.25732 5.61673 7.82784 5.61318L2.70649 5.57083L8.16341 11.1188L14.7353 5.83959C15.0701 5.57062 15.5596 5.62401 15.8286 5.95885C16.0976 6.29369 16.0442 6.78317 15.7093 7.05215L9.13745 12.3313C8.51483 12.8315 7.61459 12.7788 7.05457 12.2094L1.59765 6.66147L1.5553 11.7828C1.55175 12.2123 1.20071 12.5576 0.771232 12.554C0.341756 12.5505 -0.00352463 12.1994 2.71582e-05 11.77L0.0579081 4.77123Z"
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