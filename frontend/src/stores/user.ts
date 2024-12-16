import { defineStore } from "pinia";
import { ref } from "vue";

type User = {
    id: number
    name: string
    email: string
    password: string
    token: string
}

export const useUserStore = defineStore("user", () => {
    const user = ref<User>()
    const setUser = (user: any) => {
        localStorage.setItem("user", JSON.stringify(user))
        return user
    }
    return { user, setUser }
})