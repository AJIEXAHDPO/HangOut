<template>
    <div class="confirm" v-if="confirmNeeded">
        <div class="confirm-content">
            <div class="confirm-msg">
                <UserAvatar :fio="'User'" />
                <span>ID:{{ message }}</span>
            </div>
            <button class="confirm-btn" @click="onConfirm">
                <IconCall />
            </button>
            <button class="confirm-btn cancel" @click="onCancel">
                <IconHangup color="white" />
            </button>
        </div>
        <!-- <audio src="/src/assets/rang.mp3" autoplay hidden loop></audio> -->
        <!-- &nbsp;&nbsp; -->
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import IconCall from '@/components/icons/IconCall.vue';
import IconHangup from '../icons/IconHangup.vue';
import UserAvatar from './UserAvatar.vue';
const message = ref<string>("")
const confirmNeeded = ref<boolean>(false)
let resolveCallback: Function | null = null

// Обработчики действий
function onConfirm() {
    if (resolveCallback) resolveCallback(true)
    confirmNeeded.value = false
}

function onCancel() {
    if (resolveCallback) resolveCallback(false)
    confirmNeeded.value = false
}

const confirm = async function (msg: string): Promise<boolean> {
    return new Promise((resolve) => {
        window.confirm(msg) ? resolve(true) : resolve(false)
    })
    // TODO: fix
    // message.value = msg
    // confirmNeeded.value = true
    // return new Promise((resolve) => {
    //     resolveCallback = resolve
    //     // window.confirm(msg) ? resolve(true) : resolve(false)
    // })
}

defineExpose({
    confirm,
})
</script>
<style scoped>
.confirm {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: top;
    align-items: center;
    z-index: 101;
}

.confirm-content {
    width: 100%;
    max-width: 300px;
    margin-top: 10px;
    font-size: 16px;
    background-color: white;
    padding: 20px 10px;
    border-radius: 10px;
    text-align: right;
}

.confirm-msg {
    margin-bottom: 10px;
    font-size: 16px;
    text-align: center;
}

.confirm-btn {
    margin: 10px;
    border-radius: 50%;
    border: none;
    width: 48px;
    height: 48px;
    cursor: pointer;
}

.confirm-btn:hover {
    background-color: #f5f5f5;
}

.confirm-btn.cancel {
    background-color: #ff0000;
}

.confirm-btn.cancel:hover {
    background-color: #ff3333;
}
</style>