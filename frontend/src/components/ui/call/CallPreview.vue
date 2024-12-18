<template>
    <div class="call-preview">
        <UserAvatar :fio="fio" rounded />
        <div>{{ fio }}</div>
    </div>
</template>

<script setup lang="ts">
import UserAvatar from '../UserAvatar.vue';

const { fio } = defineProps<{ fio: string }>();
</script>