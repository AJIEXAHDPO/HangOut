<template>
    <main
        style="justify-content: center; display: flex; align-items: center; min-height: 100vh; flex-direction: column;">
        <form @submit="login" id="login-form">
            <h1 id="app-title">HangOut</h1>
            <label>Name
                <input type="text" placeholder="Name" v-model="name" required />
            </label>
            <label>Password
                <input type="password" placeholder="Password" v-model="password" required />
            </label>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">{{isSubmitting? "Submitting..." : "Login"}}</button>
            <span class="error-message">{{ errorMessage }}</span>
            <a href="/register">Don't have an account?</a>
        </form>
    </main>
</template>

<script setup lang="ts">
import router from '@/router';
import { useSignalStore } from '@/stores/signal';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue'
const user = useUserStore();
const signalStore = useSignalStore();

const name = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const login = (e: Event) => {
    e.preventDefault()

    isSubmitting.value = true
    fetch(`https://${signalStore.domain}/auth`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name.value.trim(),
            password: password.value.trim(),
        })
    }).then(async res => {
        if (!res.ok) {
            throw new Error("authentication failed");
        }
        return res.json()
    }).then((data) => {
        if (!!data.token) {
            document.cookie = `token=${data.token}; path=/; SameSite=None; Secure`
            console.log(data.token)
            router.push("/");
        } else {
            throw new Error("no token provided")
        }
    }).catch(e => {
        if (e.message === "authentication failed") {
            errorMessage.value = "Invalid login or password"
            password.value = ""
        } else {
            console.error("authentication error", e)
            errorMessage.value = e.message
        }
    }).finally(() => {
        isSubmitting.value = false
    })

}
</script>

<style>
#login-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 230px;
}

label {
    font-weight: 700;
    font-size: 12px;
}

#app-title {
    font-size: 48px;
    margin-bottom: 20px;
    font-weight: lighter;
    color: #007AFF;
}

.error-message {
    color: red;
    font-size: 12px;
}

button.button-primary:disabled {
    opacity: .5;
}
</style>