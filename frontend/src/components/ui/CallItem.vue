<template>
    <li class="user-li">
        <div style="display: flex; flex-direction: row; align-items: center; gap: 5px;">
            <UserAvatar :fio="call.user.fio" />
            <div style="display: flex; flex-direction: column;">
                <div>{{ call.user.fio }}</div>
                <div style="height:32px; display: flex; align-items: center; gap: 5px;">
                    <IconMissedCall v-if="call.type == 'missed'" :width="24" :height="24" />
                    <IconIncommingCall v-if="call.type == 'incoming'" :width="20" :height="20" />
                    <IconOutgoingCall v-if="call.type == 'outgoing'" :width="20" :height="20" />
                    <span>{{ new Date(call.finishedAt).toLocaleDateString("en-US", {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        weekday: 'short',

                    }) }}</span>
                </div>
            </div>
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
import IconMissedCall from '../icons/IconMissedCall.vue'
import IconIncommingCall from '../icons/iconIncommingCall.vue'
import IconOutgoingCall from '../icons/IconOutgoingCall.vue'

const props = defineProps<{
    call: Call,
}>()

const makeCall = () => {
    console.log('makeCall')

}
</script>