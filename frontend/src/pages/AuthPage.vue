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
            <button type="submit" class="btn btn-primary">Login</button>
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

const login = (e: Event) => {
    e.preventDefault()

    fetch(`https://${signalStore.domain}/auth`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name.value,
            password: password.value,
        })
    }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText);
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
        alert("Invalid login or password")

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
</style>