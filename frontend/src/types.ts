export type User = {
    name: string,
    fio: string,
    id: number,
    avatar: string,
    lastSeen: string,
    isOnline: boolean,
    isTyping: boolean,
    isVerified: boolean,
    isAdmin: boolean,
}

export type Call = {
    id: number,
    type: string, // "incoming" | "outgoing" | "missed"
    duration: string,
    finishedAt: string,
    status: string,
    user: User,
}

export type Contant = {
    user: User,
    isBlocked: boolean,
    isMuted: boolean,
}