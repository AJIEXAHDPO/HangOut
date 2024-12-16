<template>
    <li class="user-li">
        <div class="flex-row-items-center">
            <UserAvatar :fio="user.fio" />
            <span>{{ user.fio }}</span>
        </div>
        <div class="flex-row-items-center">
            <button @click="makeCall" class="btn-ghost">
                <CallIcon />
            </button>
            <button @click="makeCall" class="btn-ghost">
                <VideoCallIcon />
            </button>
        </div>
    </li>
</template>

<script setup lang="ts">
import CallIcon from '@/components/icons/IconCall.vue'
import VideoCallIcon from '@/components/icons/IconVideoCall.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import { defineProps } from 'vue'
import { type User } from "@/types"

const { user } = defineProps<{
    user: User,
}>()

const makeCall = () => {
    console.log('makeCall')

}
</script>


<style>
.user-li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 20px;
    /* border: 1px solid #ccc; */
    margin: 5px;
    border-radius: 16px;
    background: #fff;
    width: 100%;
}

.user-li:hover {
    background: #f5f5f5;
}

.flex-row-items-center {
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>