<template>
    <li class="user-li">
        <div class="flex-row-items-center">
            <UserAvatar :fio="user.fio" />
            <span>{{ user.fio }}</span>
        </div>
        <div class="flex-row-items-center">
            <button @click="() => makeCall(false)" class="btn-ghost">
                <CallIcon />
            </button>
            <button @click="() => makeCall(true)" class="btn-ghost">
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
import { useCallStore } from '@/stores/call'

const { user } = defineProps<{
    user: User,
}>()

const callStore = useCallStore()
const makeCall = async (isVideo: boolean) => {
    if (isVideo) {
        await callStore.makeCall(user, true, true)
    } else {
        await callStore.makeCall(user, false, true)
    }
}
</script>
