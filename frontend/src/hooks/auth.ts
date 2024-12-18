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

export const isAuth = (): boolean => {
    if (!document.cookie.includes("token")) {
        return false
    }
    const tokenRaw = document.cookie.split(";").find(cookie => {
        return cookie.includes("token")
    })
    if (!tokenRaw) {
        return false
    }
    const token = tokenRaw.split("=")[1]
    if (!token) {
        return false
    }
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    console.log(tokenData)
    if (tokenData.exp < Date.now() / 1000) {
        return false
    }
    return true
}

export const logout = () => {
    document.cookie = "token=; SameSite=Strict; path=/; Secure"
}