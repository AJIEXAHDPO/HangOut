import type { User } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
    const user = ref<User>()
    const setUser = (user: any) => {
        localStorage.setItem("user", JSON.stringify(user))
        return user
    }
    return { user, setUser }
})