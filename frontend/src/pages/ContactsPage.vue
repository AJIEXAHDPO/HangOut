<template>
    <Header></Header>
    <main>
        <h1>Contacts</h1>
        <ul v-if="contacts.length > 0">
            <UserItem v-for="contact in contacts" :key="contact.id" :user="contact" />
        </ul>
        <div v-else>
            <div style="text-align: center;">
                <h2>No contacts yet</h2>
                <a href="/add" style="text-align: center;">Add now</a>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type User } from '@/types'
import UserItem from '@/components/ui/UserItem.vue';
import Header from '@/components/ui/Header.vue';

const contacts = ref<User[]>([])

onMounted(() => {
    // fetch('/api/contacts')
    //     .then(res => res.json())
    //     .then(data => contacts.value = data)

    const users: User[] = [
        {
            name: 'John Doe',
            fio: 'Дoe Джон',
            id: '1',
            avatar: 'https://example.com/avatar1.jpg',
            lastSeen: '10:30 AM',
            isOnline: true,
            isTyping: false,
            isVerified: false,
            isAdmin: false,
        },
        {
            name: 'Jane Smith',
            fio: 'Смит Джейн',
            id: '2',
            avatar: 'https://example.com/avatar2.jpg', 
            lastSeen: 'Yesterday',
            isOnline: false,
            isTyping: false,
            isVerified: false,
            isAdmin: false,
        },
        {
            name: 'Mike Johnson',
            fio: 'Джонсон Майк',
            id: '3',
            avatar: 'https://example.com/avatar3.jpg', lastSeen: '11:00 AM',
            isOnline: true,
            isTyping: false,
            isVerified: false,
            isAdmin: false,
        },
        {
            name: 'Sarah Brown',
            fio: 'Браун Сара',
            id: '4',
            avatar: 'https://example.com/avatar4.jpg', lastSeen: '1 hour ago',
            isOnline: false,
            isTyping: false,
            isVerified: false,
            isAdmin: false,
        },
        {
            name: 'David Miller',
            fio: 'Миллер Дэвид',
            id: '5',
            avatar: 'https://example.com/avatar5.jpg', lastSeen: '12:45 PM',
            isOnline: true,
            isTyping: false,
            // isMe: false,
            isVerified: false,
            isAdmin: false,
        },
    ];

    contacts.value = users;
})
</script>

<style scoped>
ul {
    padding-left: 0;
}
</style>