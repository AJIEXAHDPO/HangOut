<template>
    <header>
        <div class="header">
            <div class="logo">HangOut</div>
        </div>
        <nav>
            <RouterLink to="/">Calls</RouterLink>
            <RouterLink to="/contacts">Contacts</RouterLink>
        </nav>
    </header>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: var(--color-header);
    color: var(--color-text);
    font-size: 1.2rem;
}

header {
    line-height: 1.5;
    max-height: 100vh;
}

nav {
    width: 100%;
    font-size: 1rem;
    text-align: center;
    margin-top: 2rem;
}

nav a {
    color: var(--color-text);
    text-decoration: none;
    transition: 0.4s;
    padding: 15px 20px;
}

nav a:hover {
    background-color: #007AFF22;
}

nav a.router-link-exact-active {
    color: #007AFF;
    border-bottom: 2px solid #007AFF;
}

/* nav a.router-link-exact-active:hover {
    background-color: transparent;
} */
</style>