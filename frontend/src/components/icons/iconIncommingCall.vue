<template>
    <svg :width :height viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M2.99701 14C2.44293 14.0034 1.99657 13.5571 2.00002 13.003L2.0563 3.97383C2.05975 3.41975 2.51172 2.96779 3.06579 2.96433C3.61987 2.96088 4.06624 3.40725 4.06278 3.96132L4.0216 10.5684L12.2918 2.29828C12.686 1.90405 13.3212 1.90009 13.7106 2.28944C14.0999 2.67879 14.0959 3.314 13.7017 3.70824L5.43155 11.9784L12.0387 11.9372C12.5928 11.9338 13.0391 12.3801 13.0357 12.9342C13.0322 13.4883 12.5802 13.9402 12.0262 13.9437L2.99701 14Z"
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