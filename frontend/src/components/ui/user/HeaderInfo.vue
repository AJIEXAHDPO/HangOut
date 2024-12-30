<template>
    <UserAvatar v-if="user" :fio="user.fio" />
    <button class="logout btn-ghost" @click="logout">Log out</button>
</template>

<script setup lang="ts">
import UserAvatar from '@/components/ui/UserAvatar.vue'   
import { logout } from '@/hooks/auth';
import { useUserStore } from '@/stores/user';
const { user } = useUserStore()
</script>

<style scoped>
.logout {
    padding: 10px 20px;
    border: none;
    background-color: transparent;
}


.logout:hover {
    cursor: pointer;
}
</style>