import router from "@/router";

export const auth = async () => {
    try {
        const res = await fetch("http://localhost:8080/")
        if (!res.ok) {
            throw new Error("invalid login or password");

        }
        const data = await res.json();
        if (data.token) document.cookie = `token=${data}; SameSite=Strict; path=/; Secure`
    } catch (e: any) {
       alert(e.message)
    }
}

export const checkAuth = async () => {
    if (!document.cookie.includes("token")) {
        router.replace("/auth")
    }
}