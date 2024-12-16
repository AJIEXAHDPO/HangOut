<template>
    <li class="user-li">
        <div style="display: flex; flex-direction: row; align-items: center;">
            <UserAvatar :fio="call.user.fio" />
            <span>{{ call.user.fio }}</span>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center;">
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
import { type Call } from "@/types"

const props = defineProps<{
    call: Call,
}>()

const makeCall = () => {
    console.log('makeCall')

}
</script>